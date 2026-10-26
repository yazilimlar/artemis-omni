# Historical Tax Evidence Inventory — R1 (metadata only)

Date: 2026-10-25. Source: user-authorized connected Google Drive. This is a filename-based inventory, not verification of tax content or filing status. Do not store confidential source documents or extracted PII in this repository.

## Source folders
- Google Drive / `2024 tax backup: 63 items (60 files, 3 folders). Initial filename groups: wages 4; returns/forms 9; expense/support 17; audit/evidence 15; other 15; folders 3. Categories are provisional and overlap semantically.
- Google Drive / 2018 Tax Return: 1 PDF, content unverified.
- Google Drive / vergi uber tax: 8 DOCX files, tax years and content unverified.

## 2024 candidate evidence
- W-2: one named W-2 PDF; three late-year paystub PDFs. Do not infer completeness of wages.
- Federal: one named 2024 Form 1040 PDF and another named 2024 TaxReturn PDF; potential duplicates, not established.
- New York: IT-201 candidates, IT-196 worksheets/forms, DTF notices and correspondence; distinguish blank templates, drafts, filed returns and audit responses.
- Business/expenses: AG United expense spreadsheets/PDFs, invoices, statements, receipts and payment evidence. AG United is a distinct named counterparty/entity; do not assign to Great Order, ARTEMIS or personal tax ledger without ownership verification.
- Evidence: combined binder, evidence index, scanned support, audit correspondence. Possible nested duplication; compare hashes only within authorized private ingestion pipeline.

## Next verification gates
1. Build metadata-only manifest with provider file IDs, MIME, modified time, year candidate, document family and review status in private storage (not GitHub).
2. Read source documents only through a controlled authorization context and extract minimal required fields. Classify filed vs draft vs instructions vs evidence.
3. Cross-check W-2 against 1040 wage/withholding lines and NY IT-201 without changing filed amounts.
4. Confirm Prime Industrial ERP authoritative repository/deployment and adapter contract before integrating.
5. No automatic filing, tax advice determination, inter-entity transfers or external AI access to unredacted documents.

## Muse/Gemini handoff
Use this metadata-only inventory and M25_DATA_SOURCE_BRIDGE.md to propose classification rules, duplicate detection and synthetic fixtures. Request redacted evidence only after explicit approval.
