# 02 — Relationship Register

| Field | Value |
|---|---|
| Document ID | REG-02 |
| Version | v0.1 |
| Status | DRAFT_ASSUMPTION |
| Effective date | {{TBD}} |
| Approval state | UNAPPROVED |
| Companion register | 01_ENTITY_AND_BRAND_REGISTER.md (ENT-IDs) |

**Purpose.** Typed, effective-dated relationship records between register entries, per the Relationship Schema v0.1. **No edge in this register implies legal identity, common ownership, common control, or tax consolidation.** A claimed relation is not verified by matching names, shared brands, internal references, or an AI-generated document. Legal entity status, bank-account control, tax classification, and signature verification are distinct gates, each evidenced separately.

Record shape: `id, fromId, toId, relationType, legalBasisDocumentIds[], evidenceRefs[], confidence, lifecycle, effectiveFrom, effectiveTo, tenantId, legalEntityScope, ownerApprovalRef, revision`. Confidence ∈ `asserted | supported | verified | disputed | unknown`; lifecycle ∈ `proposed | active | suspended | terminated`.

`legalBasisDocumentIds` point at items on the document request checklist (04_DOCUMENT_REQUEST_CHECKLIST, cited as 04 §n.n). **Every cited basis document is currently MISSING** — none has been received. `evidenceRefs` are therefore empty for all records below.

## Provisional edges (asserted in the Relationship Schema v0.1; NOT verified)

| id | fromId | toId | relationType | legalBasisDocumentIds (all MISSING) | evidenceRefs | confidence | lifecycle | effectiveFrom | effectiveTo | tenantId | legalEntityScope | ownerApprovalRef | revision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REL-001 | ENT-001 Great Order LLC | ENT-002 ARTEMIS | may_own_brand | 04 §1.1 formation documents; 04 §1.3 operating agreement; 04 §2.1 trademark filings | [] | asserted | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-002 | ENT-001 Great Order LLC | ENT-005 agoraxai.com | may_own_domain | 04 §2.2 domain registration records | [] | asserted | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-003 | ENT-002 ARTEMIS | ENT-003 AgoraXAI | may_provide_software_support | 04 §2.3 source licences; 04 §3.1 executed contracts | [] | asserted | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |

Reading of REL-001 – REL-003: the word **"may"** is part of the relation type, not a stylistic hedge. Each edge records a *candidate* relation to be confirmed or rejected from owner statements, registration records, invoices, and contracts. Until then they authorise nothing: no party may act, invoice, hold itself out, or be taxed on the basis of these edges.

## Template rows (pattern records — instantiate only with real parties and received evidence)

| id | fromId | toId | relationType | legalBasisDocumentIds (all MISSING) | evidenceRefs | confidence | lifecycle | effectiveFrom | effectiveTo | tenantId | legalEntityScope | ownerApprovalRef | revision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REL-T01 | {{ENT-legal entity}} | {{ENT-bank account}} | holds_bank_account | 04 §4.1 bank statements; 04 §4.5 account authorisation / mandate records | [] | unknown | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-T02 | {{ENT-legal entity}} | {{ENT-processor account}} | processes_payments_via | 04 §4.2–4.4 processor settlement / fee / tax reports; 04 §4.5 authorisation records | [] | unknown | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-T03 | {{ENT-client}} | {{ENT-legal entity}} | master_services_agreement_with | 04 §3.1 executed client contract (template: EXT-01) | [] | unknown | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-T04 | {{ENT-vendor}} | {{ENT-legal entity}} | supplies_goods_or_services_to | 04 §3.1 executed vendor terms (template: EXT-03); 04 §3.3 supplier statements | [] | unknown | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-T05 | {{ENT-brand owner — TBD}} | {{ENT-licensee — TBD}} | licenses_brand_ip_to | 04 §2.1 trademark filings; 04 §2.4 contributor agreements (template: INT-01) | [] | unknown | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |
| REL-T06 | {{ENT-service provider entity}} | {{ENT-receiving entity}} | provides_shared_services_to | 04 §1.3 operating agreement (if applicable) (template: INT-02) | [] | unknown | proposed | {{TBD}} | {{TBD}} | UNKNOWN | UNKNOWN | NONE | 0.1 |

Template-row rules: (1) a template row becomes a real record only when both endpoint ENT records exist in Register 01 with non-placeholder names; (2) `confidence` may rise from `unknown`/`asserted` only when a cited basis document moves to EVIDENCE_RECEIVED; (3) `lifecycle` may move from `proposed` to `active` only with an `ownerApprovalRef` — today every row has NONE; (4) shared-services and intercompany rows (REL-T06) may only be instantiated **between distinct legal parties** — see the caveat on template INT-04; a transfer inside one legal entity is a bookkeeping allocation, never a relationship edge of this kind.

## Change control

Relationships are time-bounded and revocable: an amendment creates a new revision with its own effective dates; supersession is explicit (`status: SUPERSEDED` on the prior revision). Effective-date queries must be able to reproduce the register exactly as it stood on any past date. Deleting an edge is forbidden; terminate it with `lifecycle: terminated` and an `effectiveTo`.

---
*DRAFT_ASSUMPTION — UNAPPROVED. No edge in this file is an executed agreement, an ownership determination, or evidence of anything.*
