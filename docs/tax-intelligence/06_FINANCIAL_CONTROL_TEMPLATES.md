# 06 — Financial Control Templates

**Version:** v0.1 · **Status (every template in this file):** DRAFT_ASSUMPTION · **Approval state:** UNAPPROVED · **Effective:** TBD
**Prepared by:** Gemini role (accounting / legal-document challenger), M2.8 Documentation Foundation

> Every form below is a **fill-in skeleton**. `{{PLACEHOLDER}}` fields are unresolved by design — a blank or placeholder field is an honest UNKNOWN, never an invitation to pre-fill from assumption. No template in this file is an official form, an executed record, or evidence of anything. **A completed copy of a template is a draft record; it becomes evidence only when tied to source documents listed in 04_DOCUMENT_REQUEST_CHECKLIST.md.** Tax-treatment fields default to `UNKNOWN` everywhere and may be changed only through the Decision Register (03) with CPA review — never by the person filling in the form.

Common header for every completed form instance: `{{FORM_ID}} · {{ENTITY_ID}} · {{PERIOD}} · prepared by {{PREPARER}} · reviewed by {{REVIEWER}} · status {{STATUS}} · version {{FORM_VERSION}} · source document refs {{EVIDENCE_REFS}}`

---

## (a) Chart of accounts skeleton

Account code ranges are structural placeholders for one entity's chart. Each entity keeps its **own** chart; there is no shared cross-entity chart in v0.1 (see Challenger Note 2).

| Code range | Class | Example account (placeholder name) | Entity scope | Tax treatment |
|---|---|---|---|---|
| 1000–1499 | Assets — current | `{{ACCOUNT_NAME}}` (e.g. operating cash, per account inventory ref `{{ACCOUNT_REF}}`) | `{{ENTITY_ID}}` only | UNKNOWN |
| 1500–1999 | Assets — non-current | `{{ACCOUNT_NAME}}` | `{{ENTITY_ID}}` only | UNKNOWN |
| 2000–2499 | Liabilities — current | `{{ACCOUNT_NAME}}` (incl. sales tax collected payable — see Note 5) | `{{ENTITY_ID}}` only | UNKNOWN |
| 2500–2999 | Liabilities — non-current | `{{ACCOUNT_NAME}}` | `{{ENTITY_ID}}` only | UNKNOWN |
| 3000–3999 | Equity / capital | `{{ACCOUNT_NAME}}` | `{{ENTITY_ID}}` only | UNKNOWN |
| 4000–4999 | Revenue | `{{ACCOUNT_NAME}}` — merchandise revenue is recognised from **order** evidence, never from payouts or invoices counted twice (M2.7 §4) | `{{ENTITY_ID}}` only | UNKNOWN |
| 5000–5999 | Cost of sales | `{{ACCOUNT_NAME}}` | `{{ENTITY_ID}}` only | UNKNOWN |
| 6000–7999 | Operating expenses | `{{ACCOUNT_NAME}}` (processor fees post here; fees are not netted against revenue) | `{{ENTITY_ID}}` only | UNKNOWN |
| 8000–8999 | Other income / expense | `{{ACCOUNT_NAME}}` (seller credits/debits post explicitly, never netted silently) | `{{ENTITY_ID}}` only | UNKNOWN |
| 9000–9999 | Suspense / unclassified | `{{ACCOUNT_NAME}}` — every balance here is an open exception with an owner and a resolution date `{{RESOLUTION_DATE}}` | `{{ENTITY_ID}}` only | UNKNOWN |

Per-account fields: `accountCode`, `accountName`, `entityScope: {{ENTITY_ID}}`, `normalBalance: debit|credit`, `taxTreatment: UNKNOWN` (default, locked), `evidenceBasis: {{EVIDENCE_REFS}}`, `activeFrom/activeTo`.

## (b) Cost center list template

| Cost center code | Name | Entity scope | Type | Owner | Active from | Active to | Notes |
|---|---|---|---|---|---|---|---|
| `{{CC_CODE}}` | `{{CC_NAME}}` | `{{ENTITY_ID}}` | operations \| project \| brand-support \| admin | `{{OWNER}}` | `{{DATE}}` | `{{DATE_OR_BLANK}}` | A cost center is an **internal subdivision of one legal entity**. A brand or project cost center does **not** create a legal party and cannot be invoiced, own assets, or be a counterparty (see Challenger Note 2). |

