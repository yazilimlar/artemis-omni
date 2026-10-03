# Handover: Session 2026-10-01 — Governance: Phase 1 inventory and registry sync

Standardized, parse-friendly handover. Historical states remain available through Git, pull requests, issues, and dated files under `docs/evolution/` and `docs/history/`. The previous handover (2026-07-11, CivicBid canonical bridge integration) is preserved at commit `7d620ff` (`git show 7d620ff:docs/HANDOVER.md`).

## 2026-10-03 update — DayOS v0.9.8a rebased (PR #54, stack part 1 of 3)

- Branch: `feature/dayos-v098a-spatial-intelligence`, rebased onto `main` (core-platform, dayos, active_lab, noindex_review, product-specific). The owner merges from `~/Projects/artemis-admin`.
- `/dayos-v098a` is now `noindex` through a new `layout.tsx` (the page is a client component). It is not in the sitemap or navigation.
- Removed the dead duplicate `src/app/dayos-v098a/page.tsx` (C8); nothing imported it. `src/dayos/` stays: the `app/` page imports it.
- Registry `dayos`: `lifecycle: active_lab`, `visibility: noindex_review` (owner decision), `canonical_route: /dayos-v098a`, `canonical_branch: main`. Maturity, data mode, division and family are still UNREVIEWED.
- Remaining item: the page loads Leaflet from unpkg at runtime. Acceptable under noindex_review; it must be self-hosted or pinned with SRI before any public_safe_demo upgrade.
- Next: #55 (telemetry; Open-Meteo runtime fetch), then #56.

## 2026-10-03 update — Evolution Archive visualization layer

- Branch: `feat/evolution-visualization` (core-platform, artemis-evolution-archive, active_lab, internal_operations, live_derived). Draft PR; builds on ADR-018, PRs #99-#102.
- `/evolution` now shows stats, a GSAP scroll timeline, an ADR lineage graph and a registry-flow area chart (Observable Plot), and a 3D architecture map. The earlier structure record moved unchanged to `components/evolution/StructureRecord.tsx` at the bottom of the page.
- New scene `evolution-architecture-map` is registered in `data/scene-registry.json` (internal_operations) so the 3D map stays inside the ADR-015 island; MathBox is not used.
- New dependencies: `gsap` (standard "no charge" license) and `@observablehq/plot` (ISC, depends on d3).
- New route `/api/evolution-data` (auth, 404 otherwise, `no-store`).
- Not verified: a signed-in browser render of `/evolution` (needs the allowlist and a session).
- Next recommended task: browser QA of the page; decide the public home of the structure record.

## 2026-10-02 update — Evolution Archive extraction pipeline

