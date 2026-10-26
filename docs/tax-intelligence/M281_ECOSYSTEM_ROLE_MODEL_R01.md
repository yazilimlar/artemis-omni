# M2.8.1 Ecosystem Role Model R01

| Field | Value |
|---|---|
| Document | M281_ECOSYSTEM_ROLE_MODEL_R01 |
| Lane | Claude — scoped writer (draft); integrated and reconciled by Muse, Lead Integrator; attacked by the Grok lane (annex `M281_GROK_ADVERSARIAL_REVIEW_R01.md`) |
| Status | DRAFT_ASSUMPTION |
| Mode | SYNTHETIC ONLY — no live data, no identifiers, no ownership percentages |
| Date of draft | 2026-10-26 |
| Canonical base | `feature/tax-intelligence-m28-documentation-foundation-r1` @ `63864c8609f887b9fbb1fb6ece0533b38f1c72b9` (per Evidence Packet, integrator-verified 2026-10-26) |
| Sources | Evidence Packet; `M281_APOLLOA_FORMATION_AND_ECOSYSTEM_HANDOFF_R01.md`; `M28_D02_AGORAXAI_PLATFORM_PARTICIPATION_CLARIFICATION_R01.md`; `M28_D02_APOLLOA_PRE_REGISTRATION_STATUS_R01.md`; `M28_GPT6_FOUNDATION_REVIEW_R01.md`; Registers 01/02 (v0.1); `M28_REGISTRY_SCHEMA_R01.json` (v0.1) |
| Authorisation | No record activation, legal conclusion, or status upgrade is authorised by this draft |

> **Core principle (owner-confirmed, D-02).** AgoraXAI participation does **not** establish ownership, equity, legal personhood, tax consolidation, agency, revenue share, liability assumption, or a right to bind another participant. This model exists to make that principle structural: roles are separate records, relations are typed and evidenced, and no view or query may collapse one relation type into another.

---

## 1. Design rules

1. **Roles, not essences.** A record does not say what a thing *is* in all contexts; a **role record** says what function a subject performs in a scoped context (tenant, legal-entity scope, effective period). One real-world thing may hold many roles at once, each as a **separate role record** (§3).
2. **Legal entity is a gated record type.** A `LegalEntity` record may be created/activated only on formation evidence + owner authorisation (GPT-6 P0/P1: external transition validator, authorised-actor binding, decision/evidence resolution, negative tests). A brand, project, initiative, or agora participant is **never** a legal entity, and no role record upgrades into one by inference.
3. **Every edge is typed, evidenced, and dated.** No untyped "associated with" edges. Every relationship carries the full field set in §5; an edge without evidence stays `confidence: asserted|unknown` and `lifecycle: proposed` — and per schema v0.1 invariant, a relationship **may not be `active` while confidence is `asserted` or `unknown`**.
4. **Separate axes, not one status (GPT-6 P1).** Evidence-received, independently-verified, owner-approved, legally-executed, and tax-classified are **separate axes** on records where relevant. `supported` ≠ legally operative without approval.
5. **Legal basis ≠ evidence.** `legalBasisDocumentIds` may cite only documents whose status is `EXECUTED` when relied on as legal basis, enforced in application logic with referential integrity (GPT-6 P0). Templates (`UNSIGNED_TEMPLATE`) can never be a legal basis. Mere evidenceRefs never substitute for a legal basis where one is required (§5.3).
6. **Tenant isolation + legal-entity scope are carried, never inferred.** `tenantId` on every record; `legalEntityScope` required for any financial relationship (schema v0.1 invariants). A missing scope is a validation failure, not a default.
7. **No public leakage.** Public serialization is a mechanical allowlist projection that excludes private metadata, hashes, sensitive dates, identifiers, percentages, and private refs (GPT-6 P0). This draft defines the model; the allowlist itself is implementation work requiring its own negative tests.
8. **AI text never elevates status.** No document, summary, or generated text (including this draft) can raise confidence, activate a lifecycle, or verify a record. Only the validator path in Rule 2 can.