Allocation rule field (required if a cost center receives shared costs): `basis: {{ALLOCATION_BASIS}} · evidence: {{EVIDENCE_REFS}} · approved by: {{APPROVER}} · status: UNAPPROVED until approved`.

## (c) Accrual journal entry form

```
Journal entry ID: {{JE_ID}}        Entity: {{ENTITY_ID}}        Period: {{PERIOD}}
Type: accrual | reversal | correction        Prepared: {{DATE}} by {{PREPARER}}
Narrative (what obligation/expense this recognises, in plain words): {{NARRATIVE}}
Supporting evidence refs (contract, bill, statement — from register 04): {{EVIDENCE_REFS}}
Reversal date / condition: {{REVERSAL_TERMS}}

Lines:
| Line | Account code | Cost center | Debit (cents) | Credit (cents) | Tax treatment |
| {{N}} | {{ACCOUNT_CODE}} | {{CC_CODE}} | {{AMOUNT_CENTS}} | {{AMOUNT_CENTS}} | UNKNOWN |

Total debits: {{TOTAL_DEBITS}}  Total credits: {{TOTAL_CREDITS}}  Balanced: {{YES_NO}}
Approval: {{APPROVER}} / status UNAPPROVED until signed in the approval system.
```
Rules: amounts in integer cents; an accrual without an evidence ref is a draft, not a posting; a correction entry references the original `{{JE_ID}}` — originals are never edited.

## (d) Expense claim form

```
Claim ID: {{CLAIM_ID}}        Claimant: {{CLAIMANT_REF}}        Entity charged: {{ENTITY_ID}}
Date incurred: {{DATE}}        Cost center: {{CC_CODE}}        Category: {{CATEGORY}}
Amount: {{AMOUNT_CENTS}} cents, currency USD (other currencies: record original + rate source {{FX_SOURCE}})
Merchant/payee (as on receipt): {{PAYEE}}        Business purpose: {{PURPOSE}}
Receipt ref (register 04 item): {{RECEIPT_REF}}   Receipt attached & legible: {{YES_NO}}
Paid by: claimant | entity card | entity account — ref {{PAYMENT_REF}}
Tax treatment: UNKNOWN (claimant never asserts deductibility on this form)
Approval: {{APPROVER}} status UNAPPROVED · Reimbursement status: {{STATUS}}
```
Rules: no receipt → claim is recorded as **unsupported** and listed as an exception; it is not rejected silently and not approved silently. Personal/entity mixed expenses are split into separate lines, never blended.

## (e) Invoice template

```
INVOICE — DRAFT TEMPLATE OUTPUT
**This is not a tax invoice unless entity registration is verified** (register 04 item 6.3; invoice may be re-issued in tax-invoice form only after that verification is recorded).

Invoice no.: {{INVOICE_NO}}        Issue date: {{DATE}}        Due date: {{DATE}}
Seller legal name: {{SELLER_LEGAL_NAME}} (must be a verified legal entity — a brand name alone is not a seller)
Seller entity ref: {{ENTITY_ID}}    Buyer legal name: {{BUYER_LEGAL_NAME}}  Buyer ref: {{COUNTERPARTY_REF}}
Contract / SOW ref: {{CONTRACT_REF}}

Lines:
| # | Description | Qty | Unit amount (cents) | Line amount (cents) | Tax collected on line (cents) |
| {{N}} | {{DESCRIPTION}} | {{QTY}} | {{UNIT_CENTS}} | {{LINE_CENTS}} | {{TAX_CENTS}} |

Merchandise subtotal: {{MERCHANDISE_CENTS}}
Sales tax collected: {{TAX_COLLECTED_CENTS}} (shown separately; never folded into merchandise)
Total: {{TOTAL_CENTS}}
Payment instructions ref: {{PAYMENT_INSTRUCTIONS_REF}} (instructions live in the verified vendor/client master record, not retyped here)
```
Rules: merchandise and collected tax are always separate lines of the total (mirrors M2.7 Amendment A1 — a lump total destroys the payout identity downstream); the invoice evidences a **claim to payment**, not revenue received and not a second revenue event alongside the processor charge.