- Branch: `feat/evolution-extraction` (core-platform, site-shell, active_lab, internal_operations, live_derived). Draft PR; builds what ADR-018 (PR #99, merged) authorizes.
- Added: `scripts/extract-evolution.mjs`, generated `data/evolution.json`, `.github/workflows/evolution-update.yml` (bot branch + PR, never pushes to main), `tests/unit/evolution-extraction.test.ts`.
- `/evolution` is now noindex and behind `requireAuth()`, removed from the sitemap. Its existing content is kept; no UI rebuild (Session 3).
- Registry: the existing `artemis-evolution-console` entry was updated in place (no duplicate): core-platform, platform-governance, active_lab, internal_operations, live_derived, canonical route `/evolution`.
- Owner setup: enable "Allow GitHub Actions to create and approve pull requests" for the bot PR to open.
- Next recommended task: Session 3 visualization layer (timeline, supersession graph, flow, matrix).

## 2026-10-02 update — ADR-018 (Evolution Archive) proposed

- Branch: `governance/adr-018-evolution-archive` (core-platform, site-shell, governance, internal_operations). Draft PR; ADR-018 takes effect on merge.
- ADR-018 authorizes a generated archive at `/evolution` (`data/evolution.json`, `scripts/extract-evolution.mjs`) and fixes the v1 visualization stack and approved dependencies.
- The `/evolution` route will be reclassified from UNREVIEWED to internal_operations and noindex. Today it is a public, indexable page listed in the sitemap; that change, the fate of `/api/public/artemis-structure`, and the registry entry are implementation-PR work.
- Not changed: no code, no dependencies, no `data/evolution.json`, no route or registry changes.
- Next recommended task: implementation PR (extractor + data file + route reclassification), then the visuals one at a time.

## 2026-10-02 update — corrections to stale facts

Full acceptance state: see docs/VERIFICATION.md

- Branch for this record: `governance/verification-and-design-language` (governance, core-platform, site-shell, internal_operations, mixed_explicit).
- Scenes: the "1 scene (`hello-orb`)" line in the M1–M7 closure below is stale. `data/scene-registry.json` now registers 4 scenes: hello-orb, spatial-proof-surface, botanical-garden, site-hero.
- Auth and proposals: "M3 magic-link email delivery not yet verified" and "M5 live end-to-end test deferred" are closed. The owner verified both on 2026-10-02 (PR #97 opened from /control/propose).
- Since the closure record: ADR-016 and the homepage hero scene (#93), standalone lab sandboxing and CDN pins (#94), role-aware AGENTS.md (#95), and the homepage video section and /integrate page (#96) are merged.
- New: ADR-017 (contextual design language) is accepted. The `native_visuals` registry field is proposed only; a follow-up registry PR applies it.
- Not changed in this update: no code, no schema, no registry YAML. Everything below is preserved as history.

## Session 2026-10-01 21:45 — M1–M7 programme closure

- State at closure: `main` @ `ed955e9` (PR #86). PRs #66–#86 are all merged.
- Branch for this record: `governance/handover-m1-m7`. The sections below this one are earlier same-day records, kept as history; their "current state" lines are superseded by this section.

### What shipped
- M0: governance foundation:
  - CLAUDE.md pointer (PR #66);
  - Phase 1 inventory (PR #67);
  - Sala Rotonda noindex (PR #68);
  - registry sync (PR #69);
  - governance backlog (`docs/history/governance-backlog.md`).
- M1: /labs reads PRODUCT_REGISTRY.yaml (PR #70)
- M2: /control and /system-map (PR #71)
- M3: magic-link auth with allowlist (PR #76, ADR-011 via PR #75)
- M4: per-user profiles and roles, /dashboard per role (PR #78, ADR-012 via PR #77)
- M5: /control/propose opens GitHub PRs (PR #80, ADR-013 via PR #79)
- M6: sandboxed HTML execution with audit log (PR #83, ADR-014 via PR #81)
- M7: /labs/scenes/[id] immersive layer (PR #86, ADR-015 via PR #84; supersedes ADR-002)
- Governance:
  - ADRs:
    - ADR-007 through ADR-010 (PR #72)
    - ADR-011 (PR #75)
    - ADR-012 (PR #77)
    - ADR-013 (PR #79)
    - ADR-014 (PR #81)
    - ADR-015 (PR #84)
  - registry refinement (PR #73);
  - route noindex and division families alignment (PR #74);
  - docs (PRs #82, #85).
- Registries: 20 products, 7 divisions, 1 scene (`hello-orb`), 0 sandbox artifacts.
- CI: `governance-check.yml` moved from Node 20 to Node 22 (this PR; Vercel deprecated Node 20 on 2026-10-01).

### Known open items (backlog)
- M5 live end-to-end test deferred
- M3 magic-link email delivery not yet verified end to end (it blocks the M5 live test and the signed-in paths of M4–M6)
- Standalone labs load CDN Three.js and run same-origin (security follow-up)
- ~~Vercel Node 20 deprecation — bump CI to Node 22 or 24~~ (done in this PR: CI on Node 22)
- Component fallbacks for scenes (ADR-015 future)
- Drei installed but unused (useGLTF/Text need self-hosted DRACO/font)
- /login error and success messages render simultaneously
- ADR-008 bucket naming: client_or_owner_related vs client_or_partner_work
- BidRoom canonical URL (`/products/bidroom/contractor` vs `/labs/bidroom-exemplary-contractor`)
- `src/app/labs/bidroom-atlasiq` is live code imported by three routes (ADR-010 archive needs a move first)
- prime-industrial-erp still lists the `great_order_relationship_requires_adr` blocker after ADR-009

### Owner setup still required for M6
- `ARTEMIS_IP_SALT` in Vercel and `.env.local`
- The `execution_logs` migration applied

These are needed before any sandbox artifact is registered.

### Next recommended work
- Standalone-lab dispositions (sandbox or accept risk)
- Add a second real scene
- Migrate /labs/scenes/hello-orb to a real deliverable or remove

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

## Session 2026-10-01 — ADR batch 2026-10

- Branch: `governance/adr-batch-2026-10` (from `main` @ `6a5ad66`)
- Division: core-platform · Product: none (governance) · Visibility: internal_operations · Data mode: mixed_explicit · Change type: governance
- Files: `decisions/ADR-007-sala-rotonda.md`, `decisions/ADR-008-client-work.md`, `decisions/ADR-009-great-order.md`, `decisions/ADR-010-bidroom-registry.md`, `decisions/ADR-INDEX.md`, `docs/HANDOVER.md`
- Closes PR #67 items: C9 (Sala Rotonda), C13 (client work), U1 (Great Order), C10/C8 (BidRoom).
- Not changed: no code, no routes, no registry YAML. The ADRs decide values that the registry does not record yet:
  - ownership bucket and `operator` fields;
  - BidRoom division, family and lifecycle `rescue` (the registry currently says `UNREVIEWED`).
- Open items:
  - mapping Pınar Evleri's `client_or_owner_related` to `client_or_partner_work`;
  - where signed relationship records are stored;
  - whether `bidroom-exemplary-contractor` joins the `bidroom` family.

### Next recommended tasks

1. Registry refinement (governance):
   - apply ADR-008/009/010 values;
   - record visibility and canonical routes for hidden products;
   - resolve `artemis-labs` (incubation vs division) for `artemisix19`.
2. M3: auth for `/control` and `/system-map`.

## Session 2026-10-01: ADR-014 (sandboxed artifact execution)

- Branch: `governance/adr-014-sandboxed-execution` (from `main` @ `87789f3`)
- Division: core-platform · Product: site-shell · Change type: governance · Visibility: internal_operations
- Files: `decisions/ADR-014-sandboxed-artifact-execution.md`, `decisions/ADR-INDEX.md`, `docs/HANDOVER.md`
- Not changed: no code, no routes, no registries.
- Facts recorded in ADR-014:
  - no existing iframe uses `sandbox`;
  - Supabase session cookies are JS-readable (`httpOnly: false`);
  - `public/` files bypass route-handler headers.
- Known risk: existing standalone labs run same-origin and can read the session cookie. A per-lab disposition is a follow-up.

### Next recommended task

M6 implementation:
- `sandbox/<id>/` sources and `data/artifact-registry.json`;
- `/api/sandbox/[id]` with strict CSP including `sandbox allow-scripts`;
- `/labs/run/[id]`;
- an `execution_logs` migration with a `security definer` logging and rate-limit function;
- the `/control` artifact list.

## Session 2026-10-01: ADR-015 (immersive 3D layer)

- Branch: `governance/adr-015-immersive-layer` (from `main` @ `9de52be`)
- Division: studio-media (cross-division: core-platform rendering island) · Product: site-shell · Change type: governance
- Files: `decisions/ADR-015-immersive-layer.md`, `decisions/ADR-INDEX.md` (ADR-015 row; ADR-002 row marked superseded), `docs/HANDOVER.md`
- Not changed: no code, no dependencies, no registries.
- Facts recorded:
  - ADR-002 Phase 1 exists in `components/cinematic/` but no route mounts it;
  - the R3F path was never built;
  - `public/models` and `public/textures` are empty;
  - the standalone labs load Three.js from third-party CDNs at mixed versions;
  - `app/labs/[slug]` occupies the `/labs` dynamic segment, so scenes use `/labs/scenes/[id]`.
- Known risk (ADR-014 track): CDN-loaded Three.js in same-origin standalone labs.

### Next recommended task

M7 implementation:
- dependencies (fiber, drei, three);
- `data/scene-registry.json` and `scripts/validate-scenes.ts` wired into CI and the build;
- the island with runtime fallbacks;
- `/labs/scenes/[id]`;
- a synthetic first scene with a passport;
- self-hosted DRACO decoder and font.