---

## 2. Record types

Ten distinct record types. Each is a separate record with its own `id`, lifecycle, and evidence; none is a subtype of another.

| # | Record type | Definition | What it is NOT | Key fields (in addition to common fields, §4) |
|---|---|---|---|---|
| R1 | **LegalEntity** | A person in law: a formed/registered entity (e.g. an LLC) or a natural person, evidenced by formation/registration documents. | Not a brand, project, platform account, trade name, or initiative. | `legalForm` (UNKNOWN until evidenced), `jurisdiction`, `formationStatus` (`formed` only on evidence; otherwise no record / `proposed` placeholder per §6.4), `identifiersRef` (opaque private-store ref only — never a value), separate axes: evidenceReceived / independentlyVerified / ownerApproved / legallyExecuted / taxClassified |
| R2 | **Brand** | A name/mark/presentation used in commerce or communication (name, trade dress, domain-facing identity as presented). | Not a legal person; cannot contract, own, owe tax, or be insured in its own right. | `displayName`, `holderRef` (only via `owns_ip` / holder edge, §5 — UNKNOWN if unevidenced), trademark axis (UNKNOWN until filings evidenced) |
| R3 | **AgoraParticipant** | A participant role in a platform ecosystem: an independent agora taking part under platform terms. The participant **subject** is referenced, not defined, by this record. | Not proof of incorporation, ownership by the platform, or agency (§7). | `platformRef` (via `participates_in_platform` edge), `participantStatus` (e.g. pre-registration initiative — descriptive, not legal), sector/capability refs (via edges) |
| R4 | **Platform** | A hosting/support ecosystem that other participants join: online presence, marketing, strategy, software support functions as described by the owner for AgoraXAI. | Not the owner of its participants by virtue of hosting them; not itself automatically a LegalEntity record (its operator is a separate question, R10). | `platformName`, `operatorRef` (via edge — UNKNOWN if unevidenced), termsRef (UNKNOWN until platform agreement evidenced) |
| R5 | **Capability** | A function/activity a subject can perform or intends to perform (e.g. food import, consulting, apparel design as *activities*). | Not a licence, permit, registration, or proof the activity has occurred. | `capabilityName`, `activityScopeNote` (descriptive only), readiness axis (gates unevidenced = not ready; see decision-matrix §7 cross-ref in lane draft 1) |
| R6 | **Industry** | A sector classification node (e.g. food & beverage import/export; consulting; apparel/product design). Pure taxonomy. | Not a regulatory approval, NAICS determination, or tax classification — classification for any official purpose is UNKNOWN until made by the competent process. | `industryName`, `taxonomyNote` |
| R7 | **ServiceProvider** | A role record for a subject providing services to another subject (technology, support, shared services, professional services). | Not an employee/employer finding, not agency, not ownership. The provider subject may be a LegalEntity, individual, or system — stated by reference, not assumed. | `serviceScopeNote`, recipient via `provides_services_to` edge |
| R8 | **Asset** | A thing of value/utility that can be held: domain name, IP right, equipment, account-as-asset where applicable. (Bank/processor *accounts* remain their own register concern from v0.1; this type does not absorb them without a v0.2 decision — gap, §9.) | Not its holder; holding is an edge, not a property of the asset record alone. | `assetKind` (descriptive), `holderRef` via edge only, `identifiersRef` opaque/private only |
| R9 | **Contract** | A record of an agreement **as a document record**: parties (by reference), type, signature/execution axes. A template is a different signature status, never a contract relied on as executed. | Not proof of performance, payment, or current force without separate evidence; an UNSIGNED_TEMPLATE is not a contract for legal-basis purposes. | `contractType`, `partyRefs[]`, `signatureStatus` (`UNSIGNED_TEMPLATE \| UNSIGNED \| SIGNED_UNVERIFIED \| SIGNED_VERIFIED`), `documentStatus` axis separate from signature axis, `legalBasisEligible` = true only when EXECUTED per validator |
| R10 | **LegalOperator** | A role record designating which LegalEntity (or natural person) is the actual legal party operating an activity, contracting, importing, or being insured for a given scope/period. | Not a new entity; not inferred from branding, platform participation, or who benefits from the activity. | `operatorSubjectRef` (must resolve to an R1 record), `activityScope`, designation evidence + ownerApprovalRef required for activation |

