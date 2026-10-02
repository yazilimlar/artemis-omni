# Site Quality Audit — 2026-10

Read-only audit of `main` @ `ea2032d`. No code was changed.

**Evidence base:**
- **Route scan:** a file-system scan of `app/` (87 route files: 78 pages and 9 handlers).
- **Production build:** `npm run build`, with 0 warnings.
- **HTTP crawl:** a crawl of `next start` on localhost.
  - Seeds: all static pages, sampled dynamic pages and `sitemap.xml`.
  - It follows every `<a href>` and `<iframe src>`.
  - Totals: 114 URLs fetched, 2,454 internal links and 45 external hrefs.
- **Static href scan:** a scan of `app/`, `components/`, `data/` and `lib/` that found 83 literal internal paths, each resolved over HTTP.
- **Registries:** canonical routes read from `ENGINEERING/PRODUCT_REGISTRY.yaml` and `DIVISION_REGISTRY.yaml`.

**Priorities:**
- **P0:** broken and user-facing.
- **P1:** misplaced or wrong.
- **P2:** polish.

**Limits:**
- There was no real browser, so client-side runtime errors are not covered.
- External links were not checked.
- Auth-gated pages were verified only as `307 → /login`.
- Production env-dependent behavior, such as the Prime ERP backend, was not verified.

## A. Route inventory

The table below has one row per route file. Counts:
- **Registered:** 23 match a registry route exactly.
- **Under a registered prefix:** 9.
- **Unregistered:** 55. Grouping and assessment are in F.

Notes on the table:
- Route handlers (`route.ts`) are not crawled; their row says "not probed".
- **Dynamic routes** were probed with a real parameter value, shown as "(as …)".
- **"Not reached"** means the URL is neither linked nor a seed with a known parameter.

