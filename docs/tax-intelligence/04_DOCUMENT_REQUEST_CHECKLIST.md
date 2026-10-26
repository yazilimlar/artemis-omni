# 04 — Document Request Checklist / Missing-Evidence Register

**Version:** v0.1 · **Status:** DRAFT · **Approvals:** NONE
**Prepared by:** Gemini role (accounting / legal-document challenger), M2.8 Documentation Foundation
**Authority:** M28 Charter R01, Relationship Schema R01, Evidence and Draft Inventory R01

> This register requests **originals or authoritative copies from their source**. Nothing on this list may be satisfied by an AI-generated document, a template, a screenshot of a summary, or a matching string key. Every item below is **UNKNOWN / NOT RECEIVED** unless a foundation document proves otherwise — at v0.1, none does. **No item on this list is stored in public GitHub.** Received originals go only to the approved private secure store, referenced from the repository by opaque ID and content hash only (never by filename containing personal identifiers, never by content).

## How to read this register

- **Unblocks** — the register, workpaper, or decision (U1–U4) that cannot move past DRAFT_ASSUMPTION / UNKNOWN until the item is received and verified.
- **Verification gate on receipt** — the check that must pass before the item's status may change from `NOT RECEIVED` to `EVIDENCE_RECEIVED`, and separately to `EXTERNALLY_VERIFIED`. Receipt alone never upgrades a decision.
- **Storage rule (applies to every row):** private secure store only, access-controlled, tenant-scoped; **NEVER public GitHub, never a public Vercel asset, never an email attachment as the system of record.** The public repository may hold only: item ID, document type, status, content hash, and provenance reference.

Decision key: **U1** processor withholding/remittance · **U2** entity ownership · **U3** tax treatment · **U4** history/privacy remediation.

---

## 1. Legal entity

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 1.1 | Formation / incorporation documents for each claimed legal entity | U2; Entity register (01); every relationship edge that asserts a legal party | Issuing state authority record or certified copy from the entity's registered agent | UNKNOWN / NOT RECEIVED | Jurisdiction and entity name match the register claim exactly; document is a formation record, not a trade-name filing; hash recorded |
| 1.2 | Tax ID issuance confirmation letter (e.g. IRS CP 575 or equivalent for non-US entities) | U2, U3; entity register identifiers; any future filing intake | Issuing tax authority original letter | UNKNOWN / NOT RECEIVED | **Handled as a secret-class document:** stored encrypted, referenced by hash only; the ID value itself never appears in any register, template, or repo file |
| 1.3 | Operating agreement / bylaws, plus all amendments | U2; ownership percentages, manager/member authority, delegated-authority register | Executed copy from the entity's records custodian | UNKNOWN / NOT RECEIVED | Signature pages present; amendment chain complete (each amendment references the prior version); ownership stated here — and only here or in 1.4 — is what the register may record |
| 1.4 | Ownership / membership ledger (cap table equivalent) current as of a stated date | U2; resolves provisional "may own" edges in the Relationship Schema examples | Entity's official records, signed by an authorised officer/manager | UNKNOWN / NOT RECEIVED | Dated and signed; reconciles to 1.3; any conflict with 1.3 keeps U2 at UNKNOWN and both documents are flagged `disputed` |
| 1.5 | Good-standing / active-status certificate, recent | U2; entity register `status` field | State authority, dated within {{RECENCY_WINDOW_DAYS}} days of use | UNKNOWN / NOT RECEIVED | Date checked; an expired certificate supports no status claim |
| 1.6 | Registered agent and principal address record | Entity register; service-of-process and notice clauses in agreement templates | State authority record | UNKNOWN / NOT RECEIVED | Matches 1.1; changes require a superseding record, never an edit-in-place |