**Common fields (all record types):** `id`, `recordType`, `displayName`, `tenantId`, `revision` (≥1, amendments create new revisions; deletion forbidden — terminate instead), `status` (document/record status vocabulary from schema v0.1: `DRAFT_ASSUMPTION … UNKNOWN`), `verificationStatus` (`UNKNOWN | ASSERTED | SUPPORTED | EXTERNALLY_VERIFIED | DISPUTED`), `provenanceRefs[]`, `validFrom / validTo` (nullable, never invented), `identifiersRef` (opaque private ref or null — never a value).

---

## 3. One thing, many role records

A single real-world thing is represented by **one subject reference** plus **one role record per role it actually holds**, linked to the subject — never by stretching one record to cover all roles.

Worked pattern (synthetic, labels only):

- Subject "Apolloa" → role records: `Brand` (R2), `AgoraParticipant` (R3), holder of `Capability` refs (R5) and `Industry` refs (R6). **No `LegalEntity` role record** (pre-registration, §6).
- Subject "AgoraXAI" → role records: `Platform` (R4), `Brand` (R2). A `LegalEntity` role record for whatever operates AgoraXAI exists **only if evidenced** — currently UNKNOWN, so no such record is activated.
- Subject "ARTEMIS" → role records: `Brand` (R2), `ServiceProvider` (R7, *proposed* — §6). The Tax Intelligence application is a `system` in Register 01 v0.1; whether "ARTEMIS" the service provider, "ARTEMIS" the brand, and the system are one subject is **unresolved in v0.1** (Register 01, note 2) and stays unresolved here — gap, §9.
- Subject "Great Order LLC" → role record: `LegalEntity` (R1, *provisional/UNKNOWN* verification). A `LegalOperator` role record (R10) for Apolloa activities is **not** created by this draft: it would require verification of Great Order LLC + an owner designation (§6).

**Rule:** adding a role record never modifies another role record's status. In particular, adding `AgoraParticipant` never creates `LegalEntity`; adding `ServiceProvider` never creates agency; adding `Brand` never creates IP ownership.

---

## 4. (Reserved — common fields are defined in §2)

## 5. Typed edges (many-to-many)

### 5.1 Edge record shape — every edge, no exceptions

`id, fromId, toId, relationType, evidenceRefs[], legalBasisDocumentIds[], confidence, lifecycle, effectiveFrom, effectiveTo, tenantId, legalEntityScope, ownerApprovalRef, revision`

- `confidence` ∈ `asserted | supported | verified | disputed | unknown`
- `lifecycle` ∈ `proposed | active | suspended | terminated`
- **Invariant (schema v0.1):** `lifecycle: active` is forbidden while `confidence ∈ {asserted, unknown}`.
- **GPT-6 P1 strengthening:** each relation type has its own activation requirements (§5.3); `supported` alone never makes an edge legally operative — owner approval (`ownerApprovalRef` resolving to a real Decision record) plus type-specific legal basis are also required where §5.3 says so.
- Effective-dating: `effectiveFrom/effectiveTo` bound the period the edge held; amendments create a new `revision` with its own dates; supersession is explicit; termination sets `lifecycle: terminated` + `effectiveTo`. Queries must reproduce the graph as it stood on any past date (Register 02 change control).
- Many-to-many: the same pair of subjects may hold several edges of different types simultaneously, and the same edge type may connect many pairs. No edge type is exclusive unless §5.3 states it.