| Route | Type | HTTP (local) | Metadata | Robots (rendered) | Registry | Notes |
|---|---|---|---|---|---|---|
| `/` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/about` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/academy` | page | 200 | metadata | index, follow | division:knowledge-academy |  |
| `/academy/[slug]` | page | 200 (as /academy/5d-cost-control) | generateMetadata | index, follow | under /academy (division:knowledge-academy) |  |
| `/api/civicbid/signal-forge` | route | not probed | - |  | product:civicbid(api_route) |  |
| `/api/pilot-requests` | route | not probed | - |  | **unregistered** |  |
| `/api/public/artemis-structure` | route | 200 | - | — | **unregistered** |  |
| `/api/sandbox-log` | route | not probed | - |  | **unregistered** |  |
| `/api/sandbox/[id]` | route | not probed | - |  | **unregistered** |  |
| `/apps/anastasia-fantasia-demo` | route | not probed | - | noindex,follow | product:anastasia-fantasia-demo(route) |  |
| `/apps/prime-erp` | page | 200 | metadata | noindex, nofollow | **unregistered** |  |
| `/auth/callback` | route | not probed | - |  | **unregistered** | redirect() |
| `/auth/signout` | route | not probed | - |  | **unregistered** | redirect() |
| `/case-studies` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/case-studies/[slug]` | page | 200 (as /case-studies/fuel-adjustment-automation) | generateMetadata | index, follow | **unregistered** |  |
| `/contact` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/control` | page | 307 → /login | metadata | — | **unregistered** |  |
| `/control/propose` | page | 307 → /login | metadata | — | **unregistered** |  |
| `/dashboard` | page | 307 → /login | metadata | — | **unregistered** |  |
| `/demo` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/departments` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/departments/art/sala-rotonda` | page | 200 | metadata | noindex, nofollow | product:sala-rotonda(route) | iframe |
| `/erp` | page | 200 | metadata | noindex, nofollow | **unregistered** |  |
| `/evolution` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/favicon.ico` | route | not probed | - |  | **unregistered** |  |
| `/for/[slug]` | page | 200 (as /for/contractors) | generateMetadata | index, follow | **unregistered** |  |
| `/insights` | page | 200 | metadata | index, follow | division:knowledge-academy |  |
| `/labs` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/labs/[slug]` | page | 200 (as /labs/cost-curve-webgl-demo) | generateMetadata | index, follow | **unregistered** |  |
| `/labs/[slug]/[...path]` | page | not probed | metadata |  | **unregistered** |  |
| `/labs/artemis-tax-efficacy-alpha` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/labs/artemisix19` | page | 200 | metadata | index, follow | product:artemisix19(route) |  |
| `/labs/bidroom-atlasiq` | page | 200 | metadata | noindex, nofollow | **unregistered** |  |
| `/labs/bidroom-exemplary-contractor` | page | 200 | metadata | index, follow | product:bidroom-exemplary-contractor(route) |  |
| `/labs/bidroom-verity` | page | 200 | metadata | noindex, nofollow | **unregistered** |  |
| `/labs/civicbid-intelligence-bridge` | page | 200 | metadata | index, follow | product:civicbid(route), division:infrastructure-construction |  |
| `/labs/civicbid-signal-forge` | page | 200 | metadata | noindex, nofollow | product:civicbid(review_route) | iframe |
| `/labs/construction-intelligence-workbench` | page | 200 | metadata | index, follow | product:construction-intelligence(route), division:infrastructure-construction |  |
| `/labs/developmentandtest/kings-highway` | page | 200 | metadata | index, follow | **unregistered** | iframe |
| `/labs/developmentandtest/troy-time-atlas` | page | 200 | metadata | index, follow | **unregistered** | iframe |
| `/labs/diana-moonshot` | page | 200 | metadata | index, follow | product:diana-moonshot(route) |  |
| `/labs/finance-architecture-5d` | page | 200 | metadata | index, follow | **unregistered** | iframe |
| `/labs/geodesic-intelligence` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/labs/geometric-workbench/v5-8` | page | 307 → /workbench/app | - | — | **unregistered** | redirect() |
| `/labs/george-aegean-quest` | page | 200 | metadata | index, follow | division:atlas-places | iframe |
| `/labs/levara-l28-financial-twin` | page | 200 | metadata | index, follow | product:artemis-nomad(route) | iframe |
| `/labs/levara-l28-success-gate-immersive` | page | 200 | metadata | index, follow | **unregistered** | iframe |
| `/labs/prime-erp` | page | 200 | metadata | noindex, nofollow | product:prime-industrial-erp(route) | iframe |
| `/labs/rainbow-house-botanical` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/labs/run/[id]` | page | not probed | generateMetadata |  | **unregistered** |  |
| `/labs/scenes/[id]` | page | 200 (as /labs/scenes/hello-orb) | generateMetadata | noindex, nofollow | **unregistered** |  |
| `/labs/tax-architecture-2026` | page | 200 | metadata | index, follow | product:tax-architecture-2026(route), division:finance-decision-systems | iframe |
| `/labs/troy-time-atlas` | page | 200 | metadata | index, follow | product:time-atlas-troy(route), division:atlas-places | iframe |
| `/labs/turkiye-atlas` | page | 200 | metadata | index, follow | product:turkiye-atlas(route), division:atlas-places | iframe |
| `/labs/utility-intelligence-bridge` | page | 200 | metadata | index, follow | division:infrastructure-construction |  |
| `/labs/utility-intelligence-bridge/3d-model` | page | 200 | metadata | — | under /labs/utility-intelligence-bridge (division:infrastructure-construction) | served as static HTML (page.tsx shadowed) |
| `/labs/utility-intelligence-bridge/dual-story` | page | 200 | metadata | index, follow | under /labs/utility-intelligence-bridge (division:infrastructure-construction) |  |
| `/labs/utility-intelligence-bridge/field-claims` | page | 200 | metadata | index, follow | product:utility-field-claims(route), division:infrastructure-construction |  |
| `/library` | page | 200 | metadata | index, follow | division:knowledge-academy |  |
| `/library/programs` | page | 200 | metadata | index, follow | under /library (division:knowledge-academy) |  |
| `/login` | page | 200 | metadata | noindex, nofollow | **unregistered** | redirect() |
| `/pinarevleri` | page | 200 | layout (robots only) | noindex, nofollow | product:pinar-evleri(route) | iframe, client page |
| `/portfolio` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/products` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/products/bidroom` | page | 200 | metadata | noindex, nofollow | product:bidroom-suite(route) |  |
| `/products/bidroom/atlasiq` | page | 200 | metadata | noindex, nofollow | under /products/bidroom (product:bidroom-suite(route)) |  |
| `/products/bidroom/contractor` | page | 200 | metadata | noindex, nofollow | under /products/bidroom (product:bidroom-suite(route)) |  |
| `/products/bidroom/evidence-engine` | page | 200 | metadata | noindex, nofollow | under /products/bidroom (product:bidroom-suite(route)) |  |
| `/products/bidroom/live` | page | 200 | metadata | noindex, nofollow | under /products/bidroom (product:bidroom-suite(route)) |  |
| `/products/bidroom/switchboard` | page | 200 | metadata | noindex, nofollow | under /products/bidroom (product:bidroom-suite(route)) |  |
| `/products/connect` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/products/construct` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/products/docs` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/products/flow` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/products/twin-atlas` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/rainbowbotanics` | page | 307 → /rainbowbotanics/hemerocallis-fulva | - | — | **unregistered** | redirect() |
| `/rainbowbotanics-2026/[slug]` | page | not probed | generateMetadata |  | **unregistered** | redirect() |
| `/rainbowbotanics/[slug]` | page | 200 (as /rainbowbotanics/hemerocallis-fulva) | generateMetadata | noindex, nofollow | **unregistered** |  |
| `/solutions` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/solutions/ai-business-systems` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/solutions/construction-intelligence` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/solutions/engineering-visualization` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/system-map` | page | 307 → /login | metadata | — | **unregistered** |  |
| `/tools` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/tools/fuel-price-adjustment` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/workbench` | page | 200 | metadata | index, follow | **unregistered** |  |
| `/workbench/app` | page | 200 | metadata | index, follow | product:geometric-workbench(route) |  |

