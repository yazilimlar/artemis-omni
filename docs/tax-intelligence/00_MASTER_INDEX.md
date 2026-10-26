# M2.8 Documentation Foundation — Master Index v0.1

**Package status: DRAFT_ASSUMPTION throughout. Approvals: NONE. Effective dates: TBD.**
**Branch:** `feature/tax-intelligence-m28-documentation-foundation-r1` · **Foundation docs:** Charter / Relationship Schema / Evidence & Draft Inventory (R01, GPT-6).
**Compiled by:** Muse, Lead Integrator, from the M2.8 panel (writer, accounting challenger, adversarial reviewer lanes — see `08_MULTI_AI_WORKPLAN.md`).
**Hard rule for this entire package:** nothing here is an executed agreement, an official record, a tax filing, legal/tax advice, or an ownership determination. Confidential originals never enter this repository (policy in doc 07).

## Document manifest

| # | Document | Contents | Status | Depends on |
|---|---|---|---|---|
| 00 | `00_MASTER_INDEX.md` (this file) | Manifest, dependency map, owner decisions summary | DRAFT_ASSUMPTION | — |
| 01 | `01_ENTITY_AND_BRAND_REGISTER.md` | Entity/brand/project/account/system records; every verificationStatus UNKNOWN | DRAFT_ASSUMPTION | 04 §1–§2 receipts upgrade rows |
| 02 | `02_RELATIONSHIP_REGISTER.md` | Typed effective-dated edges; all proposed, legal bases MISSING | DRAFT_ASSUMPTION | 01, 04, 03 (U2) |
| 03 | `03_DECISION_REGISTER.md` | U1–U4 + M2.8 decisions D-01…D-08 with blockers | DRAFT_ASSUMPTION | 04 evidence |
| 04 | `04_DOCUMENT_REQUEST_CHECKLIST.md` | **Missing-evidence register**: 43 requested originals across 8 areas + backups; all NOT RECEIVED | DRAFT | Owner/private sources only |
| 05 | `05_AGREEMENT_TEMPLATE_CATALOG.md` | 14 unexecuted templates (INT-01…06, EXT-01…08), counsel review required | DRAFT_ASSUMPTION | 03 (U2 for INT-04) |
| 06 | `06_FINANCIAL_CONTROL_TEMPLATES.md` | COA, cost centers, accrual/expense/invoice forms, AP/AR, payout + sales-tax workpapers (M2.7 identity), W-2/1099 intake, quarterly close | DRAFT_ASSUMPTION | M2.7 kernel schema R2 |
| 07 | `07_DATA_ACCESS_AND_EVIDENCE_POLICY.md` | Classification, never-in-repo list, default-DENY access matrix, evidence handling, retention TBDs | DRAFT_ASSUMPTION | 03 (D-03 private store) |
| 08 | `08_MULTI_AI_WORKPLAN.md` | Panel roles, lanes, exit criteria for v0.1 → v0.2 | DRAFT_ASSUMPTION | — |
| — | `ADVERSARIAL_REVIEW_M28_R01.md` | Privacy/authorization adversarial review: 5 P0, 6 P1, 4 P2 + 12-item pre-commit checklist | DRAFT_REVIEWED (review artifact) | All above |
| — | `M28_REGISTRY_SCHEMA_R01.json` | Machine-readable registry schema (Entity/Document/Relationship/Obligation/Decision) with status enums + integrator invariants | DRAFT_ASSUMPTION | Relationship Schema R01 |

## Dependency map

```
04 evidence receipts ──► 01 entity verification ──► 02 relationship confidence upgrades
        │                        │                            │
        ├──► U1 (processor) ─────┴──► 06 workpapers usable ──► M2.7 kernel live-scope (BLOCKED separately)
        ├──► U2 (entity) ────────► INT-04 intercompany usable │ 05 templates executable (needs counsel + owner)
        ├──► U3 (tax treatment) ─► 06 tax fields unlock (Decision Register + CPA only)
        └──► U4 (privacy/history) ► owner remediation decision (history rewrite NOT authorized)
07 policy ──► governs handling of every 04 receipt; 07 does NOT clear the M2.7 RLS/security gate
Adversarial P0 guards (status transitions, template segregation, metadata hygiene) ──► apply to 01/02/05 before ANY status change
M2.7.1 synthetic acceptance (GPT-6, e5d2855) ──► authorises kernel only; NOT a security or documentation approval
```

## Panel findings carried into this package (not silently dropped)

- **Accounting challenger #1:** with U2 unresolved, no pair of parties is verified distinct — intercompany templates (INT-04) stay unusable until two formation-verified entities exist for that edge.
- **Accounting challenger #3:** collected tax must post to a dedicated liability account; a lump "gross receipts" account would recreate the R1 9000 error in ledger form.
- **Adversarial P0-2:** templates are segregated by `*_TEMPLATE` naming and fixed `UNSIGNED_TEMPLATE` status; a register may cite only EXECUTED documents as legal basis — all current citations point at MISSING checklist items instead.
- **Adversarial P0-4 → schema invariant added:** a Relationship may not be `lifecycle: active` while `confidence` is `asserted` or `unknown` (encoded in `M28_REGISTRY_SCHEMA_R01.json`).
- **Adversarial P0-5:** public registers carry name/kind/status/opaque-ref only — no ownership percentages anywhere in this package (verified by sweep at commit time).

## Owner decisions (summary — full register in doc 03)

Blocking safe progress: **D-01** designate the private evidence store (until then: do not collect originals); **D-02** confirm/correct the provisional entity list and which entities actually exist. Non-blocking but queued: counsel review engagement (D-04), CPA review for U3 (D-05), U4 remediation stance (D-06). Everything else proceeds as drafts without owner input.