### 5.2 Permitted relation types (this draft)

| Relation type | From → To (typical) | Meaning — and only this meaning |
|---|---|---|
| `participates_in_platform` | AgoraParticipant (subject) → Platform | The subject takes part in the platform ecosystem under (unevidenced, unless cited) platform terms. |
| `provides_services_to` | ServiceProvider (subject) → any subject | The provider supplies described services to the recipient for the effective period. |
| `owns_equity_in` | holder subject → LegalEntity | An equity interest exists as evidenced. **No percentage is recorded in this model layer / any shared record** (owner instruction + schema invariant). Direction and existence still require executed legal basis (§5.3). |
| `owns_ip` | holder subject → Brand / Asset (IP) | The holder owns the specified IP/brand asset as evidenced by filings/assignments. Filing ≠ registration ≠ ownership conclusion — axes stay separate. |
| `operates_activity_as` | LegalOperator / LegalEntity → Brand / AgoraParticipant / activity subject | For the effective period, the operator conducts the named activity under the named presentation (covers the trade-name/DBA pattern and the pre-formation operator pattern). The operated name gains **no** legal personhood from this edge. |
| `has_contract_with` | subject ↔ subject (record the Contract R9 as the edge's legal-basis/evidence anchor) | The two subjects are parties to the cited Contract record. Party status is exactly what the executed contract says — no broader relationship is implied. |

**Out of scope / not introduced here:** v0.1 candidate types (`may_own_brand`, `may_provide_software_support`, etc., REL-001–003) remain `proposed/asserted` candidate records in Register 02; the `may_` prefix is part of their meaning. They must be **re-expressed** as one of the §5.2 types (or retired) only on evidence — never silently renamed into an asserted fact (§6.3). Any new relation type (e.g. capability/industry attachment: `has_capability`, `classified_in_industry`) needs a v0.2 schema decision — proposed in §9, **not** adopted in this draft, so capability/industry links in §6 are shown as role-record references, not §5.2 edges.

### 5.3 Activation requirements per relation type (GPT-6 P1)

| Relation type | Minimum to reach `lifecycle: active` |
|---|---|
| `participates_in_platform` | Evidence of participation/terms acceptance (evidenceRefs non-empty, confidence ≥ supported) + ownerApprovalRef. Activates **participation only** — no other type may be activated on this evidence. |
| `provides_services_to` | Executed Contract record (R9, EXECUTED + legalBasisEligible) cited in legalBasisDocumentIds, **or** other type-appropriate executed basis as defined by the validator spec (v0.2 work) + ownerApprovalRef + legalEntityScope where money/services flow is financial. |
| `owns_equity_in` | Executed formation/operating/subscription documents (EXECUTED only) + referential-integrity check that cited docs exist and are EXECUTED + ownerApprovalRef. Never activatable from participation, branding, invoices, or narrative text. |
| `owns_ip` | Filing/assignment/registration evidence appropriate to the asset + EXECUTED assignment where ownership is claimed by transfer + ownerApprovalRef. |
| `operates_activity_as` | Verified operator LegalEntity record (R1, independentlyVerified axis satisfied) + owner designation Decision + trade-name filing evidence where the jurisdiction requires it + effectiveFrom. Never activatable for a non-existent / unverified operator. |
| `has_contract_with` | The cited Contract record itself at EXECUTED / SIGNED_VERIFIED (per validator) + both party records exist as R1 (or natural-person R1) records. A template or unsigned draft activates nothing. |

Unknown relation types must fail closed with a coded exception (M2.7 kernel style: `ILLEGAL_EDGE`, never a bare TypeError) — validator/test work, specified here, not implemented in this draft.

---

## 6. Mapping — ONLY owner-confirmed facts

Legend: **OC** = owner-confirmed in D-02 docs / Evidence Packet. **UNK** = UNKNOWN. Nothing below adds a fact.

### 6.1 Subjects and role records

| Subject | Role records (this draft) | Basis / status |
|---|---|---|
| **Apolloa** | `Brand` (R2) — DRAFT_ASSUMPTION, verification UNKNOWN | Name in use as initiative/brand label (OC as participant name; trademark/holder UNK) |
| | `AgoraParticipant` (R3) — participantStatus: **pre-registration initiative** | **OC:** independent agora participant; **not legally registered** |
| | Capability refs (R5, descriptive/intended only): food & beverage import/export; consulting; apparel/product design | **OC as intended sectors**; readiness UNK / not evidenced; no activity is asserted to have occurred |
| | Industry refs (R6, taxonomy only): food & beverage trade; consulting; apparel/product design | OC as intended scope; no official classification asserted |
| | ~~`LegalEntity`~~ — **NO RECORD. Deliberately absent.** | Creating one is forbidden until formation evidence + owner authorisation (§6.4) |
| **AgoraXAI** | `Platform` (R4) — hosting/support ecosystem for independent agoras | **OC** (owner-described business model) |
| | `Brand` (R2) — DRAFT_ASSUMPTION, verification UNKNOWN (Register 01, ENT-003) | Trademark status UNK |
| | `LegalEntity` for its operator — **no activated record** | Operator / legal form UNK; ARTEMIS support relation does not answer this (§6.3) |
| **ARTEMIS** | `Brand` (R2) — DRAFT_ASSUMPTION, verification UNKNOWN (Register 01, ENT-002) | Trademark status UNK |
| | `ServiceProvider` (R7) — **proposed only**; scope note: "may provide technical support to AgoraXAI" | Packet wording is *may*; contracts/operator **unverified — do not assert legal obligation**. Edge stays proposed/asserted (§6.3) |
| **Great Order LLC** | `LegalEntity` (R1) — provisional; verificationStatus **UNKNOWN** (Register 01, ENT-001) | **Provisionally** described as legal entity / operating anchor (OC as owner description); formation, jurisdiction, members, tax classification all UNK; basis documents MISSING |
| | `LegalOperator` for Apolloa activities — **no record created** | Would require Great Order verification + owner designation + (for DBA pattern) trade-name evidence. None exists. |
| **Owner (natural person)** | `LegalEntity` (R1, natural-person form) — placeholder only, **no name or identifier recorded** (Register 01, ENT-010 pattern) | Role as owner is the source of D-02 confirmations; legal name deliberately not in any shared record |

### 6.2 Edges (all states are current-evidence states, not targets)

| Edge | Type | Confidence | Lifecycle | Legal basis | Note |
|---|---|---|---|---|---|
| Apolloa → AgoraXAI | `participates_in_platform` | supported (owner-confirmed participation model) | proposed* | None (no platform agreement in evidence) | *Even with owner confirmation of the *model*, activation awaits the §5.3 validator + platform-terms evidence. Participation implies nothing else (§7). |
| ARTEMIS → AgoraXAI | `provides_services_to` | asserted | proposed | None (REL-003 candidate; contracts MISSING) | Re-expression of v0.1 `may_provide_software_support`. "May" is substantive. |
| Great Order LLC → ARTEMIS (brand) | `owns_ip` | asserted | proposed | None (REL-001 candidate `may_own_brand`; filings MISSING) | Candidate only. No IP ownership asserted for any party. |
| Great Order LLC → agoraxai.com (Asset, ENT-005) | `owns_ip` / holder edge | asserted | proposed | None (REL-002 candidate; registrar record MISSING) | Candidate only. Asset record itself DRAFT_ASSUMPTION. |
| Apolloa → any party | `owns_equity_in` (either direction) | — | **NO EDGE** | — | No equity fact exists in evidence. Creating one is a §7 violation. |
| Any party → Apolloa | `operates_activity_as` | — | **NO EDGE** | — | Pre-formation operator is undetermined (separate gates deliverable). |
| Apolloa ↔ any party | `has_contract_with` | — | **NO EDGE** | — | Apolloa cannot be a contract party (no legal personhood). Any real pre-formation contract belongs to its actual R1 party. |

### 6.3 Re-expression note for Register 02 v0.1 edges

REL-001/002/003 use `may_*` types with `confidence: asserted, lifecycle: proposed, ownerApprovalRef: NONE, evidenceRefs: []`. Under this model they map to the §6.2 candidate edges above **with states unchanged**. Renaming the type does not raise confidence, add evidence, or activate the edge.

### 6.4 The proposed-future-entity pattern

If/when the owner authorises formation (Phase C, decision-matrix draft §8): (1) create a **new** R1 LegalEntity record (new id) on formation evidence; (2) link it to the Apolloa subject's existing Brand/AgoraParticipant role records via evidenced edges (`operates_activity_as`, `owns_ip` if assigned, platform terms in the entity's name if executed); (3) terminate/date-bound any prior operator edges explicitly. The initiative record is **never edited into** a legal entity, and history before formation remains attributed to whoever the actual operator was.

