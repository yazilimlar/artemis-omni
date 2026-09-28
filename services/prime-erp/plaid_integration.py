#!/usr/bin/env python3
"""
Plaid bank integration for Prime Industrial ERP.
Handles TD Bank (x9102) connection, transaction sync, and reconciliation.
"""

import os, json, datetime
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from erp_db import get_conn

PLAID_CLIENT_ID = os.environ.get("PLAID_CLIENT_ID", "")
PLAID_SECRET    = os.environ.get("PLAID_SECRET", "")
PLAID_ENV       = os.environ.get("PLAID_ENV", "sandbox")  # sandbox | production

_ENV_MAP = {
    "sandbox":    plaid.Environment.Sandbox,
    "production": plaid.Environment.Production,
}

def _client():
    cfg = plaid.Configuration(
        host=_ENV_MAP.get(PLAID_ENV, plaid.Environment.Sandbox),
        api_key={"clientId": PLAID_CLIENT_ID, "secret": PLAID_SECRET},
    )
    return plaid_api.PlaidApi(plaid.ApiClient(cfg))


def create_link_token(user_id="prime-industrial-user"):
    """Create a Plaid Link token to start the OAuth flow in the browser."""
    client = _client()
    req = LinkTokenCreateRequest(
        user=LinkTokenCreateRequestUser(client_user_id=user_id),
        client_name="Prime Industrial ERP",
        products=[Products("transactions")],
        country_codes=[CountryCode("US")],
        language="en",
    )
    resp = client.link_token_create(req)
    return resp["link_token"]


def exchange_public_token(public_token: str) -> dict:
    """Exchange the public token (from Plaid Link callback) for an access token."""
    client = _client()
    resp = client.item_public_token_exchange(
        ItemPublicTokenExchangeRequest(public_token=public_token)
    )
    access_token = resp["access_token"]
    item_id      = resp["item_id"]

    # Fetch account details
    accts = client.accounts_get(AccountsGetRequest(access_token=access_token))
    institution_name = accts["item"].get("institution_id", "")
    accounts = accts["accounts"]

    # Store in DB — prefer checking/business checking for x9102
    with get_conn() as conn:
        existing = conn.execute(
            "SELECT id FROM plaid_items WHERE item_id=?", [item_id]
        ).fetchone()
        if not existing:
            conn.execute("""
                INSERT INTO plaid_items
                  (item_id, access_token, institution_id, institution_name)
                VALUES (?,?,?,?)
            """, [item_id, access_token, institution_name, institution_name])

    return {
        "item_id": item_id,
        "accounts": [
            {
                "account_id": a["account_id"],
                "name": a["name"],
                "official_name": a.get("official_name", ""),
                "mask": a["mask"],
                "type": str(a["type"]),
                "subtype": str(a.get("subtype", "")),
                "balance": a["balances"].get("current"),
            }
            for a in accounts
        ],
    }


def set_tracked_account(item_id: str, account_id: str, account_name: str,
                         account_mask: str, account_type: str):
    """Pin which account this item should track (e.g. x9102)."""
    with get_conn() as conn:
        conn.execute("""
            UPDATE plaid_items
               SET account_id=?, account_name=?, account_mask=?, account_type=?
             WHERE item_id=?
        """, [account_id, account_name, account_mask, account_type, item_id])


def sync_transactions(item_id: str) -> dict:
    """Pull new/modified/removed transactions using Plaid's cursor-based sync."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM plaid_items WHERE item_id=?", [item_id]
        ).fetchone()
    if not row:
        return {"error": "Item not found"}

    access_token  = row["access_token"]
    cursor        = row["cursor"] or ""
    tracked_acct  = row["account_id"]    # None = accept all accounts
    plaid_item_pk = row["id"]
    client        = _client()

    added_count = modified_count = removed_count = 0
    new_cursor  = cursor

    # Paginate until has_more is False
    has_more = True
    while has_more:
        req = TransactionsSyncRequest(
            access_token=access_token,
            cursor=new_cursor if new_cursor else None,
        )
        resp = client.transactions_sync(req)
        new_cursor = resp["next_cursor"]
        has_more   = resp["has_more"]

        for txn in resp["added"] + resp["modified"]:
            acct_id = txn["account_id"]
            if tracked_acct and acct_id != tracked_acct:
                continue
            _upsert_bank_txn(conn, txn, plaid_item_pk)
            added_count += 1

        for txn in resp["removed"]:
            txn_id = txn["transaction_id"]
            with get_conn() as c:
                c.execute("DELETE FROM bank_transactions WHERE plaid_txn_id=?", [txn_id])
            removed_count += 1

    with get_conn() as conn:
        conn.execute("""
            UPDATE plaid_items
               SET cursor=?, last_synced=datetime('now')
             WHERE item_id=?
        """, [new_cursor, item_id])

    return {"added": added_count, "modified": modified_count, "removed": removed_count}


def _upsert_bank_txn(conn_unused, txn, plaid_item_pk: int):
    cats = txn.get("category") or []
    with get_conn() as conn:
        conn.execute("""
            INSERT INTO bank_transactions
              (plaid_txn_id, plaid_item_id, account_id, date, authorized_date,
               name, merchant_name, amount, currency, category, pending)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(plaid_txn_id) DO UPDATE SET
               date=excluded.date, amount=excluded.amount,
               name=excluded.name, merchant_name=excluded.merchant_name,
               pending=excluded.pending
        """, [
            txn["transaction_id"], plaid_item_pk, txn["account_id"],
            str(txn["date"]), str(txn.get("authorized_date") or txn["date"]),
            txn["name"], txn.get("merchant_name") or txn["name"],
            txn["amount"],   # Plaid: positive = debit (expense), negative = credit (income)
            txn.get("iso_currency_code", "USD"),
            json.dumps(cats), int(txn.get("pending", False)),
        ])


def get_accounts_for_item(item_id: str) -> list:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT access_token FROM plaid_items WHERE item_id=?", [item_id]
        ).fetchone()
    if not row:
        return []
    client = _client()
    accts = client.accounts_get(AccountsGetRequest(access_token=row["access_token"]))
    return [
        {
            "account_id": a["account_id"],
            "name": a["name"],
            "official_name": a.get("official_name", ""),
            "mask": a["mask"],
            "type": str(a["type"]),
            "subtype": str(a.get("subtype", "")),
            "balance_current": a["balances"].get("current"),
            "balance_available": a["balances"].get("available"),
        }
        for a in accts["accounts"]
    ]


def auto_categorize(txn_name: str, amount: float) -> str:
    """Simple keyword-based ERP category suggestion."""
    name = txn_name.lower()
    if amount < 0:   # credit (money in)
        return "REVENUE"
    keywords = {
        "COGS":     ["supplier","wholesale","inventory","amazon","alibaba","freight","shipping cost"],
        "TAX":      ["irs","tax","revenue dept","ny state","sales tax"],
        "FEE":      ["stripe","squarespace","paypal","fee","processing","merchant"],
        "TRANSFER": ["transfer","zelle","wire","ach","payroll"],
        "EXPENSE":  ["insurance","utilities","rent","office","supplies","software","subscription","ups","fedex","usps"],
    }
    for cat, words in keywords.items():
        if any(w in name for w in words):
            return cat
    return "OTHER"