## 2. Brands and IP

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 2.1 | Trademark filings / registrations for each brand asserted | U2 (brand ownership edges); brand/IP register | Trademark office record (application or registration) in the owner's name | UNKNOWN / NOT RECEIVED | Registrant name must match a verified legal entity from §1; a filing in an individual's or a different entity's name leaves the edge `asserted`, not `verified` |
| 2.2 | Domain registration records for each domain asserted | U2 ("may own domain" edges); technology workstream | Registrar record showing registrant organisation and expiry | UNKNOWN / NOT RECEIVED | Registrant matches a §1 entity or is explicitly recorded as held by another party; privacy-shielded records that hide the registrant support no ownership claim |
| 2.3 | Source-code licence texts for third-party components in use | IP/open-source licence notice template; distribution decisions | The upstream project's licence file as distributed | UNKNOWN / NOT RECEIVED | Licence text is the upstream original, hash-matched to the version in use; summaries or paraphrases are not evidence |
| 2.4 | Contributor / contractor IP assignment agreements (executed) | U2; IP register; contractor template in the agreement catalog | Executed agreements from each contributor/contractor | UNKNOWN / NOT RECEIVED | Signature status = EXECUTED and counterparty identity verified; an unsigned template satisfies nothing |
| 2.5 | Brand/IP assignment or licence between entities, if any is claimed to exist | Intercompany/IP edges in Relationship Register (02) | Executed instrument between two **verified distinct** legal entities | UNKNOWN / NOT RECEIVED | Both parties verified under §1; if the parties turn out to be the same legal entity, the document is reclassified as an internal memo — it was never an intercompany agreement |

## 3. Client / vendor

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 3.1 | Executed client contracts / MSAs / SOWs | Revenue recognition basis; AR aging integrity; Relationship Register commercial edges | Executed copies from the entity's records or counterparty confirmation | UNKNOWN / NOT RECEIVED | Both signatures present; effective dates recorded; the contracting party is a §1-verified entity — a contract naming a brand only is flagged, not silently mapped to an entity |
| 3.2 | Tax information forms from counterparties where applicable (e.g. Form W-9 for US vendors, Form W-8 series for non-US) — requested by official form name only | U3; 1099 intake checklist (§06 item i); vendor master data | Completed form from the counterparty | UNKNOWN / NOT RECEIVED | Stored as secret-class (contains tax IDs); completeness checked against the current official form revision; never transcribed into a register |
| 3.3 | Supplier / vendor statements of account | AP aging verification; outstanding-obligations register | Statement issued by the supplier | UNKNOWN / NOT RECEIVED | Statement period and balance reconciled to AP aging; differences logged as exceptions, not adjusted away |
| 3.4 | Vendor onboarding records (banking instructions as originally provided) | Payment authorisation controls; fraud prevention | Original instruction from the vendor through an independent channel | UNKNOWN / NOT RECEIVED | Any later change of payment instructions requires out-of-band re-verification before use; the original is never overwritten |
| 3.5 | Client/vendor master-data source records (legal name, address, contact) | Master data templates; invoice template counterparty fields | Counterparty-provided record | UNKNOWN / NOT RECEIVED | Legal name checked against 3.1 where a contract exists; brand/trade names recorded as aliases, never as the legal party |

## 4. Banking / processor

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 4.1 | Bank statements for each account in the account inventory, per period reconciled | Payout reconciliation workpaper (§06 item g); treasury workstream | Statements issued by the bank | UNKNOWN / NOT RECEIVED | Account holder name matches a §1 entity; account identifier stored masked (last digits only in any register); statement is complete for the period — partial exports are flagged |
| 4.2 | Processor settlement / payout reports per payout | **U1**; workpaper (g) expected-vs-observed payout | Report issued by the payment processor for the account | UNKNOWN / NOT RECEIVED | Payout identity (provider event key) ties report line → payout node → bank deposit; aggregate totals alone do not verify (M2.7 C4 rule) |
| 4.3 | Processor fee schedules / fee reports | **U1**; fee component of the payout identity | Processor-issued schedule/report in force for the period | UNKNOWN / NOT RECEIVED | Schedule effective dates cover the transactions reconciled; a current schedule does not prove historical fees |
| 4.4 | Processor tax reports: amounts collected, withheld, and remitted, with the remittance pathway identified | **U1, U3**; sales-tax workpaper (§06 item h) | Processor-issued tax report and/or remittance confirmation to the tax authority | UNKNOWN / NOT RECEIVED | **Pathway must be distinguishable** (withheld-then-remitted vs directly remitted). If the report cannot distinguish the pathway, the workpaper records **UNKNOWN** — the amounts are never guessed or double-subtracted (M2.7 C2 rule) |
| 4.5 | Account authorisation / mandate records (who may operate each account) | Delegated-authority register; security workstream | Bank/processor authorisation record | UNKNOWN / NOT RECEIVED | Named operators match the authority register; departed operators still listed = exception, escalated same day |
| 4.6 | Processor and bank account opening / ownership records | U2 (account-to-entity mapping); account inventory | Institution-issued record | UNKNOWN / NOT RECEIVED | Account holder is a §1-verified entity; an account held personally but used for entity activity is recorded as exactly that — a finding, not a mapping fix |