**A-1 (P2): two route files are shadowed by `next.config.mjs` and never render.**
- **`app/labs/utility-intelligence-bridge/3d-model/page.tsx`.** A `beforeFiles` rewrite serves `/standalone/utility-intelligence-bridge/3d-model/index.html` in its place. The response comes back `charset=UTF-8`, i.e. a static file, with the static title "Utility Sewer 3D Bridge | Artemis Omni".
- **`app/labs/geometric-workbench/v5-8/page.tsx`.** The `redirects()` rule sends `/labs/geometric-workbench/v5-8` → `/workbench/app` (307) before the page runs.

## B. Navigation audit

**Source:**
- Header and footer: `components/layout/SiteHeader.tsx` and `SiteFooter.tsx`, both fed by `lib/artemis/navigation.ts`.
- Header links: Solutions, Products, Labs, **Botanical** (`/labs/rainbow-house-botanical`), Portfolio, Library, Departments, plus the CTA `/contact`.
- Footer: also Demo, Academy, Case Studies, Workbench, Tools, About, Evolution.
- **All 15 nav targets return 200 with `index, follow`.** There are no dead nav links.

**B-1 (P1): "Botanical" is misplaced as a top-level header entry.**
- `/labs/rainbow-house-botanical` is **unregistered** and indexable (`index, follow`), and is linked from 84 pages through the header.
- The product it belongs to, `rainbow-botanics` (natural-systems), is registered as `lifecycle: noindex_draft` and `visibility: noindex_review`, with canonical route `/rainbowbotanics/hemerocallis-fulva` (which returns `noindex, nofollow`).
- So a top-level slot promotes a draft product's unregistered surface. This matches backlog item C12.

**B-2 (P2): dead navigation module.** `lib/site.ts` defines `mainNav` and `footerNav`, but nothing imports them; `grep` finds them only in `lib/site.ts`. The live nav is `lib/artemis/navigation.ts`.

**B-3 (P2): `/insights` is barely linked.** It is a registered `knowledge-academy` public route, but is in neither header nor footer and has only 2 inbound links.

## C. Broken link scan

**C-1 (P0): one broken internal link.** `app/labs/civicbid-signal-forge/page.tsx:121` links to `/products/bidroom/signal-forge-classic`, which returns **404**; no such route exists under `app/products/bidroom/`. Both the crawl and the static scan found only this one.

**C-2 (P2): Prime ERP dashboard API calls fail locally.**
- The crawl's other four "404s" were JavaScript template literals inside `public/prime-erp/prime_industrial_erp.html` (lines 1302, 1569, 1651 and 1652, e.g. `/api/invoices/${...}/pdf`). They are not real links.
- However, the dashboard's own API calls (e.g. `/api/summary`) return **404 locally**, because the proxy rewrites in `next.config.mjs` exist only when `PRIME_ERP_BACKEND_URL` is set.
- Production was not verified.

