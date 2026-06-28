# Executive Demo Library — Strategy & Inventory

> **Internal strategy document.** A catalogue and triage plan for existing Artemis HTML
> apps, dashboards, workbenches, and render references. **Nothing here is migrated, embedded
> in public pages, or routed yet.** No `/demo`, no `/products/flow`. This is a plan, not an
> implementation.
>
> **Provenance note:** the items below are catalogued from the provided inspiration list.
> They are **not yet located or inspected inside this repo** (except the brand references in
> `docs/brand/reference/`). Classifications are preliminary and must be re-confirmed against
> the actual files before any migration.

## Classification labels

| Label | Meaning |
| --- | --- |
| **Public-safe** | No client/confidential data; safe to show publicly as-is (after optimization). |
| **Private demo** | Show live only in controlled/sales settings; not for public web. |
| **Needs sanitization** | Strong asset, but contains client/project specifics to strip first. |
| **Reference only** | Inspiration/moodboard; not a shippable demo. |
| **Production candidate** | Strong enough to become a real Artemis page/component after work. |

## Master inventory

| # | Asset | Demonstrates | Class | Future route (proposed) | Page type | Integration | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Artemis Construction Intelligence Workbench — LinkedIn RC2** | Geometry-driven 5D project-controls workbench (real-project reference) | **PRIVATE_REFERENCE** (re-classified — see §1) | *none — do not migrate as-is* | Private reference | n/a | **P3** |
| 2 | **Artemis App Shell Template v0.3** | Reusable Artemis app chrome (nav, panels, theming) | Public-safe / Production candidate | (component layer, not a page) | Shell → React component extraction | Medium | **P1** |
| 3 | **ESCR Forecast Matrix & Exposure Range Dashboard** | Forecast exposure control; range/confidence on cost exposure | Needs sanitization → Public-safe | `/case-studies/forecast-exposure-control` | Sanitized case study + Labs demo | Medium–High | **P2** |
| 4 | **DEP Sewer Construction Intelligence Workbench** | 3D/4D/5D heavy-civil workbench on a real program | Needs sanitization → Private demo | `/labs/sewer-construction-workbench` | Private demo first | High | **P2** |
| 5 | **Reach K 5D Master Model / Jet Grout Column Inspector** | 5D model + geotechnical (jet grout) column QA | Needs sanitization / Private demo | `/labs/model-to-money-inspector` | Private demo | High | **P3** |
| 6 | **Reach K Jet Grout QA — Interactive Plan Editor** | Interactive plan editing + geometry QA sandbox | Needs sanitization / Private demo | `/labs/geometry-qa-sandbox` | Private demo | High | **P3** |
| 7 | **Artemis App Shell Template v0.2** | Prior shell iteration | Reference only | — | Reference for #2 | Low | **P4** |
| 8 | **Artemis App Shell Template v0.1** | Earliest shell iteration | Reference only | — | Reference for #2 | Low | **P4** |
| 9 | **System Graphics Exemplary (ZIP)** | Reusable system/architecture graphics | Reference only → Public-safe | `/academy` / `/labs` figures | Visual reference | Low–Medium | **P3** |
| 10 | **Exemplary graphics / render (ZIPs)** | Cinematic render inspiration | Reference only | — | Moodboard | Low | **P4** |
| 11 | **Artemis brand/media references** (`docs/brand/reference/`) | Logo/palette/motif direction | Reference only | — | Brand intake (done) | n/a | **P4** |

## Per-asset notes

### 1 — Artemis Construction Intelligence Workbench (LinkedIn RC2) — **PRIVATE_REFERENCE (re-classified)**
> **The LinkedIn RC2 Construction Intelligence Workbench is not public-migration-ready in its
> current form. It is deeply entangled with real project data, CMiC-style structures, map/3D
> logic, and WebGL dependencies. It must be treated as a private reference only. Public demos
> must use synthetic data and rebuilt UI patterns.**
- **Why re-classified:** on inspection the asset is a DEP Sewer demonstration (default project
  name "Artemis DEP Sewer Demonstration", a DEP Sewer tutorial, ~93 DEP references in the
  engineering logic, plus ESCR/DDC), and it depends on Three.js/WebGL + Leaflet/Mapbox tiles.
  See `ConstructionIntelligenceWorkbenchInventory.md` for the full Option-C report.
- **Technical value (private only):** useful internal reference for workbench layout concepts.
- **Status:** **do not migrate or copy.** Keep in the private demo track.
- **Public replacement:** a net-new **synthetic** workbench was built at
  `/labs/construction-intelligence-workbench` (synthetic data, no 3D/maps, no RC2 code/data).

### 2 — Artemis App Shell Template v0.3 — **P1**
- **Business value:** consistency — one shell for every future demo/app.
- **Technical value:** the natural foundation for extracting reusable React components
  (nav, side panels, KPI row, theming) aligned with the existing `components/` system.
- **Risk:** low; generic chrome.
- **Recommendation:** the **first React migration candidate** — extract the shell into
  `components/` (no new routes) so future demos inherit it.

### 3 — ESCR Forecast Matrix & Exposure Range Dashboard — **P2**
- **Business value:** exposure/range forecasting is exactly the executive pain (how bad can
  it get, how confident are we).
- **Technical value:** matrix + confidence-range visualization maps to the 5D comparison.
- **Risk:** likely client-specific ("ESCR"); **needs sanitization** before public use.
- **Recommendation:** sanitize into a **Forecast Exposure Control Center** public-safe case
  study; keep the live version private until cleared.

### 4 — DEP Sewer Construction Intelligence Workbench — **P2**
- **Business value:** flagship heavy-civil/infrastructure proof on a recognizable program type.
- **Technical value:** 3D/4D/5D workbench depth.
- **Risk:** agency/program specifics (DEP) — **private demo first**, sanitize before public.
- **Recommendation:** lead **private demo** for infrastructure-owner conversations.

### 5 & 6 — Reach K 5D Master Model / Jet Grout Inspector + QA Plan Editor — **P3**
- **Business value:** deep geotechnical/QA credibility (jet grout columns, plan editing).
- **Technical value:** interactive geometry QA + model-to-money linkage.
- **Risk:** project-specific ("Reach K"); interactive editors are higher integration effort.
- **Recommendation:** keep **private**; strong sales demos; candidates for "Model-to-Money
  Inspector" and "Geometry QA Sandbox" once sanitized.

### 7–8 — App Shell v0.1 / v0.2 — **P4**
- Reference iterations feeding #2. Keep for lineage; do not ship.

### 9–11 — System graphics, render ZIPs, brand refs — **P3/P4**
- Visual building blocks. #9 (system graphics) can yield **Public-safe** figures for Academy
  and Labs once curated. Renders and brand refs remain **reference only**.

## Recommended sequence

1. **First public showcase: DONE** — a net-new **synthetic** Construction Intelligence
   Workbench was built at `/labs/construction-intelligence-workbench` (synthetic data, no
   3D/maps, no RC2 code). RC2 itself is **PRIVATE_REFERENCE** (see §1) and was not migrated.
2. **First private demo:** #4 Utility/Sewer Workbench (sanitize + rebuild later for public).
3. **First React migration:** #2 App Shell Template v0.3 → reusable `components/` shell.

## Hard guardrails (this pass)

- 🚫 Do **not** migrate these demos yet.
- 🚫 Do **not** embed them into public pages yet.
- 🚫 Do **not** create `/demo` or `/products/flow`.
- ✅ Re-verify each "Public-safe" claim against the actual file before any public use.
- ✅ Sanitize anything client/agency/project-specific before it leaves a private setting.