## 5. Accounting

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 5.1 | Existing bookkeeping ledger / general ledger export, with its chart of accounts as actually used | COA template (§06 item a) mapping; opening balances | Export from the bookkeeping system of record | UNKNOWN / NOT RECEIVED | Export period and entity scope stated; the as-used COA is preserved as evidence before any template mapping — the template never overwrites history |
| 5.2 | Receipts and supplier invoices supporting recorded expenses | Expense claim and accrual integrity; AP | Original receipts/invoices from issuers | UNKNOWN / NOT RECEIVED | Each document ties to a ledger line by amount, date, and counterparty; unsupported lines are listed as exceptions |
| 5.3 | Issued sales invoices as sent to customers | AR aging; revenue tie-out to processor charges | Copies as issued (system-generated) | UNKNOWN / NOT RECEIVED | Invoice total ties to order/charge evidence; an invoice is evidence of a claim, not of payment |
| 5.4 | Payment confirmations (bank/processor) for settlements of AP/AR | Closing checklist (§06 item j) | Institution confirmations | UNKNOWN / NOT RECEIVED | Confirmation ties to the specific invoice/statement line it settles; unapplied payments stay unapplied until tied |
| 5.5 | Prior-period financial statements / trial balances, if any exist | Opening position for any future reporting | As prepared, with preparer identified | UNKNOWN / NOT RECEIVED | Preparer and basis recorded; unaudited statements are labelled unaudited everywhere they are referenced |

## 6. Tax

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 6.1 | Filed tax returns for each entity/individual in scope, per year (federal/state/local as applicable) | **U3**; tax calendar; return-position consistency | As-filed copies with filing confirmation | UNKNOWN / NOT RECEIVED | Filing confirmation (acknowledgement/receipt) present; a prepared-but-unfiled draft is a different document class and is labelled as such |
| 6.2 | Tax authority notices and correspondence | U3; obligation register (assessments, deadlines) | Original notices from the authority | UNKNOWN / NOT RECEIVED | Notice date, response deadline, and matter recorded as an Obligation; notices are never summarised away — the original is the record |
| 6.3 | Sales-tax registrations / permits for each jurisdiction where collection occurs or is claimed | U3; sales-tax workpaper (h) jurisdiction fields | Registration issued by the jurisdiction | UNKNOWN / NOT RECEIVED | Registration holder matches a §1 entity and covers the collection period; collecting without a located registration is an exception for CPA review |
| 6.4 | Wage and information documents received/issued (e.g. Form W-2, Form 1099 series) — by official form name | U3; intake checklist (§06 item i) | Documents as issued by the employer/payer or as filed by the entity | UNKNOWN / NOT RECEIVED | **Evidence only:** receipt supports reconciliation to records; the document is never booked as new ledger income (M2.6/M2.7 rule); stored secret-class |
| 6.5 | Entity classification elections / determinations, if any were made | **U3** (entity classification drives treatment) | Filed election or authority determination | UNKNOWN / NOT RECEIVED | Absence of an election is recorded as "no election located — classification UNKNOWN", never as a default classification |
| 6.6 | Prior CPA / advisor opinions relied upon, if any | U3; decision register provenance | Signed advisor document | UNKNOWN / NOT RECEIVED | Scope and date of the opinion recorded; an opinion on different facts or a prior year supports no current treatment by itself |

## 7. Property and payroll

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 7.1 | Property tax bills for each property in scope | Obligation register; accrual templates | Bills issued by the taxing authority | UNKNOWN / NOT RECEIVED | Parcel/property identification matches the asset schedule; owner named on the bill is recorded as stated — mismatches are findings |
| 7.2 | Mortgage / loan statements for property or entity borrowing | Obligation register; liability completeness | Statements issued by the lender/servicer | UNKNOWN / NOT RECEIVED | Borrower name and balance tie to the register; statements are evidence of the servicer's claim, reconciled — not copied as ledger truth without tie-out |
| 7.3 | Payroll records (registers, filings, payment confirmations) for any period with workers | Payroll intake; W-2/1099 intake (i) | Payroll provider or internal records as produced | UNKNOWN / NOT RECEIVED | Worker classification (employee vs contractor) is evidenced by engagement documents, not by the payroll record alone; secret-class storage |
| 7.4 | Insurance policies / certificates for property and operations | Risk register; agreement template insurance clauses | Issued policy documents | UNKNOWN / NOT RECEIVED | Policy period covers the period claimed; named insured matches a §1 entity or the mismatch is recorded |
| 7.5 | Asset acquisition documents (deeds, purchase agreements, titles) | Asset schedule; entity-ownership of assets (U2-adjacent) | Executed/recorded instruments | UNKNOWN / NOT RECEIVED | Recorded instruments preferred over unrecorded copies; holder name as stated, never normalised to the expected entity |

