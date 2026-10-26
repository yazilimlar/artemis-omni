# M2.5 — Data Source Bridge (read-only contract)

Status: DESIGN ONLY. No live imports, provider credentials, tax records, or migrations are authorized by this document.

## Inputs
- Prime Industrial ERP: discover actual repository, deployed API, schema and license before writing adapter. Reuse accounting logic only after source verification; never assume the ERP data is owned by every ARTEMIS client.
- W-2: tax year, employer EIN (encrypted), Box 1/2/3/4/5/6/12/14, original document provenance and correction status.
- Filed returns: 1040, schedules, state returns, carryovers, payments and amendments, each tied to a filed version.
- TurboTax: ingest user-authorized PDF/CSV/TXF or other verified exports; do not claim a direct TurboTax API exists.
- Banks/cards: read-only transactions and statements, preserving account ownership and duplicate fingerprints.

## Canonical record contract
source_id; source_kind; source_record_id; tenant_client_id; legal_entity_id (nullable); tax_year; event_date; document_type; currency; gross_amount; tax_amount; net_amount; counterparty; source_sha256; import_batch_id; original_uri (private); evidence_status; reconciliation_status; extracted_fields_version; reviewer; recorded_at.

## Controls
1. Separate private storage buckets by tenant prefix, with verified storage RLS; do not upload until tested.
2. Authenticated user -> server session -> tenant membership check -> authorized import job. Never accept tenant ID as proof of permission.
3. Immutable originals, SHA-256 and deduplication; redact PII from logs, commits and AI prompts.
4. AI may suggest classifications; it cannot silently change the ledger or certify a return.
5. Intercompany transfers retain both sides with explicit elimination entries in consolidated reporting, not in source ledgers.
6. W-2/1099/returns are evidence, not automatically journal postings; prevent double-counting against bank deposits.
7. Every import produces an audit record and quarantine list for unrecognized columns, conflicting entities, or unsupported tax years.
8. External AI reviewers (Muse/Gemini/Claude) receive synthetic fixtures or owner-approved redacted excerpts only.

## Acceptance tests
- Cross-tenant read/write/list/download isolation for two real auth users and two distinct synthetic tenants.
- Revocation effective on next server request, including existing sessions.
- Idempotent repeated import; source correction creates new version, not overwrite.
- Reconciliation ties invoice -> receipt -> bank deposit -> ERP settlement without duplicate revenue.
- W-2 Box 1 and federal withholding reconcile to filed return lines; prior-year carryovers retain evidence.
- Invalid file, malformed CSV, malicious document and unsupported schema fail closed.

## Handoff: Muse / Gemini
Review the adapter contract, map Prime ERP actual data fields once discovered, challenge double-counting and tax-entity assumptions, propose synthetic test cases. No production edits, credentials, or private documents in external prompts.