## (f) AP / AR aging skeleton

```
Aging report ID: {{AGING_ID}}  Entity: {{ENTITY_ID}}  As of: {{AS_OF_DATE}}  Basis: invoice/statement dates from source documents only
Buckets (days): current | 1–30 | 31–60 | 61–90 | 90+

AR rows:
| Counterparty ref | Invoice no. | Issue date | Due date | Open amount (cents) | Bucket | Evidence ref | Disputed? |
| {{COUNTERPARTY_REF}} | {{INVOICE_NO}} | {{DATE}} | {{DATE}} | {{AMOUNT_CENTS}} | {{BUCKET}} | {{EVIDENCE_REFS}} | {{YES_NO}} |

AP rows:
| Counterparty ref | Supplier invoice / statement ref | Date | Due date | Open amount (cents) | Bucket | Evidence ref | Disputed? |
| {{COUNTERPARTY_REF}} | {{SUPPLIER_REF}} | {{DATE}} | {{DATE}} | {{AMOUNT_CENTS}} | {{BUCKET}} | {{EVIDENCE_REFS}} | {{YES_NO}} |

Total AR open: {{TOTAL_AR}}   Total AP open: {{TOTAL_AP}}
Reconciliation note: {{NOTE}} — totals must tie to the ledger and to supplier statements (register 04 items 3.3, 5.4); unapplied payments are listed separately, never netted against balances by assumption.
```

## (g) Processor payout reconciliation workpaper

Reuses the **M2.7 canonical schema (R2)** identity and node model exactly. All amounts integer USD cents. Each component must be supported by amount-bearing allocations to the specific payout (M2.7 C4) — aggregate equality alone never certifies.

```
Workpaper ID: {{WP_ID}}  Entity: {{ENTITY_ID}} (legalEntityId or UNKNOWN)  Processor account ref: {{ACCOUNT_REF}}
Period: {{PERIOD}}  Payout provider event key: {{PAYOUT_KEY}}  Prepared/reviewed: {{PREPARER}} / {{REVIEWER}}

Expected payout identity:
  merchandise (charge_merchandise allocated)        {{MERCHANDISE_CENTS}}
+ sales tax collected (charge_tax_collected)        {{TAX_COLLECTED_CENTS}}
− merchandise refunds (refund_merchandise)          {{REFUND_MERCH_CENTS}}
− tax refunds (refund_tax)                          {{REFUND_TAX_CENTS}}
− fees                                              {{FEE_CENTS}}
− seller debits                                     {{DEBIT_CENTS}}
+ seller credits                                    {{CREDIT_CENTS}}
− tax withheld (withheld_to_payout)                 {{WITHHELD_CENTS}}
= EXPECTED PAYOUT                                   {{EXPECTED_CENTS}}

Observed payout (processor report ref {{REPORT_REF}}): {{OBSERVED_CENTS}}   Variance: {{VARIANCE_CENTS}}
Bank deposit observed: {{DEPOSIT_CENTS}} via payout_to_bank edge, grounded ref check: {{GROUNDED_YES_NO}}
  (grounded ref = bank-match:<payout key>:<deposit key>; ungrounded → DEPOSIT_ATTRIBUTION_UNVERIFIED, cannot be matched)
Remainder by node (pending, not exception): {{REMAINDERS}}
Status: matched | pending | exception — matched certifies SETTLEMENT ARITHMETIC ONLY, never tax treatment or entity ownership.
Entity scope: VERIFIED_SINGLE_ENTITY | CONTAINS_UNKNOWN → {{ENTITY_SCOPE}}
Exceptions: {{EXCEPTION_CODES_WITH_NODE_EDGE_IDS}}
```

**Canonical oracles (synthetic, from M2.7):** merchandise 10000 + tax collected 700 − fee 300 = **expected payout 10400** (not withheld); with tax withheld 700 → **expected payout 9700**. **9000 is not a valid oracle** — it double-subtracts collected tax and is rejected in all cases.

## (h) Sales-tax workpaper