## 8. Security

| # | Item requested | Why it is needed (unblocks) | Source / original expected | Status | Verification gate on receipt |
|---|---|---|---|---|---|
| 8.1 | Current access-grant inventory for repositories, stores, processors, and banking (who has what, granted when, by whom) | **U4**; access matrix (07); security gate | System-generated grant lists per platform | UNKNOWN / NOT RECEIVED | Grants reconciled to the authority register (4.5); unexplained grants are exceptions; the inventory is a snapshot with a date, not a standing claim |
| 8.2 | Row-level security (RLS) policies and tenant-isolation configuration as deployed | U4-adjacent; M2.7 security gate (still BLOCKED) | Configuration/policy export from the platform | UNKNOWN / NOT RECEIVED | Policy text alone is not a pass: the gate additionally requires executed two-role denial test evidence (per M2.7 §8) — config receipt does not close the gate |
| 8.3 | Storage / bucket policies and download-access configuration | Security gate; evidence-store design | Platform configuration export | UNKNOWN / NOT RECEIVED | Same rule as 8.2: configuration is evidence of intent; a download-denial test is evidence of effect. Both are required, separately |
| 8.4 | Repository exposure inventory (what personal/financial identifiers exist in public history, where) | **U4** (scoped remediation decision) | Scoped scan output, stored privately | UNKNOWN / NOT RECEIVED | Scan scope and method recorded; output itself is confidential (it maps the exposure) — private store only; any history rewrite remains owner-decision-only |
| 8.5 | Secrets-management inventory (where credentials live, rotation state) — **locations and states only, never the secrets** | Security workstream; connector consent records | Owner/administrator attestation + platform metadata | UNKNOWN / NOT RECEIVED | No secret value is ever written into this register or any repo; an attestation is `asserted` confidence until platform metadata supports it |

---

## 9. Backups and source of truth

| # | Item | Why it is needed | Expected definition / evidence | Status | Verification gate |
|---|---|---|---|---|---|
| 9.1 | Source-of-truth designation per record class (documents, ledger, registers) | Prevents divergent copies becoming competing truths | A written designation per class, owner-approved | UNKNOWN / NOT RECEIVED | Designation names one system per class; drafts and generated documents can never be designated source of truth for evidence classes |
| 9.2 | Encrypted private backup of the secure document store and registers | Continuity; evidence preservation | Backup destination identified (private, encrypted), schedule, retention period | UNKNOWN / NOT RECEIVED | Encryption and access list verified from platform configuration; **backups and credentials never in public GitHub** |
| 9.3 | Restore test evidence | A backup that has never been restored is an assumption, not a control | Dated restore-test record: sample restored, hash-compared to source | UNKNOWN / NOT PERFORMED | Restore sample hashes must match the evidence-store hashes; a failed or partial restore keeps status UNKNOWN and raises an exception |
| 9.4 | Version and retention policy for documents and backups | Charter gate; legal-hold readiness | Written policy: retention per document class, supersession handling | UNKNOWN / NOT RECEIVED | Policy must state that superseded evidence is retained, not deleted, unless a legal-hold/retention decision says otherwise — and that decision is itself a register entry |

---

## Register maintenance rules

1. Status changes require the verification gate in the row to pass and be recorded (who verified, when, against what). No silent upgrades.
2. A received document upgrades only its own row. It never upgrades U1–U4 by implication; each decision moves only through the Decision Register (03) with its evidence references attached.
3. Conflicts between received documents are recorded as `disputed` with both references preserved. The register never picks a winner silently.
4. Items that arrive unsolicited or from an unverifiable source are logged as `asserted` provenance and satisfy no gate until their provenance is established.
