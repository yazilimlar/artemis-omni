# 07 — Data Access and Evidence Policy v0.1

| Field | Value |
|---|---|
| Document ID | `07_DATA_ACCESS_AND_EVIDENCE_POLICY` |
| Version | v0.1 (R01) |
| Status | **DRAFT_ASSUMPTION** |
| Approvals | **NONE** — no owner, counsel, or CPA approval has been given or is implied |
| Effective date | **NONE / TBD** — this policy is not in force until an owner Decision record sets an effective date |
| Classification of this document | PUBLIC-SYNTHETIC (contains no real data; placeholders only) |
| Supersedes | Nothing |
| Review state | AI-drafted; adversarially reviewed in `ADVERSARIAL_REVIEW_M28_R01.md` (same draft package); not human-reviewed |

> This policy is a template built on explicit assumptions. Every name, role, period, and system named below is a placeholder (`<PLACEHOLDER_*>`) until replaced through the M2.8 Decision register with an owner-approved record. Nothing in this document authorizes access to any real system or record.

---

## 1. Purpose and scope

This policy governs how ARTEMIS Tax Intelligence classifies data, who may access which class, how evidence originals are received, stored, hashed, logged, retained, and destroyed, and what may never enter the public GitHub repository (`yazilimlar/artemis-omni`, a **public** repo). It applies to all M2.8 registers, templates, workpapers, and adapters, and to every human and AI writer working on them.

It does **not** grant any access. All grants are default-DENY (§4) and remain placeholders until the separate security gate in §8 is satisfied.

## 2. Assumptions (explicit, unverified)

- A1. The repository `yazilimlar/artemis-omni` is public and everything committed to it must be treated as permanently published, including in git history. Deleting a file in a later commit does **not** unpublish it.
- A2. Legal entity status, ownership, and tax classification of every named entity/brand/project are **UNKNOWN** (Charter manifest item 01: "provisional claims only"). No access rule in this policy may be keyed to an assumed ownership fact.
- A3. An approved private store exists or will be designated by owner decision: `<PLACEHOLDER_PRIVATE_STORE>` (provider, region, encryption, and administrator all TBD). Until that decision exists, **no real evidence may be collected at all** — requests may be listed, originals may not be received into ad-hoc locations (email inboxes, chat uploads, local laptops) as a substitute.
- A4. Roles in §4 are functions, not people. No individual is assigned to any role by this document.
- A5. Retention periods are legally driven and currently **TBD** pending counsel/CPA input. No period in §6 is operative.

## 3. Data classification levels

| Level | Definition | Examples (types, never real instances) | Where it may live | Handling rules |
|---|---|---|---|---|
| **PUBLIC-SYNTHETIC** | Content safe for permanent public disclosure: schemas, blank templates, policies, synthetic fixtures with invented values | This policy; blank agreement templates with `<PLACEHOLDER_*>` fields; kernel test fixtures with computed digests over invented payloads | Public GitHub repo | Must pass the pre-commit checklist in the adversarial review before every push. Synthetic values must be obviously synthetic or structurally inert (no valid-format real-looking IDs). Status fields must show DRAFT_ASSUMPTION / approvals NONE where applicable. |
| **INTERNAL** | Operational material that is not public-facing but contains no personal or financial identifiers: process notes, redacted workpapers, aggregated counts, decision questions | Decision register (questions/options), document request checklists, missing-evidence register, dependency maps with opaque refs only | Owner-controlled workspace; may be mirrored to the public repo **only** if it contains zero CONFIDENTIAL-PRIVATE content and zero metadata described in §3.1 | No direct identifiers, no account fragments, no per-document rows for real confidential documents (see §3.1). Reviewed before any move to a more-visible location; movement is one-way (a copy placed publicly is public forever). |
| **CONFIDENTIAL-PRIVATE** | Real identity, financial, tax, legal, or credential material | Identity documents, tax IDs, account/routing numbers, signatures, executed agreements, filed returns, bank/processor statements, payroll records, real invoices/receipts, credentials/secrets | **Only** the approved private store (`<PLACEHOLDER_PRIVATE_STORE>`) with encryption at rest, per-object access control, and access logging | Never in Git (any repo, any branch, any commit, including "temporary" or later-deleted commits). Never in chat, email, issues, PR descriptions, CI logs, screenshots, or AI prompts. Access per §4 matrix only, per-tenant and per-legal-entity. Hash-on-receipt per §5. |