---

## 7. Non-inference rules (normative — validator must reject violations)

**N-1. Participation ≠ ownership.** `participates_in_platform` never implies, creates, or evidences `owns_equity_in` in either direction, at any confidence.

**N-2. Participation ≠ subsidiary / parent.** No "subsidiary", "parent", "affiliate-by-participation", or group-structure label may be derived from platform participation, hosting, marketing, strategy, or software support.

**N-3. Participation ≠ agency.** A participant cannot bind the platform, and the platform cannot bind a participant, by virtue of participation. Agency requires its own executed legal basis — none is in evidence.

**N-4. Participation ≠ tax consolidation / common classification.** No shared tax identity, consolidated filing, common classification, or transfer of tax obligations follows from any edge in this model. Tax classification is a separate axis per LegalEntity, UNKNOWN unless separately determined.

**N-5. Participation ≠ liability assumption / revenue share.** Hosting/support/participation edges carry no liability assumption, guarantee, or revenue-share term unless an EXECUTED contract cited on a `has_contract_with` edge says so — and then only to that contract's terms.

**N-6. Services ≠ ownership/control.** `provides_services_to` (including ARTEMIS → AgoraXAI, if ever activated) implies no equity, no platform ownership, no control, and no obligation beyond the cited executed basis.

**N-7. Brand use ≠ IP ownership.** Using, displaying, or trading under a brand (including Apolloa or AgoraXAI branding) evidences neither `owns_ip` nor a licence. Both require §5.3 evidence.

