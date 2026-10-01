# Handover: Session 2026-10-01 — Governance: Phase 1 inventory and registry sync

Standardized, parse-friendly handover. Historical states remain available through Git, pull requests, issues, and dated files under `docs/evolution/` and `docs/history/`. The previous handover (2026-07-11, CivicBid canonical bridge integration) is preserved at commit `7d620ff` (`git show 7d620ff:docs/HANDOVER.md`).

## Current State

- Repo: `yazilimlar/artemis-omni`
- Canonical branch: `main` (GitHub default branch: `main`)
- `main` at session start: `e2b833df76e7e41af325428b62a9d28e05b1e1a1` (PR #67)
- Work branch: `governance/registry-sync-2026-10`
- Production deployment state: **not verified in this session**. The last recorded verification is PR #12 (2026-07-11): Vercel READY on `artemis.agoraxai.com`.

## Session Ownership

- Division: core-platform (platform-governance)
- Product: none (governance)
- Lifecycle: governance · Maturity: n/a
- Visibility: internal_operations · Data mode: mixed_explicit
- Change type: governance
- Governing ADRs: ADR-005, ADR-006
- Source inventory: `docs/history/phase-1-inventory-proposal.md` (PR #67)

## Merged Since the Previous Handover (#13 → #68)

| Concern | PRs |
|---|---|
| CivicBid | #13 canonical bridge integration · #16 The Bid Room v2.1 · #18 deadline-sanity hotfix |
| LEVARA L28 / Artemis Nomad | #20 · #21 · #22 |
| Prime Industrial ERP | #23 public MVP · #58 controlled access route · #59 persistent backend prep |
| BidRoom suite | #24 Exemplary Contractor · #25 AtlasIQ · #26 route fix · #27 Evidence Engine V1 · #28 color fix · #29 switchboard |
| Geometric Workbench | #33 · #34 · #35 · #36 · #37 · #38 · #39 · #40 · #41 · #43 |
| Pınar Evleri | #45 · #46 · #47 · #48 · #49 · #50 · #51 |
| Anastasia Fantasia | #60 · #61 |
| Governance | #63 · #64 · #65 · #66 · #67 Phase 1 inventory · #68 Sala Rotonda noindex |

## Open Pull Requests

- #19 CivicBid: Bid Room public visibility and release safety
- #30 Pilot request owner notifications (touches `/api/pilot-requests`; see C15)
- #31 Artemis 2 foundation workspace
- #32 Vercel Speed Insights
- #42, #44 Geometric Workbench
- #52 Pınar Evleri Manager Operations MVP
- #53 Rainbow Botanics Atlas v10
- #54, #55, #56 DayOS v0.9.8a/b/c
- #62 Anastasia editorial chapters

Closed without merge: #57.

## Registry State After This PR

- `ENGINEERING/PRODUCT_REGISTRY.yaml` now has entries for: bidroom-suite, bidroom-exemplary-contractor, artemis-nomad, diana-moonshot, anastasia-fantasia-demo, dayos, pinar-evleri, prime-industrial-erp, geometric-workbench, sala-rotonda.
- Every new entry keeps division, family, lifecycle and maturity as `UNREVIEWED`. Owner classifications are recorded as comments.
- `civicbid`: PR #13 recorded as merged; `active_integration_branch` cleared; lifecycle still `rescue`.
- `artemis-evolution-console`: comment added; link to `/evolution` remains UNREVIEWED.
- Proposed schema fields are listed in the file header and **not** applied.
- `DIVISION_REGISTRY.yaml`, `TESTBED_MIGRATION_REGISTRY.yaml` and `PROJECT_GENOME.yaml` are unchanged.

## Known Unregistered Surfaces (not added; see inventory Table A)

- Division-level routes without a product entry: utility-intelligence-bridge (index, 3d-model, dual-story), george-aegean-quest, developmentandtest/kings-highway, developmentandtest/troy-time-atlas, finance-architecture-5d, artemis-tax-efficacy-alpha, rainbow-house-botanical, academy, library, insights, tools
- No evidence of ownership: geodesic-intelligence, Meander/Auremeander static assets
- Marketing product pages: /products/connect, /construct, /docs, /flow, /twin-atlas (C10)
- Site shell routes (/, /about, /solutions, /for, /case-studies, …)
- `/api/pilot-requests` (C15)

## Known Risks

- C9: Sala Rotonda iframes external content; noindex applied (#68), ADR pending.
- C12: `/labs/rainbow-house-botanical` and possibly `/rainbowbotanics` are indexable while Rainbow Botanics is registered noindex.
- C15: `/api/pilot-requests` has no owner and may handle personal data; PR #30 open.
- C7 / C8: duplicate surfaces and a shadow `src/app/` directory.
- U1: Great Order organizational relationship is unrecorded in governance.
- C14: many remote branches use prefixes outside the approved branch classes.
- CivicBid: Socrata schema-drift monitoring and automated integration tests remain production gates (see `ENGINEERING/FEATURE_PASSPORTS/CIVICBID_LIVE_COCKPIT_V1.md`).

## Verification (this session)

- Only `ENGINEERING/PRODUCT_REGISTRY.yaml` and `docs/HANDOVER.md` changed.
- `PRODUCT_REGISTRY.yaml` parsed successfully as YAML.
- No code or route changed, so typecheck, lint and build are not affected.

## Next Recommended Tasks

1. Sala Rotonda follow-up ADR (C9).
2. Client-work classification ADR (C13).
3. Great Order organizational relationship ADR (U1).
4. BidRoom registry review: division, family, canonical route (C10).
5. Prime ERP registry review after data boundary and Great Order are resolved.
6. Workbench consolidation: resolve duplicate code locations.
7. CivicBid: record the deployed-route review and decide on `rescue` → `active_lab`.