### 3.1 Metadata is data

For CONFIDENTIAL-PRIVATE material, the following are themselves confidential and must not appear in the public repo or in INTERNAL documents: real file names, document titles naming a person/entity + document type, page counts, exact received dates, jurisdiction + document-type combinations that identify a filing, and SHA-256 hashes of low-entropy real documents (a hash of a known government form or a standard confirmation letter is dictionary-attackable and confirms existence — see §5.3). Public/INTERNAL registers refer to confidential evidence **only** through the reference pattern in §5.2, in aggregate counts, never as per-document rows that fingerprint a real filing.

## 4. Access model — tenant + legal-entity least privilege

### 4.1 Rules

1. **Default DENY.** Every cell in the matrix is DENY unless a grant record exists. A blank cell means DENY, not "unspecified."
2. **Two-axis scoping.** Every grant is scoped to exactly one `tenantId` **and** one legal-entity scope. A grant for one tenant/entity confers nothing on any other. Cross-tenant and cross-legal-entity inference is prohibited (Relationship Schema, "Invariants").
3. **UNKNOWN entity = no grant.** Where legal-entity status is UNKNOWN (currently all entities), no CONFIDENTIAL-PRIVATE grant may be activated; the matrix stays a template.
4. **Grants are records, not prose.** Each activated grant requires: grant ID, role, data class, tenant, legal-entity scope, purpose, granted-by (owner Decision record ID), granted-at, expiry/review date, and revocation procedure. Placeholder text in any of these fields = grant not active.
5. **Separation of duties.** The role that ingests evidence (custodian) is not the role that verifies it, and neither is the role that approves status upgrades of documents or relationships.
6. **AI systems** (any model, including the integrator) hold no standing grant. An AI session may process CONFIDENTIAL-PRIVATE material only inside the approved private environment for a named task, never in the public repo tooling, and its outputs inherit the highest classification of their inputs until a human reviewer downgrades them in writing.
7. **Revocation** is immediate-effect and logged; quarterly access review is a template obligation (`<PLACEHOLDER_REVIEW_CADENCE>`), not a claim that reviews occur.

### 4.2 Access matrix template (ALL CELLS ARE PLACEHOLDERS — NO GRANT IS ACTIVE)

Legend: `DENY` = no access. `GRANT?` = a grant *may be recorded here in future* via §4.1(4); it is **not** a grant now.

| Role ↓ / Data class → | PUBLIC-SYNTHETIC | INTERNAL | CONFIDENTIAL-PRIVATE (own tenant+entity) | CONFIDENTIAL-PRIVATE (other tenant/entity) | Private-store admin (grant/revoke, no content read) |
|---|---|---|---|---|---|
| Owner | Read/Write | Read/Write | GRANT? | GRANT? | GRANT? |
| Evidence custodian `<PLACEHOLDER_ROLE>` | Read | Read/Write | GRANT? (ingest + hash only) | DENY | DENY |
| Preparer / bookkeeper `<PLACEHOLDER_ROLE>` | Read | Read/Write | GRANT? (task-scoped, time-boxed) | DENY | DENY |
| Independent verifier `<PLACEHOLDER_ROLE>` | Read | Read | GRANT? (verify against originals) | DENY | DENY |
| External CPA / counsel `<PLACEHOLDER_ROLE>` | Read | GRANT? (scoped extract) | GRANT? (scoped extract, expiry mandatory) | DENY | DENY |
| AI writer / reviewer (any model) | Read/Write (drafts only) | Read (task-scoped) | DENY | DENY | DENY |
| Auditor (future) `<PLACEHOLDER_ROLE>` | Read | Read | GRANT? (read-only, logged) | DENY | DENY |
| Public / unauthenticated | Read | DENY | DENY | DENY | DENY |

No row above is effective. This matrix becomes operative only when (a) the private store is designated (Assumption A3), (b) each role is bound to a named person/system by an owner Decision, and (c) the §8 security gate has evidence. Until then the only operative rule is: **CONFIDENTIAL-PRIVATE material is not collected.**

