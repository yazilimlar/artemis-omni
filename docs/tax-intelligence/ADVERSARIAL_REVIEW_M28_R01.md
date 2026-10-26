# Adversarial Review — M2.8 Documentation Foundation R01

| Field | Value |
|---|---|
| Reviewer role | Adversarial privacy / authorization reviewer (Grok role) |
| Documents reviewed | `M28_DOCUMENTATION_FOUNDATION_CHARTER_R01.md`, `M28_RELATIONSHIP_SCHEMA_R01.md`, `M28_EVIDENCE_AND_DRAFT_INVENTORY_R01.md` |
| Review type | Read-only adversarial review of text and planned package. No repository, system, or account was inspected; every statement about "the repo" is taken from the foundation documents and the M2.7 record, not re-verified here |
| Status of this review | DRAFT_ASSUMPTION — findings are challenges to be adjudicated by GPT-6 / owner, not determinations |
| Severity counts | **P0: 5** · P1: 6 · P2: 4 |

**Stance.** The foundation documents are unusually honest for drafts — UNKNOWN is used consistently and the Charter's gates are well stated. That is precisely the danger: a package this well-labelled invites downstream readers to treat the labels as controls. Labels are not controls. Every P0 below is a place where the *machinery* (schema fields, register formats, adapter contracts, multi-AI workflow) will quietly convert a labelled assumption into an operating fact, because nothing mechanical stops it. This repository is **public**, and this programme has already shipped proposed-ownership percentages in public page copy while entity status was UNKNOWN. Assume every failure mode below has either already happened once or will happen by default.

---

## P0 findings

### P0-1 — Status fields are unguarded strings: `EXECUTED` is one edit away
**Challenged:** Charter, "Non-negotiable states"; Relationship Schema, `Document.status`, `Document.signatureStatus`, `Relationship.lifecycle`.
**Trap:** The Charter lists eight states and says "No default status upgrade," but neither foundation document specifies *who* may set a status, *what evidence* a transition requires, or *any mechanism* that would notice an illegitimate transition. In a markdown/JSON register world, `status: EXECUTED` is a text edit identical in form to `status: DRAFT_ASSUMPTION`.
**Failure mode:** A writer (human or AI, acting in good faith under time pressure) "tidies" a register row for an agreement that was *sent* for signature and marks it EXECUTED. Every downstream consumer — the relationship register's `legalBasisDocumentIds[]`, the tax kernel's "approved, evidence-linked" input rule, a future CPA export — now treats an unsigned draft as a legal basis. There is no diff a reviewer would flag, because the file format gives a status flip the same visual weight as a typo fix. The Charter even warns "signed agreement is not proof of a bank deposit" — the symmetric failure, *unsigned draft treated as signed agreement*, is unguarded.
**Minimal guard:** (1) A transition table in the schema: for each target state, the required evidence type and the permitted actor class; transitions to `EXECUTED` / `EVIDENCE_RECEIVED` / `EXTERNALLY_VERIFIED` require an owner Decision record ID + an `evidenceRef` (§5.2 pattern) and may never be effected by an AI writer. (2) A pre-commit register lint (checklist item C7) that fails any diff changing a status field to one of those three states without the accompanying Decision reference in the same commit. Until the lint exists, the rule is procedural and must be stated as such — not implied to be enforced.

### P0-2 — Filled templates are indistinguishable from executed records
**Challenged:** Charter, workstream 2 and manifest item 05; Evidence Inventory, "Draft agreement catalog."
**Trap:** The package plans agreement templates (MSA, SOW, NDA, DPA, intercompany, IP assignment) in the same repository, in the same document formats, feeding the same register (`Document` records with `signatureStatus` and `approvals[]`) as real agreements. A template is one find-and-replace away from looking executed: names in, dates in, `<PLACEHOLDER_*>` gone.
**Failure mode:** Someone completes a template "as an example of what it would look like," or pre-fills it to save time before a signing that then happens on different terms (or never). The artefact survives in the repo. Months later it is cited — by a person, an adapter, or an AI summarising the register — as *the* agreement. Because the Charter's own catalog mixes "Internal" templates for arrangements "only where distinct legal parties exist" with entity status UNKNOWN, a filled intercompany template can even manufacture the appearance of two legal parties where there may be one. This is the fabrication pathway the owner instruction ("never fabricate executed agreements") is aimed at, and the current package design walks straight into it by co-locating templates and records.
**Minimal guard:** (1) Templates live in a segregated directory/naming scheme (`*_TEMPLATE`) with a non-removable header block: `STATUS: TEMPLATE — UNEXECUTED — NOT A RECORD`, and their `signatureStatus` is hard-fixed to `UNSIGNED_TEMPLATE` in any register row that references them. (2) `legalBasisDocumentIds[]` must reject — mechanically, in the adapter/schema validation, not by convention — any document whose status is not `EXECUTED` **and** whose register row lacks the P0-1 transition record. (3) No template may be distributed with example party names that are real entity/brand names in this programme (see P2-2).