**N-8. Trade name ≠ entity.** `operates_activity_as` (DBA pattern) creates no LegalEntity, no shield, and no IP holder for the operated name. Liabilities/ownership sit with the operator R1 record.

**N-9. Contract ≠ relationship beyond its terms.** `has_contract_with` proves party status for that contract only — not partnership, joint venture, employment, or agency.

**N-10. No transitive inference.** Edges do not compose: A participates in P and P is operated by O does **not** yield any A–O edge of any type. A serves B and B serves C yields no A–C edge.

**N-11. No status by narrative.** Matching names, shared branding, internal references, or AI-generated text (including this draft) verify nothing (schema v0.1 invariant). Confidence/lifecycle changes pass only through the §1 Rule 2 validator path.

**Required negative tests (for the synthetic test deliverable, specified not implemented here):** (a) attempt to activate an Apolloa LegalEntity record without formation evidence → reject; (b) attempt to derive/create `owns_equity_in` from an active `participates_in_platform` edge → reject (`ILLEGAL_EDGE`-style coded failure / inference-rejection code); (c) attempt `lifecycle: active` with `confidence: asserted` → reject; (d) attempt to cite an UNSIGNED_TEMPLATE contract as legalBasis → reject; (e) attempt `operates_activity_as` with an unverified operator → reject; (f) public projection of any §6 record must contain no identifiers, percentages, hashes, or private refs → allowlist test.