```
Workpaper ID: {{WP_ID}}  Entity: {{ENTITY_ID}}  Jurisdiction: {{JURISDICTION}}  Registration ref: {{REGISTRATION_REF_OR_UNKNOWN}}
Period: {{PERIOD}}  Basis: arithmetic tracking only — this workpaper computes a position; it does not determine legal liability.

  Tax collected (charge_tax_collected, allocated)     {{COLLECTED_CENTS}}
− Tax refunded (refund_tax)                           {{REFUNDED_TAX_CENTS}}
− Tax withheld by processor (tax_withheld)            {{WITHHELD_CENTS}}
− Tax directly remitted by the entity                 {{DIRECTLY_REMITTED_CENTS}}
= ARITHMETIC TAX POSITION                             {{POSITION_CENTS_OR_UNKNOWN}}

Pathway evidence: {{PATHWAY_EVIDENCE_REFS}} (processor tax report / remittance confirmation — register 04 item 4.4)
Remittance-of-withheld amounts (withheld_to_remittance edges) are the SAME money as withheld above — never subtracted twice.
PATHWAY-UNKNOWN RULE: if a remittance cannot be distinguished as (remittance of withheld) vs (direct remittance),
  record pathway UNKNOWN, position = UNKNOWN, status = exception TAX_PATHWAY_UNKNOWN.
  Never guess a pathway to make the position compute.
Filing status: NOT FILED / NOT AUTHORISED — no filing is made from this workpaper without owner + CPA approval (U3).
```

## (i) W-2 / 1099 intake checklist

Documents are requested and referred to **by official form name/number only**; this checklist creates no form and reproduces none.

```
Intake ID: {{INTAKE_ID}}  Entity/individual scope: {{ENTITY_ID}}  Tax year: {{YEAR}}  Preparer: {{PREPARER}}

For each document: ☐ requested ☐ received ☐ verified (issuer, year, recipient identity, amount tie-out) — storage: private secure store, secret-class
☐ Form W-2 (Wage and Tax Statement) — per employer
☐ Form 1099-NEC (Nonemployee Compensation) — per payer / per contractor issued
☐ Form 1099-MISC — where applicable
☐ Form 1099-K (Payment Card / Third-Party Network Transactions) — per processor
☐ Form 1099-INT / 1099-DIV / 1099-B — where applicable
☐ Year-end payroll summaries and quarterly payroll filing copies (register 04 item 7.3)
☐ Contractor tax information forms received (register 04 item 3.2)

RULES:
- Every document received is EVIDENCE for reconciliation. It is NEVER booked as new ledger income:
  wages, contractor payments, and processor volumes are already represented in payroll/ledger/settlement
  records; booking the information return again double-counts income (M2.6/M2.7 rule).
- A 1099-K gross volume is not revenue: it includes collected tax, refunds, and fees. Tie to workpaper (g); differences are expected and explained, not "corrected".
- Missing document for a known payer = open exception with follow-up date {{FOLLOW_UP_DATE}}, not a zero.
- Amount mismatches go to the exception list with both figures preserved; neither figure is overwritten.
```

## (j) Quarterly / year-end closing checklist

```
Close ID: {{CLOSE_ID}}  Entity: {{ENTITY_ID}}  Period: {{PERIOD}} (quarter | year-end)  Status: OPEN
Each step: ☐ done (evidence ref required) ☐ not applicable (reason required) ☐ blocked (exception ref required)

☐ All processor payouts in period reconciled on workpaper (g); statuses and exceptions listed
☐ Sales-tax workpaper (h) completed per jurisdiction; pathway-unknown items carried as UNKNOWN
☐ Bank accounts reconciled to statements (register 04 item 4.1); unapplied items listed, none netted by assumption
☐ AR aging (f) tied to issued invoices and payment confirmations; AP aging (f) tied to supplier statements
☐ Accruals reviewed: each open accrual has evidence ref and reversal terms (form c); suspense (9xxx) balances all have owners and resolution dates
☐ Expense claims (d) all either receipt-supported or listed as unsupported exceptions
☐ W-2/1099 intake (i) complete for the year, or missing-document exceptions listed with follow-up dates
☐ Intercompany / intra-entity review: every "intercompany" entry names two VERIFIED DISTINCT legal entities;
   anything else is reclassified as an internal transfer/allocation before close (see Challenger Note 2)
☐ New documents received this period added to register 04 with verification gates passed — no silent status upgrades
☐ Decisions U1–U4 re-read: any treatment relied on this period that still rests on UNKNOWN is disclosed in the close memo
☐ Close memo: preparer {{PREPARER}}, reviewer {{REVIEWER}}, exceptions carried forward {{EXCEPTION_REFS}}, status UNAPPROVED until owner review
```

