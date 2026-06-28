# Construction Intelligence Workbench — Migration Inventory & Sanitation Report

> **Status: STOPPED before migration. Sanitation result = C (not safe to migrate in this
> branch).** No workbench code, routes, components, or data were created. No source/HTML was
> copied into the repo. This document is the only output of this pass.

## 1. Objective

Locate and assess the P1 public-showcase candidate **"Artemis Construction Intelligence
Workbench — LinkedIn RC2"** for migration into `/labs/construction-intelligence-workbench`,
per the controlled migration sequence.

## 2. Search performed

**Terms:** LinkedIn RC2, Construction Intelligence Workbench, construction-intelligence,
workbench, labs, showcase, RC2, 5D, project controls, cost dashboard, forecast, CMiC,
executive demo, dashboard, claims, exposure, risk register, change register.

**Locations inspected:** the repo (`app/`, `components/`, `lib/`, `content/`, `docs/`,
`public/`, excluding `node_modules`/`.next`), `~/Desktop`, `~/Downloads`, `~/Documents`.

## 3. Candidate files found

The RC2 source **was located** (not missing):

| File | Location |
| --- | --- |
| `Artemis_Construction_Intelligence_Workbench_LinkedIn_RC2.html` | `~/Desktop/` (primary) |
| `Artemis_Construction_Intelligence_Workbench_LinkedIn_RC2.html` | `~/Documents/art-html/` (duplicate) |
| `Artemis_Construction_Intelligence_Workbench_LinkedIn_RC1.html` | `~/Desktop/`, `~/Documents/art-html/` (prior RC) |

Single self-contained HTML file: **~224 KB, ~3,180 lines.** No copy was made into the repo.

(Many other workbench HTMLs exist on the Desktop — DEP Sewer variants, table-base/geodesic
workbenches, app-shell templates — but the named P1 target is the RC2 file above.)

## 4. Deep sanitation scan results

The file's `<title>` is *"Artemis Construction Intelligence Workbench — Geometry-Driven 5D
Project Controls Demo"*, **but the asset is in substance a DEP Sewer demonstration:**

| Signal | Finding |
| --- | --- |
| Default project name | `Artemis DEP Sewer Demonstration — Representative Reach` |
| In-app section | A **"DEP Sewer Workbench Tutorial"** |
| `DEP` references | **93** — pervasive in the engineering logic (DEP sewer envelope 'A' dimension, DEP SE-sheet CY/LF factors, DEP max-V cover checks, DEP reinforcing densities) |
| `ESCR` | 1 (East Side Coastal Resiliency — explicitly on the scrub list) |
| `DDC` | 1 (NYC Dept of Design & Construction) |
| `CMiC` | 7 |
| Stations / `STA` | present (alignment stationing) |
| Claims | present |

**Technical-dependency scan (independently disqualifying for this branch):**

| Dependency | Finding | Branch rule |
| --- | --- | --- |
| **Three.js (r128)** | 56 `THREE.*`/WebGL references; the 3D geometry model is the core of the asset | ❌ no Three.js / WebGL |
| **Leaflet + Mapbox satellite tiles** | external map-tile requests (geospatial) | ❌ no external API calls |
| Chart.js | external CDN script | (would need vendoring) |

**Secrets:** ✅ **None.** The only "token" is a **user-entered Mapbox token input field**
(placeholder "Mapbox token or blank") — no hardcoded API key, bearer, or secret. No
`fetch`/XHR to custom backends (0). External calls are CDN script loads + Mapbox tiles.

## 5. Decision: Option C — NOT safe to migrate in this branch

Three independent reasons, any one of which is sufficient:

1. **It is the DEP Sewer demo.** The asset is literally an "Artemis DEP Sewer Demonstration"
   with a DEP Sewer tutorial and DEP standards throughout. The migration brief explicitly
   states: *"Keep the DEP Sewer demo entirely separate. Do not migrate DEP Sewer in this
   branch."* Migrating RC2 would violate that directly. (Note: this also corrects the
   Executive Demo Library's earlier assumption that RC2 was a DEP-independent, public-safe
   asset — it is not.)
2. **Pervasive real-project entanglement.** DEP-specific engineering standards are not mere
   labels; they are the substance of the calculations (envelopes, factors, cover checks,
   reinforcing densities). Per the rules, entangled data must be *replaced entirely* — which
   here means rebuilding the engineering model, not sanitizing labels. Plus ESCR/DDC appear.
3. **Forbidden tech stack.** The asset's value is its Three.js/WebGL 3D model + Mapbox/Leaflet
   maps. This branch forbids Three.js, WebGL, R3F, and external API calls. Replacing the 3D
   with a "coming soon" placeholder would strip the asset of its core demonstration.

## 6. What was NOT done (guardrails honored)

- ❌ No HTML/source copied into the repo or `public/`.
- ❌ No workbench route, components, or data files created.
- ❌ No `/labs` or `/labs/[slug]` changes.
- ❌ No DEP Sewer migration (explicitly kept separate).
- ❌ No Three.js / WebGL / R3F / Framer Motion / dependencies / backend / Supabase / auth.

## 7. Recommended next action

1. **Choose a genuinely DEP-independent P1 candidate** for the first public Labs showcase —
   one built on synthetic, generic project-controls data with no DEP/ESCR/DDC identity and
   no mandatory 3D/maps. Options:
   - Build a **net-new synthetic** "Construction Intelligence Workbench" from scratch using
     the data-driven component plan (KPI grid, forecast panel, controls matrix, risk
     register, audit panel) with `Project Alpha` / `Owner Agency` synthetic data and a 2D
     SVG/Tailwind forecast chart (no Three.js, no maps). This is the cleanest path and fits
     all branch guardrails.
   - Or sanitize a **non-DEP** source asset if one exists (the RC2 file is not it).
2. **Re-classify** "Artemis Construction Intelligence Workbench — LinkedIn RC2" in
   `docs/showcases/ExecutiveDemoLibrary.md` and `lib/artemis/demoAssets.ts` from
   *Public-safe / Production candidate* to **Private demo / DEP-entangled**, so future passes
   don't treat it as public-safe. *(Not changed in this pass — flagged for approval.)*
3. Keep RC2 and all DEP Sewer workbenches in the **private** demo track.

## 8. Conclusion

Source **found**, but **migration stopped** at Option C. The safe path forward is a
synthetic, DEP-independent, 2D workbench — to be authorized separately.