---

## 8. Three-view separation

The same underlying records are projected into three views. **Views are projections, not copies** — a fact appears in a view only if its edge/record type belongs there, and no view may import edges from another view to complete a picture.

| View | Contains | Explicitly excludes |
|---|---|---|
| **V1 — Ownership / control** | R1 LegalEntity records; `owns_equity_in` edges; `owns_ip` edges; governance/authority facts **only where** tied to executed basis documents. Currently: Great Order LLC provisional R1; candidate `owns_ip` edges (proposed/asserted); **no equity edges at all**. | Participation edges, capability/industry refs, service edges, platform structure. An empty/sparse V1 is the correct current output — sparsity is information, not a defect to fill by inference. |
| **V2 — Platform participation / capabilities** | R4 Platform, R3 AgoraParticipant, R2 Brand (as presented on the platform), R5 Capability, R6 Industry, `participates_in_platform` edges. Currently: AgoraXAI platform; Apolloa participant (pre-registration) with intended capabilities/industries. | Ownership, equity, IP title, contract terms, money flows. V2 must render Apolloa **without** any legal-entity badge/status. |
| **V3 — Contracts / financial flows** | R9 Contract records, `has_contract_with` and `provides_services_to` edges, R10 LegalOperator designations, financial relationships (with mandatory legalEntityScope). Currently: one proposed service edge (ARTEMIS → AgoraXAI, asserted, no basis); **no contracts, no operator designation, no financial flows**. | Inferred obligations. Where no executed contract exists, V3 shows the gap explicitly rather than drawing a flow from V2 participation. |

**Cross-view rule:** joining views for a report requires citing the specific edge/record IDs from each view. A joined statement (e.g. "X owns Y and Y participates in Z") is valid only if **each clause** is independently evidenced in its own view. This is the structural enforcement of §7 N-10.

---

## 9. Gaps flagged for the integrator / reviewers

| ID | Gap | Effect |
|---|---|---|
| G-1 | **Capability/industry attachment has no §5.2 edge type.** Handoff lists five relation types + `has_contract_with`; attaching R5/R6 to subjects needs either role-record references (used here) or new types (`has_capability`, `classified_in_industry`) adopted in schema v0.2. | §6 shows capability/industry as role-record refs only. Integrator/GPT-6 to decide the v0.2 mechanism; do not improvise edge types in fixtures. |
| G-2 | **ARTEMIS subject identity unresolved** (Register 01 note 2): brand vs project/platform label vs system vs service provider may be one subject or several. | §6 keeps Brand and ServiceProvider role records under one provisional subject label, flagged. A wrong merge here would falsify V1/V3 — resolve by owner decision, not by this draft. |
| G-3 | **Account records (v0.1 kind `account`) have no home** in the ten R-types: Asset (R8) may or may not absorb them. | Left unmapped deliberately. v0.2 schema decision needed before any account edge is modelled. |
| G-4 | **Platform terms unevidenced:** no AgoraXAI platform agreement, terms, or participant agreement is in evidence. | `participates_in_platform` cannot pass §5.3 activation; lifecycle stays proposed even though the participation *model* is owner-confirmed. Reviewers should check this is not "upgraded" in fixtures. |
| G-5 | **Activation-requirement spec (§5.3) is prose.** GPT-6 P0 requires an external transition validator, authorised-actor binding, and decision/evidence resolution implemented + negative-tested. | This draft specifies; it does not implement or validate. No operational claim may cite §5.3 as an enforced control. |
| G-6 | **Public/private projection allowlist not defined here.** GPT-6 P0 requires a mechanical allowlist with negative tests. | §1 Rule 7 / §8 state the requirement only. Implementation + tests are separate deliverables. |
| G-7 | **Schema v0.1 kinds ≠ R-types:** v0.1 `kind` enum (`legal_entity \| individual \| brand \| project \| system \| account \| asset`) has no platform/participant/capability/industry/operator/contract kinds. | This model requires a schema v0.2 (GPT-6 next-action) before fixtures/tests can encode R3/R4/R5/R6/R9/R10 natively. Fixtures written against v0.1 kinds must say so explicitly. |
| G-8 | **Great Order LLC verification is the blocking unknown** for R10 and for V1 completeness: formation/jurisdiction/agreement/classification all MISSING. | No operator, DBA, or ownership modelling can advance until evidenced + owner-designated. |