---

## Challenger notes — accounting / legal-document risks in the charter, schema, and inventory

1. **Classification-by-default risk.** The charter and inventory repeatedly pair a draft with its subject (e.g. "sales tax workpaper" beside "tax treatment"), which invites the reader to treat the *existence* of a form as a classification. **Guard:** tax-treatment fields are locked to UNKNOWN in every template (done above); any change requires a Decision Register entry citing register-04 evidence and CPA review. A template must never be the evidence for its own field.

2. **Intra-entity vs intercompany trap.** The inventory's agreement catalog lists "intercompany billing (only where distinct legal parties exist)" — but U2 is unresolved, so today *no* pair of parties is verified distinct. Any "intercompany" invoice, loan, or cost allocation created now risks being a legal fiction: transfers inside one legal entity are allocations, not agreements, and carry no counterparty rights. **Guard:** intercompany templates stay unusable until two §1-verified entities exist for that edge; the closing checklist (j) forces reclassification review every period.

3. **Form-vs-evidence confusion.** A filled template looks like a record. The schema's Document registry mitigates this only if `status` and `signatureStatus` are enforced dimensions — a SCANNED signed agreement and a generated draft of the same agreement are different documents with different hashes and must never share an ID lineage. **Guard:** generated drafts carry DRAFT_ASSUMPTION in the document body (not just metadata); the register records source evidence and generated drafts in separate classes (per schema invariant), and 04's verification gates — not document resemblance — are the only upgrade path.

4. **Ownership-edge overreach.** The schema's example edges ("may own brand", "may own domain") are `asserted` at best. Registers 01/02 will be read by future tooling and people as ground truth. **Guard:** confidence is displayed wherever an edge is rendered, exports strip or flag non-verified edges, and the tax kernel must refuse to consume any edge below `supported` for entity attribution (it already fails closed on UNKNOWN entity — keep it that way).

5. **Collected tax is a liability, not revenue — chart design risk.** If the COA maps collected tax into a revenue or clearing account that also carries merchandise, the M2.7 payout identity breaks downstream and the R1-era 9000 error returns in ledger form. **Guard:** collected tax posts only to a dedicated liability account (2xxx above); the payout workpaper (g) reconciles to that account; lump "gross receipts" accounts are prohibited in the template.

6. **Pathway ambiguity will recur at scale.** Processor reports that merge withheld and directly-remitted amounts are the norm, not the exception; U1 cannot close on reports that don't separate pathways. **Guard:** item 4.4's gate (pathway indistinguishable → UNKNOWN) is non-waivable by preparers; closing the U1 decision requires a processor report format that separates the pathways, or a CPA-documented allocation method recorded as a decision — not a preparer habit.

7. **Information-return double-counting.** 1099-K gross volumes and W-2/1099 documents will inevitably be proposed as "income" by downstream tooling or a hurried preparer. **Guard:** checklist (i) states the evidence-only rule inline, and any import path for these documents must land in an evidence store, never a posting interface.

8. **Effective-date and supersession drift.** The schema requires reproducible prior snapshots, but the templates are versioned files in a working folder — a quietly edited template retroactively changes what "v0.1" meant. **Guard:** templates are committed with hashes per version; completed form instances cite `{{FORM_VERSION}}`; superseded templates are retained and marked SUPERSEDED, never deleted or edited in place.

9. **Secret-class leakage through registers.** Registers want identifiers "for reference"; EINs, account numbers, and tax IDs will creep into ID fields. **Guard:** registers store hashes and masked fragments only (per 04 items 1.2, 3.2, 4.1); any full identifier found in a register or repo file is a U4 privacy exception, logged and remediated — not quietly edited away (history persists).

10. **Approval-state inflation.** "Reviewed" by another AI model or a preparer is not approval; the charter's states are distinct and the multi-AI workflow creates social pressure to upgrade. **Guard:** only the owner (or a recorded delegated authority from register 04 item 1.3 evidence) can set APPROVED_INTERNAL or EXECUTED; model review maps to DRAFT_REVIEWED at most, and every status carries who/when/basis.