### P0-3 — The reference pattern leaks: hashes and refs fingerprint real filings in a public repo
**Challenged:** Relationship Schema, `Entity.identifiersRef?`, `Document.sourceRef?`, `Document.contentHash?`, `Document.jurisdiction?`, `effectiveFrom/effectiveTo`; Evidence Inventory, per-area table format.
**Trap:** The schema's privacy model is "originals stay private; the public repo holds schema + synthetic examples." But the moment real intake begins, the natural next step is to record real documents in the register using exactly the fields provided — `contentHash`, `sourceRef`, `jurisdiction`, effective dates, type. Individually innocuous; together they are a fingerprint.
**Failure mode:** (a) A SHA-256 of a low-entropy original — a standard government confirmation letter, a blank-form-with-one-field, an EIN assignment notice in its standard format — is reversible by dictionary/brute-force over the small space of plausible documents, confirming both existence and content class. (b) Even without reversal, a public per-document row set leaks *that* a filing exists, *when* it was received, *which jurisdiction*, and *how many* documents an entity has — metadata that is itself confidential tax information in aggregate. (c) This programme has the exact precedent: proposed-ownership percentages were rendered in public page copy while status was UNKNOWN; the failure was not malice, it was a field that existed and got rendered. `contentHash?` and `jurisdiction?` are optional fields today; optional fields get filled.
**Minimal guard:** (1) Public repo rule, stated in policy 07 §3.1/§5.2 and enforced by checklist C3/C4: for CONFIDENTIAL-PRIVATE items the public/INTERNAL register carries **aggregate counts only**, plus opaque random `identifiersRef` values that encode nothing; hashes of real documents live **only** in the private store, with the narrow high-entropy exception assessed per item. (2) The schema must mark `contentHash`, `sourceRef`, `jurisdiction`, `effectiveFrom/To` as **private-store-only fields** for confidential documents — present in the schema, forbidden in the public serialisation. A schema that doesn't distinguish its own public/private projections will eventually be serialised whole.

### P0-4 — `asserted` + `active` relationship edges harden into downstream "facts"
**Challenged:** Relationship Schema, `Relationship.confidence` (`asserted|supported|verified|disputed|unknown`), `Relationship.lifecycle` (`proposed|active|…`), "Example provisional edges," "Integration strategy"; Charter, manifest item 02.
**Trap:** Confidence and lifecycle are **orthogonal axes with no stated interaction**. Nothing in the schema forbids `confidence: asserted, lifecycle: active` — an edge nobody has evidenced, in the state every consumer will read as operative. The schema's own integration paragraph says "Adapters expose typed entities, documents, relationships and obligations" with no confidence filter, and the tax kernel rule ("consumes only approved, evidence-linked financial events") is stated for *financial events*, not for relationship edges used as `legalBasis`.
**Failure mode:** The three example edges — e.g. `Great Order LLC --[may own brand]--> ARTEMIS` — are copied into `02_RELATIONSHIP_REGISTER.md` during the first-draft build (they are the only concrete content available to copy). The register's header says "NOT verified"; the rows travel without the header. An adapter exports edges filtered by `lifecycle = active` because that is the obvious filter. Ownership — the single most consequential UNKNOWN in this programme (U2) — is now an operative fact in every downstream artefact, with the register cited as its source. Each hop launders the claim: asserted → registered → exported → relied on.
**Minimal guard:** (1) Schema invariant, mechanically checkable: `lifecycle` may not be `active` while `confidence` is `asserted` or `unknown`, nor while `legalBasisDocumentIds[]` is empty for relation types that assert legal effect (ownership, agency, employment, account control). (2) Adapter/export contract: default export filter is `confidence IN (supported, verified)` **and** every exported row carries its confidence inline; a consumer that drops the confidence field is non-conformant. (3) The provisional example edges may appear in the register only with `lifecycle: proposed` and their confidence in the same row — never under a section header alone.

