# Phase 1 Inventory Proposal

- **Status:** DRAFT. A proposal for review, not authority. Registries remain authoritative until a governance PR changes them.
- **Date:** 2026-10-01
- **Repo:** `yazilimlar/artemis-omni`
- **Base commit:** `6424515378c798bbc129c116e3865bd6e6455e53` (`main`, PR #66)
- **Branch:** `governance/phase-1-inventory`
- **Session type:** governance write session (single file). It follows a read-only inventory session.
- **Division / product:** core-platform (platform-governance) / none
- **Lifecycle / maturity:** governance / n/a
- **Visibility / data mode:** internal_operations / mixed_explicit
- **Governing ADRs:** ADR-005, ADR-006

## How to read this document

- **Confidence:** A = verified by the repository, B = consistent with the repository, C = inference, D = speculation.
- **UNREVIEWED** means there is no matching entry in `DIVISION_REGISTRY.yaml` or `PRODUCT_REGISTRY.yaml`, and no owner decision resolves it. Divisions written as "candidate" are suggestions, not classifications.
- **"Observed" visibility** means what the code does. `app/robots.ts` allows `/` site-wide, so any route without a page-level `noIndex` flag is effectively public and indexed. This is a fact about the code, not a governance classification.
- **Data-mode notes marked "string found"** come from a keyword grep of the page source, not a verification of what the page shows.
- **"Owner:"** marks a classification taken from the owner decisions below.

---

## Owner decisions (recorded verbatim)

### Sala Rotonda (C9)

- Action: add noindex metadata to the route, keep the route, do not change iframe target, do not delete. Flag for owner review in a follow-up ADR.
- Rationale: reversible risk reduction; preserves evidence; unblocks this session.

> Implementation note: this PR is limited to writing this document. It does **not** add the noindex metadata, because route changes are out of scope for this session. The decision is recorded here and still needs its own change. See next task (b).

### Brand classifications (Table B)

- Pınar Evleri: bucket=client_or_owner_related, data_boundary=to_be_confirmed, publication=public, confidence=B
- LEVARA L28: bucket=internal_asset, subclass=reference_demo, current_name="Artemis Nomad", external_brand_referenced="Levara (manufacturer)", data_boundary=artemis_owned, publication=public, confidence=B
- Exemplary Contractor: bucket=internal_asset, subclass=placeholder_persona, data_boundary=artemis_owned, publication=public, confidence=B
- Prime Industrial ERP: bucket=internal_product, operator=great_order, end_customer=external, data_boundary=to_be_confirmed, publication=mixed, confidence=B
- Diana Moonshot: bucket=internal_asset, subclass=demo, data_boundary=artemis_owned, publication=public, confidence=A
- Anastasia Fantasia: bucket=internal_asset, subclass=personal_demo, data_boundary=artemis_owned, publication=noindex, confidence=A (note: personal project, not client work)
- DayOS: bucket=internal_product, distribution=tbd_public_app_or_skill_or_connector_or_open_repo, data_boundary=artemis_owned, publication=public, confidence=B

### Classification rules applied

- Any item with `data_boundary=to_be_confirmed` stays **UNREVIEWED**. This applies to Pınar Evleri and Prime Industrial ERP.
- Owner buckets assign ownership type, **not** a division. No division was assigned to any brand item.
- `personal_demo`, `placeholder_persona`, `reference_demo` and `demo` are subclasses, not new buckets.

---

## Table A — Routes under `app/`

### A1. Registered products (match `PRODUCT_REGISTRY.yaml`)

| route_path | proposed_division | proposed_product | lifecycle_state | visibility_class | data_mode | confidence | notes |
|---|---|---|---|---|---|---|---|
| `/labs/civicbid-intelligence-bridge` | infrastructure-construction | civicbid | rescue | public | mixed_explicit | A | PRODUCT_REGISTRY `civicbid.canonical_route`. The page also contains a synthetic scenario lab. |
| `/labs/civicbid-signal-forge` | infrastructure-construction | civicbid (review route) | rescue | noindex_review (noindex verified) | mixed_explicit | A | `civicbid.review_route`. Page title is "The Bid Room v2.1". |
| `/api/civicbid/signal-forge` | infrastructure-construction | civicbid (API) | rescue | public API | live_official / sample_fallback / source_unavailable | A | `civicbid.api_route`. HANDOVER documents the three modes. |
| `/labs/construction-intelligence-workbench` | infrastructure-construction | construction-intelligence | active_lab | public_safe_demo | synthetic | A | Registry entry matches. |
| `/labs/utility-intelligence-bridge/field-claims` | infrastructure-construction | utility-field-claims | active_lab | public_safe_demo | synthetic | A | Registry entry matches. |
| `/labs/artemisix19` | artemis-labs (incubation) | artemisix19 | testbed | public_safe_demo | synthetic | A | TESTBED registry `legacy-testbed-page` = `retain_as_test_fixture`. See C5. |
| `/labs/troy-time-atlas` | atlas-places | time-atlas-troy | active_lab | public | mixed_explicit | A | Registry entry matches. |
| `/labs/turkiye-atlas` | atlas-places | turkiye-atlas | active_lab | public | mixed_explicit | A | Registry entry matches. Map token restriction is still an open gate. |
| `/labs/tax-architecture-2026` | finance-decision-systems | tax-architecture-2026 | active_lab | public_safe_demo | synthetic | A | Registry entry matches. Educational only. |
| `/rainbowbotanics/[slug]` | natural-systems | rainbow-botanics | noindex_draft | noindex_review (noindex verified in `components/rainbow/RainbowSpecimenPage.tsx`) | sample | A | Covers the registry canonical `/rainbowbotanics/hemerocallis-fulva`. |

### A2. Division-level matches (division known, product unregistered)

| route_path | proposed_division | proposed_product | lifecycle_state | visibility_class | data_mode | confidence | notes |
|---|---|---|---|---|---|---|---|
| `/labs/utility-intelligence-bridge` | infrastructure-construction | UNREVIEWED (family utility-intelligence) | unknown | public (observed) | unknown | B | Listed in DIVISION_REGISTRY `public_routes`. No product entry. |
| `/labs/utility-intelligence-bridge/3d-model` | infrastructure-construction | UNREVIEWED (utility-intelligence) | unknown | public (observed) | synthetic (string found) | C | Not in the registry. |
| `/labs/utility-intelligence-bridge/dual-story` | infrastructure-construction | UNREVIEWED (utility-intelligence) | unknown | public (observed) | synthetic (string found) | C | Not in the registry. Iframe/HTML lab. |
| `/labs/[slug]/[...path]` | infrastructure-construction | duplicate of 3d-model | unknown | public (observed) | synthetic | A | A "recovery" catch-all that only re-renders 3d-model. See C7. |
| `/labs/george-aegean-quest` | atlas-places | UNREVIEWED | unknown | public (observed) | unknown | B | Listed in DIVISION_REGISTRY `public_routes`. Milestone file in `docs/history/`. No product entry. |
| `/labs/developmentandtest/troy-time-atlas` | atlas-places | time-atlas-troy (second surface) | unknown | public (observed) | unknown | B | "v2.1 · Dev & Test" copy. Conflicts with the one-canonical-implementation rule. See C7. |
| `/labs/developmentandtest/kings-highway` | atlas-places (candidate) | UNREVIEWED | unknown | public (observed) | unknown | C | "Artemis Atlas — King's Highway" standalone HTML. |
| `/labs/finance-architecture-5d` | finance-decision-systems (candidate) | UNREVIEWED (family tax-architecture?) | unknown | public (observed) | unknown | C | "Tax Lab (Preview)". May overlap tax-architecture-2026. |
| `/labs/artemis-tax-efficacy-alpha` | finance-decision-systems (candidate) | UNREVIEWED | unknown | public (observed) | unknown | C | "Tax Atlas (Alpha) — 5D Owner/Operator Tax & Cashflow Simulator". Cashflow is also an infrastructure-construction family. |
| `/labs/rainbow-house-botanical` | natural-systems (candidate) | UNREVIEWED (rainbow-botanics family?) | unknown | public (observed) | synthetic (string found) | C | Indexable, while the registered Rainbow product is noindex. See C12. |
| `/rainbowbotanics` | natural-systems | rainbow-botanics (index) | noindex_draft? | public (observed, no noindex found) | unknown | B | Index page may expose a noindex product. See C12. |
| `/rainbowbotanics-2026/[slug]` | natural-systems | rainbow-botanics (legacy redirect) | n/a | redirect | n/a | A | Redirects to `/rainbowbotanics/[slug]`. |
| `/academy`, `/academy/[slug]` | knowledge-academy | UNREVIEWED (family academy) | unknown | public | content (MDX) | B | `/academy` is in DIVISION_REGISTRY `public_routes`. ADR-003. One MDX: `5d-cost-control`. |
| `/library`, `/library/programs` | knowledge-academy | UNREVIEWED | unknown | public (observed) | `/programs` has "synthetic" string | B | `/library` is in DIVISION_REGISTRY `public_routes`. |
| `/insights` | knowledge-academy | UNREVIEWED | unknown | public (observed) | "synthetic" string found | B | In DIVISION_REGISTRY `public_routes`. Titled "AI Insight & Publication Engine". |
| `/tools`, `/tools/fuel-price-adjustment` | infrastructure-construction (candidate) | UNREVIEWED | unknown | public (observed) | "illustrative" string found | C | Fuel price adjustment is a construction cost mechanism. Related case study `content/case-studies/fuel-adjustment-automation.mdx`. |

### A3. Brand-owned routes (owner bucket recorded; no division assigned)

| route_path | proposed_division | proposed_product | lifecycle_state | visibility_class | data_mode | confidence | notes |
|---|---|---|---|---|---|---|---|
| `/labs/levara-l28-financial-twin`, `/labs/levara-l28-success-gate-immersive` | not assigned | Owner: internal_asset / reference_demo ("Artemis Nomad") | unknown | public (owner: publication=public) | unknown | B (owner) | External brand referenced: Levara (manufacturer). data_boundary=artemis_owned. Not in PRODUCT_REGISTRY. |
| `/labs/bidroom-exemplary-contractor` | not assigned | Owner: internal_asset / placeholder_persona | unknown | public (owner: publication=public) | unknown | B (owner) | Not a real client. data_boundary=artemis_owned. Sits inside the unregistered BidRoom surface (see A4). |
| `/labs/diana-moonshot` | not assigned | Owner: internal_asset / demo | unknown | public (owner: publication=public) | "synthetic" string found | A (owner) | data_boundary=artemis_owned. Not in PRODUCT_REGISTRY. |
| `/apps/anastasia-fantasia-demo` | not assigned | Owner: internal_asset / personal_demo | demo | noindex (verified; matches owner publication=noindex) | "mock" string found | A (owner) | Personal project, not client work. data_boundary=artemis_owned. |
| `/pinarevleri` | **UNREVIEWED** | **UNREVIEWED** (owner bucket: client_or_owner_related) | unknown | public (observed; owner publication=public) | live external links (Airbnb, Google, YouTube) | B (owner) | Stays UNREVIEWED because data_boundary=to_be_confirmed. See C13. |
| `/labs/prime-erp`, `/apps/prime-erp`, `/erp` | **UNREVIEWED** | **UNREVIEWED** (owner bucket: internal_product, Prime Industrial ERP) | unknown | mixed (owner); `/labs/prime-erp` noindex verified, others public (observed) | `/erp` has "synthetic" string | B (owner) | Stays UNREVIEWED because data_boundary=to_be_confirmed. Operator: great_order; end customer: external. Backend `services/prime-erp`. See C7 and U1. |

### A4. Unregistered with no owner decision (UNREVIEWED)

| route_path | proposed_division | proposed_product | lifecycle_state | visibility_class | data_mode | confidence | notes |
|---|---|---|---|---|---|---|---|
| `/departments`, `/departments/art/sala-rotonda` | UNREVIEWED | UNREVIEWED ("Octavian Rotunda / Artemis Art") | unknown | public (observed). Owner decision: add noindex (not yet applied) | external | C | Iframes an external `*.chatgpt.site` URL. "departments/art" is outside the division model. See C9. |
| `/evolution` | UNREVIEWED (candidate knowledge-academy) | possibly artemis-evolution-console | registry: concept | public (observed) | unknown | C | Registry says `canonical_route: null`, `noindex_review`. See C6. |
| `/api/public/artemis-structure` | UNREVIEWED | likely evolution/structure | unknown | public API | unknown | C | Remote branch `product/public-evolution-structure-v1`. |
| `/labs/bidroom-atlasiq` | UNREVIEWED (candidate infrastructure-construction) | BidRoom (not registered) | unknown | public (observed) | unknown | C | `docs/atlasiq/EVIDENCE_ENGINE_V1.md`. Shadow copy in `src/app/` (C8). |
| `/labs/bidroom-verity` | UNREVIEWED (candidate infrastructure-construction) | BidRoom | unknown | noindex (verified) | "illustrative" string found | C | `docs/verity/DECISION_LEDGER.md`. |
| `/products/bidroom` and `/atlasiq`, `/contractor`, `/evidence-engine`, `/live`, `/switchboard` | UNREVIEWED (candidate infrastructure-construction) | BidRoom suite | unknown | public (observed) | unknown | C | "CivicBid + BidRoom Switchboard". Feature passport `CIVICBID_BID_ROOM_V2_1_UI.md` links the two. |
| `/products/connect`, `/construct`, `/docs`, `/flow`, `/twin-atlas` | UNREVIEWED | marketing "products" not in PRODUCT_REGISTRY | unknown | public (observed) | unknown | C | Driven by a code-level product list. See C10. |
| `/labs/geodesic-intelligence` | UNREVIEWED | — | unknown | public (observed) | "synthetic" string found | D | No registry, docs or branch evidence found. |
| `/labs/geometric-workbench/v5-8`, `/workbench`, `/workbench/app` | UNREVIEWED (candidate core-platform / visualization or studio-media) | Geometric Workbench | unknown | public (observed) | unknown | C | Also `artemis-workbench/`, `workbench-foundation/`, `archive/workbench`, `reference/geometric-workbench`. See next task (g). |
| `/labs` (index) | artemis-labs | Labs index | n/a | public | "synthetic" string found | B | Page title reads "ARTEMIS Geometric Workbench". See C11. |
| `/labs/[slug]` (MDX) | UNREVIEWED | `cost-curve-webgl-demo` | unknown | public | content | C | ADR-003 content route. |
| `/`, `/about`, `/contact`, `/demo`, `/portfolio`, `/solutions` (+ `ai-business-systems`, `construction-intelligence`, `engineering-visualization`), `/products` (index), `/case-studies`, `/case-studies/[slug]`, `/for/[slug]` | UNREVIEWED (candidate core-platform site shell) | not products | n/a | public | `/` has "synthetic" string | B | SYSTEM_INDEX lists most of these as "key public surfaces". `core-platform.public_routes: []`. |
| `/api/pilot-requests` | UNREVIEWED | pilot intake | unknown | public API | user-submitted (PII?) | C | Branch `feature/pilot-intake-notifications`. Needs ADR-004 review (C15). |
| `/favicon.ico` (route) | — | platform asset | n/a | n/a | n/a | A | Not a product. |

---

## Table B — Client and brand work visible in the repo

| name | source_paths_or_branches | proposed_division | owner_classification | lifecycle_state | visibility_class | confidence | notes |
|---|---|---|---|---|---|---|---|
| Pınar Evleri | `app/pinarevleri`, `components/pinarevleri/`, `lib/pinarevleri/`, `public/images/pinarevleri/`; branches `feat/pinar-evleri-*` (7), `feature/pinarevleri-manager-mvp` | **UNREVIEWED** | client_or_owner_related; data_boundary=to_be_confirmed | unknown | public | B (owner) | Stays UNREVIEWED until the data boundary is confirmed. |
| LEVARA L28 / "Artemis Nomad" | `app/labs/levara-l28-*`, `public/standalone/levara-l28-*`; branches `feature/levara-*` (4), `hotfix/levara-loader-runtime`, `release/levara-uploaded-artifacts-public` | not assigned | internal_asset / reference_demo; external_brand_referenced=Levara (manufacturer); data_boundary=artemis_owned | unknown | public | B (owner) | Route names still say "levara". Current name is "Artemis Nomad". |
| Exemplary Contractor | `app/labs/bidroom-exemplary-contractor`; branch `feature/bidroom-exemplary-contractor` | not assigned | internal_asset / placeholder_persona; data_boundary=artemis_owned | unknown | public | B (owner) | Placeholder persona, not a client. |
| Prime Industrial ERP | `app/erp`, `app/apps/prime-erp`, `app/labs/prime-erp`, `services/prime-erp`, `public/prime-erp`; branches `feature/prime-industrial-erp-mvp`, `prime-erp-access-route`, `prime-erp-persistent-backend` | **UNREVIEWED** | internal_product; operator=great_order; end_customer=external; data_boundary=to_be_confirmed | unknown | mixed | B (owner) | Stays UNREVIEWED. Persistent backend, so ADR-004 applies. See U1. |
| Diana Moonshot | `app/labs/diana-moonshot` | not assigned | internal_asset / demo; data_boundary=artemis_owned | unknown | public | A (owner) | |
| Anastasia Fantasia | `app/apps/anastasia-fantasia-demo`; branches `demo/anastasia-*` (3) | not assigned | internal_asset / personal_demo; data_boundary=artemis_owned | demo | noindex | A (owner) | Personal project, not client work. |
| DayOS | `public/dayos*` (4 asset versions); branches `feature/dayos-*` (5) | not assigned | internal_product; distribution=tbd_public_app_or_skill_or_connector_or_open_repo; data_boundary=artemis_owned | unknown | public | B (owner) | No `app/` route found. Static assets under `/public` are directly reachable. |
| BidRoom suite (AtlasIQ, Verity, Live, Evidence Engine, Switchboard, Contractor) | `app/products/bidroom/*`, `app/labs/bidroom-*`, `src/app/labs/bidroom-atlasiq`, `docs/atlasiq`, `docs/verity`; branches `codex/bidroom-*`, `feature/bidroom-atlasiq`, `fix/bidroom-atlasiq-route`, `fix/atlasiq-color-isolation`, `labs/bidroom-verity`, `feature/atlasiq-evidence-engine-v1` | UNREVIEWED (candidate infrastructure-construction) | no owner decision | unknown | public + noindex | C | Largest unregistered product surface. Next task (e). |
| Sala Rotonda / Octavian Rotunda ("Artemis Art") | `app/departments/art/sala-rotonda` (external iframe) | UNREVIEWED | no owner classification; owner decision: noindex, keep, ADR | unknown | public (noindex pending) | C | See C9. |
| Geometric Workbench | `app/workbench*`, `app/labs/geometric-workbench`, `artemis-workbench/`, `workbench-foundation/`, `archive/workbench`, `reference/geometric-workbench`, `public/labs/geometric-workbench`; workbench branches | UNREVIEWED (candidate core-platform / visualization) | no owner decision | unknown | public | C | Next task (g). |
| Rainbow House / PrismaFlora | `app/labs/rainbow-house-botanical`, `public/labs/rainbow-house-*.html`, `docs/rainbow-standards/`; branches `feature/rainbow-botanics-prismaflora-*`, `product/rainbow-botanics-atlas-v10` | natural-systems | rainbow-botanics (registry) | noindex_draft (registry) | mixed: one route indexable | B | Registry covers only `/rainbowbotanics/*`. See C12. |
| Meander / Auremeander | `public/labs/artemis-meander*`, `public/labs/auremeander` | UNREVIEWED | no owner decision | unknown | public static | D | No route or registry entry. |
| Release-control dashboard | branch `ops/release-control-dashboard` | UNREVIEWED (candidate core-platform) | no owner decision | unknown | must be internal_operations | C | Branch only. Rule: no release controls on public routes. |

---

## Table C — Anomalies and conflicts

| # | item | issue | evidence | recommended_resolution |
|---|---|---|---|---|
| C1 | Registries and handover are stale | `PRODUCT_REGISTRY.yaml` and `docs/HANDOVER.md` were last touched 2026-07-11. About 50 PRs have merged since (#14 → #66). HANDOVER still describes PR #13 as pending. | `git log` on both files; merge log | Next task (a). |
| C2 | Start sequence disagrees across docs | CLAUDE.md puts `PROJECT_GENOME.yaml` first and leaves out `SYSTEM_INDEX.md`. Protocol §2 puts `SYSTEM_INDEX.md` first and leaves out the genome. AI_AGENT_RULES has a third ordering. | CLAUDE.md; protocol §2; AI_AGENT_RULES | Make one list canonical and have the others point to it. |
| C3 | Lifecycle vocabulary drift | CLAUDE.md and AI_AGENT_RULES use "draft, pilot". PRODUCT_REGISTRY uses `noindex_draft`, `private_pilot`, `retired`. "governance" (used in session declarations) is in neither list. | Files named | Add a lifecycle value for governance work, or define governance sessions as lifecycle-exempt. Align the spellings. |
| C4 | Authority-order drift | AI_AGENT_RULES has 8 tiers. PROJECT_GENOME and CLAUDE.md have 7. | Files named | Low risk. Align when next touched. |
| C5 | `artemis-labs` used as a division | `artemisix19.division: artemis-labs`, but DIVISION_REGISTRY defines it under `incubation`. | PRODUCT_REGISTRY; DIVISION_REGISTRY | Allow an incubation value in the product schema. |
| C6 | Evolution Console vs `/evolution` | Registry: concept, `canonical_route: null`, noindex_review, family `company-history` (not listed under knowledge-academy). `/evolution` and `/api/public/artemis-structure` exist and are indexable. | Files named; branch `product/public-evolution-structure-v1` | Decide whether `/evolution` is this product. If so, register its route, visibility and family. |
| C7 | Duplicate surfaces | Troy appears twice. Prime ERP has 3 routes. BidRoom AtlasIQ appears in labs, products and `src/app`. 3d-model has a recovery catch-all. | Table A | For each product, name one canonical route. Remove nothing in Phase 1. |
| C8 | Shadow `src/app/` directory | `src/app/labs/bidroom-atlasiq/*` exists alongside root `app/`. Next.js ignores `src/app` when `app/` exists. | `find src/app` | Confirm it's unused, then record it as `archive_after_evidence`. |
| C9 | Sala Rotonda | An indexable public route iframes an external `*.chatgpt.site` host. "departments/art" is outside the division model. | `app/departments/art/sala-rotonda/page.tsx` | **Owner decision recorded:** add noindex, keep the route, keep the iframe target, follow-up ADR. Not applied in this PR. Next task (b). |
| C10 | `/products/*` marketing pages and BidRoom | connect, construct, docs, flow, twin-atlas and the BidRoom suite present as products with no PRODUCT_REGISTRY entries. | `app/products/*` | Register or relabel. Next task (e). |
| C11 | Labs index title | `app/labs/page.tsx` metadata title is "ARTEMIS Geometric Workbench". | grep result | Verify. Likely a mislabel. |
| C12 | Rainbow visibility split | Registered product is noindex, but `/labs/rainbow-house-botanical` and possibly `/rainbowbotanics` are indexable. | Table A | Resolve publication blockers or add noindex. |
| C13 | Client and third-party brands in the repo | The owner classified seven brands. Pınar Evleri (client_or_owner_related) and Prime Industrial ERP (operator great_order, external end customer) still have unconfirmed data boundaries. No registry concept covers client work or operator relationships. | Owner decisions; Table B | Next task (c). |
| C14 | Branch-class drift | Many remotes use prefixes outside the approved classes (`codex/`, `claude/`, `demo/`, `feat/`, `fix/`, `hotfix/`, `hardening/`, `release/`, `ops/`, `test/`, `vercel/`, unprefixed `prime-erp-*`). | `git branch -r` | Record only. Branch cleanup is a separate concern (ADR-006). |
| C15 | `/api/pilot-requests` | Public intake endpoint, possibly handling PII and notifications, with no registry or division owner. | Route; branch `feature/pilot-intake-notifications` | ADR-004 security review. |
| C16 | CivicBid status unknown | Registry says `rescue` with an active integration branch for PR #13. Its merge state isn't recorded in governance. | PRODUCT_REGISTRY; HANDOVER | Resolve within next task (a). |
| C17 | LEVARA naming drift | Owner says the current name is "Artemis Nomad", but routes, assets and branches still use `levara-l28`. The external brand Levara (manufacturer) is referenced. | Owner decision; `app/labs/levara-l28-*` | Record only. Any rename is a separate route change. |

---

## Proposed registry additions (proposals only, not facts)

- A **BidRoom** product entry, or a family under infrastructure-construction / civicbid (next task e)
- A **Prime Industrial ERP** entry, after its data boundary and the Great Order relationship are resolved (next task f)
- A **Geometric Workbench** product with one canonical location (next task g)
- A **site-shell** family under core-platform for `/`, `/solutions`, `/for`, `/case-studies` and similar routes
- Registry entries for owner-classified internal assets and products (LEVARA / Artemis Nomad, Diana Moonshot, Anastasia Fantasia, DayOS, Exemplary Contractor), once a division is assigned to each

## Proposed schema additions for the next governance PR (record only, not applied)

- `subclass` — distinguishes demo variants within a bucket (for example `reference_demo`, `placeholder_persona`, `personal_demo`, `demo`)
- `external_brand_referenced` — names a third-party brand an artifact references without being owned by it (for example Levara for "Artemis Nomad")
- `operator` — the organization that runs the product (for example `great_order` for Prime Industrial ERP)
- `end_customer` — who the product ultimately serves (for example `external`)

---

## Unresolved unknowns

- **U1. Great Order organizational relationship.** "Great Order" (greatorder.org) is referenced as an organization. Prime Industrial is operated for Great Order and serves its client. This organizational fact is not present in `DIVISION_REGISTRY.yaml` or `PROJECT_GENOME.yaml`. Recorded, not resolved. A follow-up ADR is required (next task d).
- **U2.** Pınar Evleri data boundary (`to_be_confirmed`).
- **U3.** Prime Industrial ERP data boundary (`to_be_confirmed`).
- **U4.** Divisions for the owner-classified internal assets and products (none assigned).
- **U5.** DayOS distribution channel (`tbd_public_app_or_skill_or_connector_or_open_repo`).
- **U6.** Whether PR #13 merged, and CivicBid's current lifecycle.
- **U7.** Whether `/evolution` is the registered Evolution Console.
- **U8.** Sala Rotonda content and hosting (pending the ADR in next task b).
- **U9.** Geodesic Intelligence and Meander/Auremeander: no evidence found.
- **U10.** Verified data mode for most routes. The notes in this document come from keyword greps.
- **U11.** Whether the `/products/*` pages are intended as real products.

## Recommended next tasks (in order)

a. **Registry update PR (C1)** — highest priority. Sync `PRODUCT_REGISTRY.yaml` and `docs/HANDOVER.md` to current reality.
b. **Sala Rotonda follow-up ADR (C9).** Apply the owner's noindex decision in its own change.
c. **Client-work classification ADR (C13).**
d. **Great Order organizational relationship ADR (U1, new).**
e. **BidRoom registry entry (C10 and proposed additions).**
f. **Prime ERP registry entry.**
g. **Workbench consolidation.** Resolve the duplicate Workbench locations (`app/workbench*` / `app/labs/geometric-workbench`, `artemis-workbench/`, `workbench-foundation/`, `archive/workbench` / `reference/geometric-workbench`).

## Provenance

- Evidence: read-only inventory session on 2026-10-01 against `main` @ `6424515`. Sources: governance chain listed in `CLAUDE.md`, `ENGINEERING/SYSTEM_INDEX.md`, `app/robots.ts`, greps of `app/**/page.tsx` and `app/**/route.ts`, `git branch -r`, and `git log`.
- Owner decisions supplied in the write-session instructions on 2026-10-01.
- No registry, route, product code or `docs/HANDOVER.md` was changed in producing this file.