**C-3: every same-origin iframe target returns 200 `text/html`.** The 13 targets are:
- 9 under `/standalone/*`;
- `/civicbid/the-bid-room-v2-1.html`;
- `/prime-erp/prime_industrial_erp.html`;
- `/workbench/runtime/latest`;
- `/labs/civicbid-signal-forge`, embedded by `/products/bidroom/switchboard`.

**C-4: `/labs/utility-intelligence-bridge/dual-story` does run what it promises (the brief's concern doesn't hold).**
- It is not an iframe page. "Open Live Cockpit" and the "Launch" buttons are in-page anchors, and all 6 resolve to existing ids.
- `#live-cockpit` embeds `UtilityFieldClaimsWorkbench`, a `"use client"` component with 10 state/handler hooks that recomputes on input.
- **Remaining issue (P2, data truth):** "Live Cockpit" labels data that the component tags as `FR-SYN-108 … sample` / `CL-SYN-022`. Renaming it would avoid implying live data.

## D. Visual / proof surface inventory

| Route | Visual components (`app/<route>/page.tsx`) | Style |
|---|---|---|
| `/labs` | LiveDashboardCard, GeodesicRenderCard, BlueprintFluxDiagram, OrganizationArchitectureDiagram, CinematicStoryPanel, BrandVisualLibrary, ProofCard ×n, SystemDiagramCard, ValueChainStrip, plus the registry cards (M1) and the Immersive scenes card (M7) | Static SVG/CSS diagrams and cards |
| `/solutions` | Card, LiveDashboardCard, OrganizationArchitectureDiagram | Static SVG and cards |
| `/products` | OrganizationArchitectureDiagram, **GeodesicRenderCard titled "Spatial proof surface"** (`app/products/page.tsx:44`), cards | Static SVG and cards |
| `/departments` | PageHero, Card | Cards only |
| `/case-studies` | PageHero and a list | Text list. **1 case study**, whose `heroImage` is the default `/og/artemis-default.svg` |
| `/portfolio`, `/demo` | PageHero, Card | Cards only |
| `/labs/scenes/hello-orb` | SceneIsland (R3F) | The only 3D surface |

All 9 showcase components are server components (no `"use client"`). Seven use inline SVG and none animate, apart from CSS hover/transition classes in BrandVisualLibrary and ProofCard.

**D-1 (P2): `GeodesicRenderCard` is the weakest proof visual.** It is labeled "Spatial proof surface" but is a 74-line static SVG (`components/showcase/GeodesicRenderCard.tsx`).

**D-2 (P2): the proof surfaces are thin.**
- `/departments`, `/portfolio` and `/demo` are card grids.
- `/case-studies` has a single entry with a placeholder hero.

**M7 (ADR-015) 3D upgrade candidates, in order:**
1. `GeodesicRenderCard` on `/products` and `/labs` (geometry is the natural 3D subject).
2. A `/departments` hero opt-in, which ADR-015 already allows.
3. `BlueprintFluxDiagram` on `/labs`.

The homepage stays excluded in v1 (ADR-015).

## E. Metadata audit

From the rendered HTML of 84 Next.js pages:
- **Every page has a `<title>` and a meta description.**
- **Robots:** 17 pages are `noindex`; all are intentional (auth, review, or registry `noindex_review`).
- **Sitemap:** 51 entries, all 200, and none noindex.

**E-1 (P1): 11 standalone HTML files are directly reachable with no robots meta.**
- `/standalone/*.html` (9 files);
- `/prime-erp/prime_industrial_erp.html`;
- `/workbench/runtime/latest`.

The Prime ERP file belongs to `prime-industrial-erp`, which is registered `noindex_review`, but the raw HTML is indexable. `app/robots.ts` allows `/`. (`/civicbid/the-bid-room-v2-1.html` does carry `noindex,nofollow`.)

**E-2 (P2): noindex pages linked from indexable pages.**
- `/labs/scenes/hello-orb` is linked from `/labs`. The M7 page sets noindex whenever `visibility !== "public"`, while the scene is an approved `public_safe_demo`.
- `/labs/civicbid-signal-forge` is linked from `/labs/bidroom-exemplary-contractor`.