---

## 10. What this model asserts — and does not

**Asserts (model design only):** ten distinct role record types; one-thing-many-roles via separate records; six typed, effective-dated, evidenced edge types with per-type activation requirements; three non-mixing views; eleven non-inference rules with required negative tests.

**Does not assert:** that Apolloa is formed, owned, operated, contracted, insured, tax-classified, or ready to trade; that AgoraXAI is operated by any particular legal person; that ARTEMIS owes or performs any service; that Great Order LLC owns any brand/domain or operates any Apolloa activity; any ownership percentage; any identifier. All such facts remain UNKNOWN until evidenced and owner-authorised through the validator path.

---

## 11. Integrator reconciliation + validator implementation (added at integration, 2026-10-26)

**Reconciliation with the v0.1 registry kinds (closes the encoding half of gap G-7 for synthetic scope).** The synthetic validator (`lib/tax-intelligence/ecosystem.ts`, committed with this package) encodes subjects with the v0.1 `kind` enum (`legal_entity | individual | brand | project | system | account | asset`) and expresses the R-types as roles over those kinds: Platform ≈ a `system`/`project` subject holding the platform role; AgoraParticipant ≈ the subject of a `participates_in_platform` edge (Apolloa: `brand`, `legalStatus: pre-registration`); LegalOperator ≈ the `legal_entity` subject of an `operates_activity_as` edge; Contract ≈ a registry Document record. Role records R3/R4/R5/R6/R9/R10 as native kinds remain a **schema v0.2 decision for GPT-6** — this package does not silently adopt them.

**GPT-6 P0/P1 enforcement (gaps G-5/G-6) is implemented in synthetic scope** by `lib/tax-intelligence/ecosystem.ts` + `ecosystem.test.ts` (36 tests: Grok N-01…N-28 negative, P-01…P-08 positive; all passing locally, integrator re-run 2026-10-26; `tsc --noEmit` clean): closed relation table with coded `ILLEGAL_EDGE` for unknown/legacy/malformed strings; per-type activation rules (endpoint kinds, minimum confidence — equity/IP/operator require `verified` — EXECUTED + `SIGNED_VERIFIED` legal basis of the correct document class, resolvable APPROVED Decision by an authorised actor, tenant isolation on endpoints/documents/decisions, `legalEntityScope` for financial relations, effective-date range/overlap/backdating checks); explicit rejection of subsidiary/equity/control/agency derivation from non-equity edges and of tax-consolidation claims (`CROSS_ENTITY_ALLOCATION`); pre-registration subjects can never activate as legal entity, equity target, or operator without formation evidence; public projection is an allowlist serializer verified by deep-equality tests. §5.3's prose table and the validator's rule table were reconciled by the integrator; where they differed, the stricter rule (Grok §2) was implemented.

**What remains open after this package:** real-world document authenticity and actor identity are process controls behind the D-01 gate (private evidence intake still blocked) — the validator checks record fields, not the world (Grok residual risks §5). No record in §6 is activated by this package; all states shown are current-evidence states.

---
*DRAFT_ASSUMPTION — SYNTHETIC ONLY — UNAPPROVED. Writer lane: Claude; integrator: Muse; challengers: Gemini (regulatory) + Grok (adversarial). Builder/reviewer separation observed.*