## 5. Evidence handling

### 5.1 Source originals

- Originals live **only** in the approved private store. Registers, workpapers, and adapters hold references (§5.2), never copies, extracts containing identifiers, or screenshots.
- A draft, template, AI-generated document, or register row is **never** evidence. Evidence status (`EVIDENCE_RECEIVED`, `EXTERNALLY_VERIFIED`) attaches only to an original received from its external source, per the Charter's "Non-negotiable states," and each status transition requires the transition record in §5.4.
- Intake channels are enumerated by owner decision (`<PLACEHOLDER_INTAKE_CHANNELS>`). Anything received outside them is quarantined, not filed.

### 5.2 The only allowed reference pattern: `identifiersRef` + `contentHash`

Public and INTERNAL documents may reference a confidential item **only** as:

```
evidenceRef: {
  identifiersRef: "EVD-<opaque random id>"        // assigned by the private store; encodes NO name, type, date, tenant, or entity
  contentHash:    "sha256:<64 lowercase hex>"      // hash of the original as received, computed inside the private store
  classification: "CONFIDENTIAL-PRIVATE"          // class only — no title, no filename, no jurisdiction, no page count
}
```

Rules: the opaque ID is random, never sequential-with-meaning and never derived from the document's name, owner, or date; the reference carries **no** other metadata in public/INTERNAL contexts; one reference per document (no grouping that reveals a filing set); resolution of a reference to the original happens only inside the private store by a §4 grant holder.

### 5.3 Hash-on-receipt

1. On receipt, inside the private store, compute SHA-256 over the exact bytes received. Record: hash, received-at timestamp, receiving custodian role, source channel, and the assigned `identifiersRef` — all inside the private store.
2. Any later copy is verified against the receipt hash before use; a mismatch quarantines the item and opens an incident (§7).
3. The receipt hash of a real document is itself CONFIDENTIAL-PRIVATE (§3.1) whenever the document is low-entropy or standard-form. High-entropy originals (e.g. multi-page scanned statements) may have their hash recorded in INTERNAL registers; when in doubt, treat the hash as confidential.
4. Hash ≠ verification. A matching hash proves byte-identity with what was received; it proves nothing about authenticity, authorship, signature validity, or legal effect. Those are separate gates (Charter, "Gates"; Relationship Schema, "Invariants").

### 5.4 Status transitions and provenance

Every change to a document's or relationship's status records: prior status, new status, actor (person/role — an AI may propose, never effect, an upgrade to `EXECUTED`, `EVIDENCE_RECEIVED`, or `EXTERNALLY_VERIFIED`), timestamp, Decision/approval record ID, and the `evidenceRef` relied on. Transitions without all six fields are invalid and the status reverts to the lower state. There is no default or automatic upgrade path (Charter: "No default status upgrade").

### 5.5 Access logging

The private store logs every read, download, hash-verification, grant, and revocation: actor, role, reference ID, timestamp, purpose ticket/Decision ID. Logs are append-only, retained per §6, reviewed on the `<PLACEHOLDER_REVIEW_CADENCE>` cycle, and are themselves INTERNAL at minimum (CONFIDENTIAL-PRIVATE if they enumerate real references at scale). Absence of a log entry is treated as "access did not legitimately occur," never as "access probably fine."

## 6. Retention schedule template (ALL PERIODS TBD — NOT OPERATIVE)

| Record class | Retention period | Trigger event | Destruction method | Notes |
|---|---|---|---|
| Filed tax returns + supporting workpapers | `TBD` | Filing date | `TBD` (cryptographic erasure / certified destruction) | Period set by counsel/CPA per jurisdiction; do not assume a number |
| Bank / processor statements | `TBD` | Statement date | `TBD` | |
| Executed agreements | `TBD` | Termination / expiry | `TBD` | Longer of contractual or legal requirement, TBD |
| Identity documents (copies) | `TBD` — minimise; prefer verify-and-return | Verification complete | `TBD` | Collect only if a named process requires it |
| Access logs | `TBD` | Log date | `TBD` | Must outlive the records they describe, TBD |
| Drafts and templates (PUBLIC-SYNTHETIC) | Indefinite in public repo | — | n/a | Drafts are not records; they never become evidence by ageing |
| Backup copies of private store | `TBD` | Backup date | `TBD` | Backup existence ≠ restorability; see §6.1 |

