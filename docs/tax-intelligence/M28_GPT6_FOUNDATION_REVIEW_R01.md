# GPT-6 M2.8 Documentation Foundation v0.1 Review R1

**Decision:** ACCEPT AS DRAFT BASELINE ONLY. NOT an operationally validated registry, evidence store, legal determination, security clearance, or production release.

Reviewed actual GitHub `00_MASTER_INDEX.md`, `03_DECISION_REGISTER.md`, `ADVERSARIAL_REVIEW_M28_R01.md`, and `M28_REGISTRY_SCHEMA_R01.json` on branch `feature/tax-intelligence-m28-documentation-foundation-r1`, following Muse return for commit `5da7199121c3`. Other package contents/counts are integrator-reported, not individually line-audited in this review.

## Strengths
- Document categories, dependency map, evidence requests and U1–U4 carried forward.
- Provisional claims clearly separated from executed documents; no originals to be collected without private store designation.
- Dynamic relationship concept uses lifecycle, confidence, effective dates, tenant and revision.
- Adversarial review explicitly flags procedural-vs-enforced control risk.

## Required corrections before operational registry implementation
1. **P0 status/authority:** JSON Schema enums and narrative `x-integrator-invariants` do NOT enforce owner authorization, evidence-backed state transitions, signatures, or approval authenticity. Implement external transition validator, authorized actor binding, decision/evidence resolution and negative tests. Do not allow AI-authored text to elevate status.
2. **P0 cross-record constraints:** `legalBasisDocumentIds` documentation says EXECUTED-only but schema cannot verify referenced document status. Enforce referential integrity and signed/executed provenance in application logic; distinguish legal-basis vs mere evidence.
3. **P0 public/private projections:** public JSON serialization must explicitly exclude private metadata, hashes, sensitive dates and refs; do not rely on optional fields or reviewer checklists alone. Real evidence records must stay in private store.
4. **P1 lifecycle rule:** schema prohibits `active` with `asserted/unknown`, but does not require independently supported legal basis, owner authorization, or validated entity scope. Add relation-type-specific activation requirements and tests. `supported` must not be interpreted as legally operative without approval.
5. **P1 schema quality:** Relationship `allOf.if.properties.lifecycle` without `required:["lifecycle"]` can match objects missing lifecycle in generic validation, although Relationship itself requires lifecycle; keep explicit and test. `x-integrator-invariants` are documentation, not executable JSON Schema constraints. Add `additionalProperties:false` where appropriate and test public/private DTO projections.
6. **P1 nomenclature:** Distinguish evidence received, independently verified, owner-approved, legally executed, and tax-classified as separate axes, not a single mutually exclusive status enum.
7. **P1 audit/backup:** immutable private audit trail, retention, backup and restore-test evidence remain design work, not fulfilled controls.

## Owner decisions
- D-01 **now needed before intake**: select private encrypted evidence store and approved access/backup approach. Until then DO NOT COLLECT ORIGINALS.
- D-02 **now helpful**: confirm provisional legal-entity/brand/project classification, without inferring legal identity or ownership percentages.
- U1–U4 remain unresolved; counsel/CPA and privacy-remediation approvals stay separately gated.

## Next action
Muse to publish v0.2 remediation specification and tests-first validator plan, no live data or production changes. Continue draft templates in isolation. Ask owner D-01/D-02 only; do not seek signatures, filings or legal conclusions. M2.7.1 SYNTHETIC ACCEPTANCE unaffected.