**E-3 (P2): duplicate titles.**
- `/pinarevleri` uses the homepage title "Artemis Omni — AI-Enabled Execution Bridge". Its `layout.tsx` (PR #74) sets robots only, and the page is a client component.
- `/labs/bidroom-atlasiq` and `/products/bidroom/atlasiq` are both "BidRoom AtlasIQ — Artemis Omni". Both are noindex.

## F. Registry vs route mismatch

**Registered products (20):**
- 17 have a route path, and **all 17 return 200** with robots matching their registered visibility (noindex_review ⇒ noindex).
- 3 have no route path: `atlas-handcrafted-guru-selection`, `artemis-evolution-console`, `dayos`.

**Division `public_routes`:** all 12 return 200.

**Totals:** 87 route files.
- **Registered exactly:** 23.
- **Under a registered prefix:** 9.
- **Unregistered:** 55, grouped as:
  - **Site shell / content (13):** expected to be unregistered.
  - **Internal/system (9):** `/login`, `/auth/*`, `/control*`, `/system-map`, `/dashboard`, `/labs/run/[id]`, `/labs/scenes/[id]`. These are governed by ADR-011…015, not the Product Registry.
  - **API (4).**
  - **Labs (13):** includes `/labs/geodesic-intelligence`, `/labs/artemis-tax-efficacy-alpha`, `/labs/finance-architecture-5d`, `/labs/rainbow-house-botanical` and `/labs/developmentandtest/*`. `/labs/bidroom-atlasiq` and `/labs/bidroom-verity` are covered by ADR-010's `/labs/bidroom-*` rule. `/labs/levara-l28-success-gate-immersive` is listed only in an artemis-nomad comment.
  - **Products (6):** see F-1.
  - **Other (10):** `/erp` and `/apps/prime-erp` (prime-erp surfaces in comments only), `/workbench`, the `/solutions/*` subpages, and `/rainbowbotanics*`.

**F-1 (P1): there are two sources of truth for products.**
- `/products` renders from `lib/artemis/products.ts`: 7 modules, `construct`, `twin-atlas`, `flow`, `docs`, `connect`, `ops` and `desk`.
- **None of them is in `PRODUCT_REGISTRY.yaml`.**
- 5 have live, indexable pages: `/products/construct`, `/twin-atlas`, `/flow`, `/docs` and `/connect` (all 200).
- The M1 brief called `lib/artemis/products.ts` "orphan code", but it is imported by `app/products/page.tsx`, the five module pages, `components/artemis/ModuleDetail.tsx` and `PilotIntakeForm.tsx`.

**F-2 (P1): public registered labs have no inbound links and aren't in the sitemap.**
- `/labs/levara-l28-financial-twin` is the canonical route of `artemis-nomad` (public_safe_demo).
- `/labs/bidroom-exemplary-contractor` is `public_safe_demo`.
- **(P2)** The unregistered `/labs/artemis-tax-efficacy-alpha`, `/labs/finance-architecture-5d`, `/labs/levara-l28-success-gate-immersive` and `/labs/developmentandtest/*` are also unlinked.

## Recommended Fix Order

1. **C-1 (P0):** fix or remove the `/products/bidroom/signal-forge-classic` link (`app/labs/civicbid-signal-forge/page.tsx:121`).
2. **B-1 (P1):** move "Botanical" out of the header, or register `/labs/rainbow-house-botanical` and reconcile it with `rainbow-botanics` (`noindex_draft`).
3. **E-1 (P1):** stop indexing raw standalone HTML. Use an `X-Robots-Tag` header for `/standalone/*` and `/prime-erp/*` via `next.config` headers, or add a disallow rule in `robots.ts`. This also feeds the ADR-014 standalone-lab dispositions.
4. **F-1 (P1):** pick one product source of truth. Register the 5 `/products/*` modules in PRODUCT_REGISTRY, or retire `lib/artemis/products.ts`.
5. **F-2 (P1):** link the public registered labs (`artemis-nomad`, `bidroom-exemplary-contractor`) from `/labs` or the sitemap.
6. **E-2 (P2):** decide whether approved `public_safe_demo` scenes are indexable. Then either index hello-orb or stop listing it on `/labs`.
7. **A-1 (P2):** delete or reconcile the two shadowed `page.tsx` files (3d-model, geometric-workbench v5-8).
8. **E-3 / C-4 (P2):** give `/pinarevleri` its own title, and rename "Live Cockpit" on synthetic data.
9. **D-1 (P2):** upgrade `GeodesicRenderCard` ("Spatial proof surface") as the first real ADR-015 scene.
10. **B-2 / B-3 (P2):** remove the dead `lib/site.ts` nav, and decide on `/insights` placement.