### P0-5 — The register itself republishes the ownership leak the Charter says is provisional
**Challenged:** Charter, manifest item 01 ("Great Order LLC, ARTEMIS, AgoraXAI, and other proposed projects; **provisional claims only**"); Evidence Inventory, "Legal entity" row.
**Trap:** Item 01 plans a public-repo register whose content is entity/ownership claims, on the theory that labelling them "provisional" makes them safe to publish. It does not. The M2.7 precedent is exact: proposed ownership percentages appeared in public `page.tsx` copy while entity status was UNKNOWN — the label "proposed" was present in the source data and the leak happened anyway, because publication is about *content*, not about the author's intent for it.
**Failure mode:** The register ships with proposed percentage allocations, proposed entity roles, or proposed entity-to-entity interests (all of which exist in this programme's working material). Search indexing, screenshots, forks, and AI training ingestion do not carry the word "provisional." A counterparty, creditor, or litigant later quotes the public register as the owner's own representation of ownership — in a programme that already has a live debt-collection suit in its background facts. "Provisional claims only" is a drafting instruction; it is not a disclosure control.
**Minimal guard:** The **public** version of register 01 contains, per entity: name (only where already public), kind as *claimed*, status `UNKNOWN`, and an opaque `identifiersRef` to the private record — **no percentages, no allocation splits, no proposed interests, no entity-to-entity ownership edges**. The substantive register lives in the private store. If the owner later decides some claim is safe to publish, that is a per-field owner Decision, recorded — not a drafting default.

---

## P1 findings

### P1-1 — Backup and restore: the Inventory plans the claim before the evidence can exist
**Challenged:** Evidence Inventory, "Backups" ("Define source-of-truth system, private encrypted backup destination, restore test… Record missing backup evidence as UNKNOWN").
**Trap/failure:** The paragraph is a *definition task*, but its outputs will be written in the same declarative register style as everything else; "private encrypted backup destination: `<X>`; restore test: defined" reads as a state of the world. The classic failure follows: a later milestone cites the foundation package as showing backups are handled, an incident or device loss occurs, and the restore has never been executed — backup status was a sentence, not a test. Policy 07 §6.1 now requires a restore-test record before any backup claim; the foundation package itself must model this by carrying `backupStatus: UNKNOWN` as a register field with an evidence link, defaulting to UNKNOWN in every template that mentions backups.
**Minimal guard:** No document may use the words "backup," "encrypted," or "restorable" in the indicative mood about real data without citing a restore-test `evidenceRef` dated within `<TBD>`; checklist C9 greps for it.

### P1-2 — `approvals[]` and `ownerApprovalRef?` accept typed-in authority
**Challenged:** Relationship Schema, `Document.approvals[]`, `Relationship.ownerApprovalRef?`, `Obligation.approvalRef?`, `Decision.decidedBy?`.
**Trap/failure:** Approvals are free strings/optional refs. Any writer can type a plausible approval ("owner, 2026-10-26") into a row, and no consumer can distinguish it from a real one. In a multi-AI pipeline this does not require bad faith: a model completing a register from context that *discussed* an approval will record the approval. Downstream, `ownerApprovalRef` is the field that unlocks P0-4's operative scenario ("only one owner-approved operative scenario") — the programme's central safety concept rests on its least-verified field.
**Minimal guard:** Approval fields must reference a Decision record ID that itself exists in `03_DECISION_REGISTER.md` with `status: APPROVED`, a decider identity, and a timestamp; a dangling or self-referential approval ref invalidates the row's status (revert per policy 07 §5.4). Checklist C8 verifies every approval ref in a diff resolves.

### P1-3 — "Snapshots must be reproducible" is asserted with no immutability mechanism
**Challenged:** Relationship Schema, "Invariants" ("Effective-date queries must reproduce prior snapshots and amendments; supersession is explicit"), `Relationship.revision`, `Document.supersedesId?`.
**Trap/failure:** The records are editable files. `revision` is a number a writer can increment while also editing history; `supersedesId?` is optional. For private data there is no git history to fall back on (it must not be in git). The first time a prior-period snapshot matters — a tax workpaper tied to "the register as of Q3" — the prior state will be unreconstructable, and worse, silently different from what the workpaper used. 
**Minimal guard:** Append-only revision rows (never edit a superseded row; amendments are new rows with mandatory `supersedesId`), plus a periodic snapshot hash of the private register recorded in the Decision register. Optional-field `supersedesId?` becomes required-on-amendment in the schema text.

### P1-4 — `Obligation.amountOrFormula?` is an executable-looking liability generator
**Challenged:** Relationship Schema, `Obligation {amountOrFormula?, currency?, dueDate?, status, supportingDocumentIds[], approvalRef?}`.
**Trap/failure:** Every field that would discipline an obligation is optional except status and supporting docs. A formula string ("…× 8.875%") invites a downstream tool to evaluate it and emit a number that looks like a computed tax or debt figure; the M2.7 programme already fought exactly this battle (a payout figure masquerading as an oracle). An obligation with a formula, a due date, and status `active` is a liability claim with no required evidence or approval behind it.
**Minimal guard:** Obligations may not be consumed by the tax kernel or any export unless `supportingDocumentIds[]` is non-empty **and** `approvalRef` resolves per P1-2; `amountOrFormula` is display-only text, never evaluated by any adapter; `currency` becomes required whenever `amountOrFormula` is present.

### P1-5 — Entity records have no tenant axis; `legalEntityScope?` is optional on relationships
**Challenged:** Relationship Schema, `Entity` (no `tenantId` field), `Relationship.legalEntityScope?`, contrasted with its own invariant "Access is tenant-scoped and least-privilege; no cross-tenant or cross-legal-entity inference."
**Trap/failure:** The invariant is mandatory; the fields that would implement it are absent or optional. An Entity shared across tenants by omission, or a Relationship with null `legalEntityScope`, will be read by consumers as *unscoped = applies everywhere* — the exact cross-entity inference (e.g. brand → entity → account) the schema elsewhere forbids. Policy 07 §4 requires two-axis scoping for access; the data model currently cannot represent the second axis reliably.
**Minimal guard:** `legalEntityScope` required (value `UNKNOWN` permitted, absence not); Entity gains either a `tenantId` or an explicit `sharedAcrossTenants: false` default with the semantics written down; consumers must treat null/absent scope as *fail closed*, and that sentence must be in the schema, not only in the policy.

### P1-6 — The multi-AI pipeline can self-certify "reviewed"
**Challenged:** Charter, "Next checkpoint" (Claude writer, Gemini challenger, Grok reviewer, GPT-6 adjudicator) and "Non-negotiable states" (`DRAFT_REVIEWED`).
**Trap/failure:** `DRAFT_REVIEWED` is a state an owner will read as "someone checked this." In the planned pipeline the checker is another AI working from the same packet; two models sharing context can ratify each other's shared misreading (the M2.7 panel design exists precisely because of this). If an AI review flips a document to `DRAFT_REVIEWED` with no record of *who/what* reviewed it and *against what*, the state conveys human-grade assurance it never earned — the documentation-foundation version of claiming CI green from a checkmark.
**Minimal guard:** Every status record carries `reviewedBy` + `reviewerType: HUMAN | AI | NONE` + review artefact ref. `DRAFT_REVIEWED` by AI review must render as `DRAFT_REVIEWED (AI)` wherever the status is displayed, until a human or the GPT-6 adjudication record upgrades the reviewer type. The manifest (item 00) must show reviewer type per artefact.

---

## P2 findings

### P2-1 — Versioning convention is already inconsistent inside three documents
**Challenged:** Charter title "Charter v0.1" vs file suffix `R01`; Inventory "v0.1"; Schema "Concept v0.1"; manifest items numbered `00`–`08` with no version field per item.
**Failure/guard:** Two version dialects (v0.1 / R01) in the founding set guarantees drift once R02s appear. Guard: one convention, stated in the Charter, plus a per-artefact version + status + approvals header block (as in policy 07) required for every manifest item; the master index carries the version table, documents don't self-declare conflicting versions.

### P2-2 — "Synthetic" examples use real programme names
**Challenged:** Relationship Schema header ("All examples are synthetic") vs its example edges naming Great Order LLC, ARTEMIS, and a real domain.
**Failure/guard:** Examples with real names are the content most likely to be copy-pasted into registers and fixtures (see P0-4). Guard: worked examples use obviously fictitious names (`Example Holdings LLC`, `brand-example.invalid`); real-name provisional edges live only in the quarantined provisional-edges section/register with per-row confidence, never in the schema's illustrative examples.

### P2-3 — `Document.confidentiality` has no enum; classification labels will drift
**Challenged:** Relationship Schema, `Document.confidentiality` (untyped) vs policy 07's three levels.
**Failure/guard:** Free-text confidentiality ("Confidential", "private", "CONFIDENTIAL-PRIVATE") defeats any filter, export rule, or pre-commit grep built on the labels. Guard: schema enum fixed to the policy levels `PUBLIC-SYNTHETIC | INTERNAL | CONFIDENTIAL-PRIVATE`, required on every Document record, and checklist C5 rejects any other value.

### P2-4 — A PROVISIONAL decision with downstream dependencies will be consumed as APPROVED
**Challenged:** Relationship Schema, `Decision {status: UNKNOWN|PROVISIONAL|APPROVED|REJECTED, downstreamDependencies[]}`; Evidence Inventory, "Decision dependencies" (U1–U4).
**Failure/guard:** `downstreamDependencies[]` is a list of things a decision unblocks; nothing stops a dependent workstream from starting on a PROVISIONAL decision because the dependency is "recorded." Guard: dependency edges are directional gates — a dependent item may cite a decision as *blocking* at any status, but may cite it as *satisfied* only at `APPROVED`; the master index must render unsatisfied dependencies as open gates, not as links.

---

## What the foundation gets right (for the record)

- UNKNOWN is used consistently and the Inventory honestly records "No user documents have been ingested."
- The Charter's gate list (no real identifiers/signatures/tax IDs in public GitHub; no invented forms; M2.7.1 synthetic acceptance ≠ security approval) is correct and is carried into policy 07 §8/§9.
- The Schema's invariant "A claimed relation is not verified by matching string keys, internal references, or an AI-generated document" is the right sentence — P0-4 and P1-2 exist because the field design does not yet obey it.

## Pre-commit checklist — run before ANY push to the public repo

Mechanical; every box, every commit. "I checked" means the command/inspection was actually run on the staged diff.

- **C1 — Diff scope.** `git diff --cached --stat` reviewed file by file. Only files on the `00_MASTER_INDEX` manifest, only intended changes. No new binary files (`git diff --cached --numstat` shows no `- -` entries) — no PDFs, images, scans, or archives, ever.
- **C2 — Identifier sweep.** Grep the staged diff for: `\b\d{2}-\d{7}\b` (EIN pattern), `\b\d{3}-\d{2}-\d{4}\b` (SSN pattern), `\b\d{9,}\b` (account-number candidates), `signature`, `signed by`, routing/account labels, and any real person's name paired with a financial/legal term. Every hit is resolved by removal — not by "it's probably fine."
- **C3 — No real-document metadata.** Diff contains no `contentHash` value for a real document, no real filename/title, no jurisdiction + document-type pairing for a real filing (§3.1 of policy 07). References to real evidence use aggregate counts + opaque `identifiersRef` only.
- **C4 — Ownership quarantine.** Diff contains no percentage, allocation split, or ownership interest figure for any entity whose status is not owner-verified, and no entity-to-entity ownership edge outside `lifecycle: proposed` + inline confidence (P0-5, P0-4).
- **C5 — Classification & status hygiene.** Every new/changed document or register row carries: classification from the fixed enum (P2-3), status from the Charter's state list, approvals accurately stated (NONE where none). No row claims `APPROVED_INTERNAL`, `EXECUTED`, `EVIDENCE_RECEIVED`, or `EXTERNALLY_VERIFIED` unless C7 passes.
- **C6 — Placeholder integrity.** Templates still contain their `<PLACEHOLDER_*>` fields and the `TEMPLATE — UNEXECUTED` header. No template has been "helpfully" pre-filled with real or realistic party data (P0-2). Synthetic fixtures use fictitious names/domains (P2-2).
- **C7 — Status-transition record.** Any status change in the diff names, in the same commit: prior status, actor, Decision record ID, and the `evidenceRef` relied on (P0-1). AI-authored changes never touch `EXECUTED` / `EVIDENCE_RECEIVED` / `EXTERNALLY_VERIFIED`.
- **C8 — Reference resolution.** Every `ownerApprovalRef`, `approvalRef`, `legalBasisDocumentIds`, and `supersedesId` introduced or relied on in the diff resolves to an existing record with the required status (P1-2, P1-3). Dangling ref = do not commit.
- **C9 — Claims sweep.** Grep the diff for indicative claims about backups, encryption, retention, RLS, access control, or verification ("in place," "enforced," "verified," "restorable," "compliant"). Each must cite executed evidence by run/record ID or be rewritten as UNKNOWN/TBD (P1-1; policy 07 §6.1, §8).
- **C10 — Relationship rows.** Every new/changed edge carries `confidence` inline; no `asserted`/`unknown` edge is `lifecycle: active`; legal-effect edges have non-empty `legalBasisDocumentIds` pointing only at `EXECUTED` documents (P0-4, P1-5).
- **C11 — Secrets & credentials.** Run the repo's secret scanner (or at minimum grep for `key`, `token`, `secret`, `password`, `BEGIN .* PRIVATE KEY`, high-entropy strings) over the full staged diff, including filenames and commit message.
- **C12 — Commit message.** Names the artefact IDs and status changes only; contains no personal data, no real document titles, no approval claims not present in the diff itself. Remember: the message is public and permanent, like the tree.

**Rule of the checklist:** a failed item is fixed by removing or downgrading content (status down, claim to UNKNOWN, row to private store) — never by adding a disclaimer next to the offending content. Disclaimers do not travel; content does.
