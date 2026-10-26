# 01 — Entity and Brand Register

| Field | Value |
|---|---|
| Document ID | REG-01 |
| Version | v0.1 |
| Status | DRAFT_ASSUMPTION |
| Effective date | {{TBD}} |
| Approval state | UNAPPROVED |
| Verification state | All entries UNKNOWN unless a row states otherwise |
| Source | M2.8 Documentation Foundation Charter v0.1; Relationship Schema v0.1 |

**Purpose.** A provisional register of the legal entities, individuals, brands, projects, systems, accounts, and assets the Tax Intelligence documentation foundation refers to. Inclusion in this register is **not** evidence of formation, ownership, registration, or existence. A brand or project is never a legal entity. Identifiers (formation numbers, tax IDs, account numbers) are **never** stored in this repository; they live only in the private evidence store and are referenced here as `identifiersRef: PRIVATE — not in repo`.

## Status vocabulary (per Charter v0.1)

`DRAFT_ASSUMPTION` · `DRAFT_REVIEWED` · `APPROVED_INTERNAL` · `EXECUTED` · `EVIDENCE_RECEIVED` · `EXTERNALLY_VERIFIED` · `REJECTED` · `SUPERSEDED` · `UNKNOWN` (first-class; no default status upgrade). Document status, signature status, and verification status are separate dimensions: a signed document is not proof of a bank deposit, and an entry here is not proof of a signed document.

## Register

Record shape per the Relationship Schema: `id, kind, displayName, jurisdiction, identifiersRef, status, validFrom, validTo, provenanceRefs, verificationStatus`. Kind ∈ `legal_entity | individual | brand | project | system | account | asset`.

| id | kind | displayName | jurisdiction | identifiersRef | status | validFrom | validTo | provenanceRefs | verificationStatus |
|---|---|---|---|---|---|---|---|---|---|
| ENT-001 | legal_entity | Great Order LLC | {{TBD — formation state not in evidence}} | PRIVATE — not in repo | UNKNOWN (provisional) | {{TBD}} | {{TBD}} | M28 Charter v0.1; M28 Relationship Schema v0.1 (asserted only) | UNKNOWN |
| ENT-002 | brand | ARTEMIS | n/a (brand) | PRIVATE — not in repo (trademark status unknown) | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M28 Charter v0.1; M28 Relationship Schema v0.1 | UNKNOWN |
| ENT-003 | brand | AgoraXAI | n/a (brand) | PRIVATE — not in repo (trademark status unknown) | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M28 Charter v0.1; M28 Relationship Schema v0.1 | UNKNOWN |
| ENT-004 | project | Apolloa | n/a (project) | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M28 Charter v0.1 | UNKNOWN |
| ENT-005 | asset | agoraxai.com (domain name) | n/a (asset) | PRIVATE — not in repo (registrar record not in evidence) | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M28 Relationship Schema v0.1 (example edge, unverified) | UNKNOWN |
| ENT-010 | individual | {{Owner legal name — PRIVATE, not recorded here}} | {{TBD}} | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M28 Charter v0.1 (owner role) | UNKNOWN |
| ENT-020 | account | {{Bank account A — institution TBD}} | {{TBD}} | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | Placeholder row — no statement in evidence | UNKNOWN |
| ENT-021 | account | {{Bank account B — institution TBD}} | {{TBD}} | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | Placeholder row — no statement in evidence | UNKNOWN |
| ENT-030 | account | {{Payment processor account(s) — provider TBD}} | {{TBD}} | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | Placeholder row — no settlement report in evidence | UNKNOWN |
| ENT-040 | system | ARTEMIS Tax Intelligence application | n/a (system) | n/a | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M2.7/M2.8 working record (synthetic scope only) | UNKNOWN |
| ENT-041 | system | {{Accounting / ERP system — product TBD}} | n/a (system) | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | Placeholder row — no ledger export in evidence | UNKNOWN |
| ENT-042 | system | {{Private evidence store — location TBD, access-controlled}} | {{TBD}} | PRIVATE — not in repo | DRAFT_ASSUMPTION | {{TBD}} | {{TBD}} | M28 Charter v0.1 (private store requirement) | UNKNOWN |

## Notes and open items

1. **Great Order LLC (ENT-001)** is recorded as a *claimed* legal entity. Formation documents, EIN confirmation, operating agreement, and amendments have been requested (see 04_DOCUMENT_REQUEST_CHECKLIST §1.1–1.4) and are **not in evidence**; its jurisdiction, formation date, members, and tax classification are all UNKNOWN. Nothing in this register determines its ownership.
2. **ARTEMIS (ENT-002)** and **AgoraXAI (ENT-003)** are recorded with kind `brand` because the Relationship Schema's provisional edges treat them as brands. Both are also used as project/platform labels in working documents; that dual use is unresolved and is a placeholder decision for the owner — a label is not a legal person either way.
3. **Apolloa (ENT-004)** is a project only. No legal entity, partnership, or joint-venture status is asserted or implied.
4. Account rows (ENT-020/021/030) and system rows (ENT-041/042) are **template placeholders**: they reserve register IDs for records to be created only when statements, mandates, or system inventories are received as evidence. No account number, routing number, login, or credential may ever be entered here.
5. Every row's `verificationStatus` stays UNKNOWN until the corresponding original document is received (status `EVIDENCE_RECEIVED`) and, where required, independently confirmed (`EXTERNALLY_VERIFIED`). No row may be upgraded by inference from another row, from a brand label, or from an AI-generated document.

---
*DRAFT_ASSUMPTION — UNAPPROVED. This register fabricates nothing: every unverified field is shown as UNKNOWN or as a {{placeholder}}.*