### 6.1 Backups

A backup claim is a status, and it follows §5.4: no document may state or imply that backups exist, are encrypted, or are restorable without a restore-test record (date, operator role, target reference IDs, hash comparison result) in the private store. Until such a record exists, backup status is **UNKNOWN** (Evidence Inventory, "Backups").

## 7. Breach / incident checklist (template — no incident is asserted)

On suspicion that CONFIDENTIAL-PRIVATE material has entered the public repo, chat, email, CI logs, or any unauthorised location:

1. **Stop** further commits/sends in the affected channel immediately. Do not "fix forward" yet.
2. **Preserve** the exposure facts: what, where, commit SHA / message ID, first-seen time, discoverer. Record in an INTERNAL incident note using `identifiersRef` only — the incident note must not re-copy the exposed content.
3. **Assume permanence** for anything that reached public GitHub: history rewrite is destructive, requires separate owner approval (Charter, "Gates"), and does not retract clones/forks/caches. Record exposure as irreversible unless proven otherwise.
4. **Notify** the owner via `<PLACEHOLDER_INCIDENT_CHANNEL>`; owner decides external notifications (affected individuals, institutions, regulators) with counsel. No AI or preparer makes external notifications.
5. **Rotate** any exposed credential/secret immediately through its own system's procedure; a rotated secret's old value stays out of all records.
6. **Quarantine and re-hash** any evidence item whose bytes may have been altered (§5.3(2)).
7. **Post-incident:** root-cause entry in the Decision register, pre-commit checklist updated with the missed pattern, access review of the involved grants (§4.1(7)).
8. Do **not** delete local notes about the incident to "clean up"; the incident record is retained per §6.

## 8. Non-substitution statement — the blocked M2.7 security gate

**This policy does not satisfy, substitute for, evidence, or soften the blocked M2.7/M2.7.1 security gate.** As of this draft, the following remain **outstanding and unproven**, and nothing in this document changes that:

- No in-repo Supabase migrations implementing the R3/R4 authorization design exist; R3/R4 remain SQL text in documentation only.
- No executed two-role / two-tenant denial tests exist.
- No storage download-denial tests exist.
- UI and register claims about ownership, membership, or authorization remain unverified against documents (all UNKNOWN).

Consequences while the gate is blocked: no live data import, no real evidence collection into any connected system, no production or "private beta" claim, and this policy's §4 matrix stays inert. Adoption of this policy — even a future owner-approved adoption — is a documentation event, not a security control. Security claims may be made only from executed test evidence produced under that gate, cited by run ID.

## 9. What may NEVER enter the public repository (summary, binding on all writers)

Real identity documents or numbers (government IDs, tax IDs of any person or entity, dates of birth); bank/financial account or routing numbers, card numbers, balances from real statements; real signatures or signature images; executed (signed) agreements or any document bearing a real signature block completion; filed tax returns, notices, or transcripts; real financial records (statements, ledgers, invoices, receipts, payroll) whether "redacted" by deletion in a later commit or not; credentials, API keys, secrets, or session material; backups of any of the above; and the metadata enumerated in §3.1. The **only** permitted trace of such material anywhere outside the private store is the §5.2 `identifiersRef` + `contentHash` pattern, subject to §3.1 and §5.3(3).

Redaction standard: if a document ever contained any of the above, the document does not enter the public repo — a "cleaned" derivative is a new document that must be re-derived from a synthetic source, not scrubbed from the real one, because scrubbing misses metadata, embedded objects, and history.

## 10. Placeholders requiring owner decision before this policy can advance

`PRIVATE_STORE designation` · `role-to-person bindings for every §4 role` · `intake channels` · `all §6 retention periods` · `access review cadence` · `incident notification channel` · `effective date + APPROVED_INTERNAL decision`. Until these exist, this document remains v0.1 / DRAFT_ASSUMPTION / approvals NONE, and the operative rule for real data is §4.2's: **do not collect it.**
