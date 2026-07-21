# ARTEMIS Geometric Workbench — Feature Matrix

Status date: 2026-07-20

Purpose: establish a source of truth before refactoring. This document distinguishes verified functionality, partially verified behavior, hidden or unclear UI, and genuinely pending work.

## Status vocabulary

- **Verified functional** — confirmed in source and/or public deployment.
- **Implemented; QA pending** — code exists, but browser interaction or round-trip behavior still needs explicit verification.
- **Partially functional** — feature exists but is incomplete, preliminary, or unclear.
- **Pending** — not yet implemented.
- **Naming review** — public terminology requires provenance or trademark review.

## Current public routes

| Surface | Route | Status | Notes |
|---|---|---:|---|
| Workbench app | `/labs/geometric-workbench/v5-8` | Verified functional | Public route redirects to `index.html`; deployed v6.0.0-alpha behavior is served from the legacy route. |
| Product page | `/workbench` | Verified functional | Marketing copy requires synchronization with the six-palette v6 implementation. |
| Support | `https://www.agoraxai.com/support` | Implemented; QA pending | App retains the Squarespace support destination and blocked-popup fallback. |

## Sprint 0B grounded source-locus audit

Canonical implementation: `public/labs/geometric-workbench/v5-8/index.html` plus the UMD integrity API in `public/labs/geometric-workbench/v5-8/v6-integrity.js`. Line numbers below are orientation only; the named functions, constants, element IDs, and exported hooks are the stable locators.

| Capability | Stable implementation loci | Grounded behavior |
|---|---|---|
| Full Sphere mode | `#viewMode` option `value="sphere"`; `params().viewMode`; `buildGoldberg()`; `rebuildScene()` | `buildGoldberg()` applies the cut predicate only when `p.viewMode === 'dome'`; the sphere path retains the complete generated dual-cell set. |
| Dome mode | `#viewMode` option `value="dome"`; `#cut` / `#cutN`; `params()`; `buildGoldberg()` | Dome mode filters candidate cells by the active normalized cut plane before topology/BOM construction. |
| Custom dome cut | `#cut` and `#cutN`; `pairIds` synchronization wiring; `domeFractionToCut()`; `applyConstructorNotation()` | Direct y/R input and parsed dome fractions both set the same cut control; the accepted UI range is `-0.25` through `0.85` in `0.01` steps. |
| Preliminary BOM | bottom tab `[data-tab="bom"]`; `drawBottom()` branch `activeTab === 'bom'`; `drawBOM()`; `bomSummaryObject()` | Generated overview combines configuration, totals, validation status, material assumptions, panel families, hubs, and warnings. |
| Panel families | `panelFamilies()`; `drawBOM()`; `exportJSON()` and `exportManufacturingJSON()` payload field `panelFamilies` | Families group by side count plus rounded outer-edge and saw-bevel values and carry quantity, area, volume, sample, and cell IDs. |
| Member schedule | `constructorSummary().members`; integrity API `memberInstances()` and `groupMemberInstances()`; `drawStruts()`; `exportStrutCSV()`; export field `memberSchedule` | Physical instances are created after topology/connection/rim policy, then grouped using `BOM_ASSUMPTIONS` tolerances. |
| Hub schedule | integrity API `hubSchedule()`; `constructorSummary().hubs`; `drawBOM()` and `drawTopology()`; export field `hubSchedule` | Groups canonical vertices by valence, boundary/interior class, and connection; angular equivalence remains explicitly preliminary. |
| Project save/load | `window.ARTEMIS_WORKBENCH_V6.createProjectPayload()` and `.loadProjectPayload()`; shell functions `saveProject()` and `loadProjectFile()`; `#v59ProjectFile` | Save emits schema `artemis-project-6.0-alpha` with neutral behavior IDs; load restores generic `params`, constructor/fabrication controls, UI state, and exact-token legacy aliases through `migrateLegacyConstructorConfig()`. |
| Palette persistence | `PALETTES`; `LEGACY_PALETTES`; `V59.palette` / `V59.accent`; `applyMaterial()`; project `ui.palette` and `ui.accentColor` | Current palette and manual accent are saved together; load accepts the legacy `ui.material` key and maps legacy palette tokens before applying the accent. |
| Exports | button IDs `#downloadJSON`, `#downloadCSV`, `#downloadMFG`, `#downloadMFGCSV`, `#downloadSVG`, `#downloadDXF`, `#downloadConstructor`, `#downloadStruts`, `#downloadErectionCSV`, `#downloadErectionJSON`, `#snapshot`; corresponding `export*` functions and `snapshotPNG()` | JSON, CSV, manufacturing, drawing, constructor, strut, erection, and image paths are separately wired without changing their existing structures. |
| Squarespace support | `V59.donationUrl`; `#v59Support`; `#v59DonationModal`; `setupDonation()` | Canonical URL is `https://www.agoraxai.com/support`; `window.open(..., 'noopener,noreferrer')` falls back to `window.location.assign(url)` when blocked. |
| Topology validation | integrity API `buildTopologyRegistry()` and `validateTopology()`; `topologyAuditObject()`; `drawTopology()`; `getLiveAudit()` | Validates shared endpoint identity, multiplicity, boundary loops, connectedness, nonmanifold edges, collisions, and the supported genus-zero Euler expectation. |
| Configuration fingerprint | integrity API `canonicalStringify()` and `configurationFingerprint()`; `calculationConfiguration()`; `refreshConfigurationFingerprint()`; `exportManifest()` | Canonically sorted calculation state is SHA-256 hashed; full and 12-character hashes flow to projects, UI audit output, and export manifests. |

## Geometry and structure extent

| Feature | User-facing locus | Internal locus / state | Status | Test needed | Naming risk / notes |
|---|---|---|---:|---|---|
| Full sphere | Model & Geometry | `#viewMode[value="sphere"]`; non-dome branch in `buildGoldberg()` | Verified functional | Integrity fixture + browser smoke test | Rename visibly to **Full Sphere**. |
| Dome cap | Model & Geometry | `#viewMode[value="dome"]`; cut predicate in `buildGoldberg()` | Verified functional | Integrity fixture + browser smoke test | Present but terminology is technical. |
| Hemisphere | Derived dome preset | `viewMode='dome'` plus hemisphere cut value | Partially functional | Preset/metric verification | Expose directly as **Hemisphere**. |
| Custom dome cap | Model & Geometry | `#cut` / `#cutN`; `domeFractionToCut()`; `applyConstructorNotation()` | Verified functional | Custom-cut integrity fixture + extreme-value test | Rename `Dome Cut` to **Custom Cap** workflow. |
| Frequency | Model & Geometry | `freq` | Verified functional | Frequency matrix | Add performance budget and target-edge-length mode later. |
| Radius | Model & Geometry | `radius` | Verified functional | Unit-boundary test | Confirm all BOM/export conversions. |
| Shell thickness | Fabrication controls | `thick` / profile thickness | Verified functional | BOM recalc test | Fabrication-only changes should not rebuild topology after state refactor. |
| Cell drawing mode | Model & Geometry | `cellMode` | Verified functional | Mode matrix | Clarify shell/cell terminology. |
| Polyhedron/base selection | Constructor configuration | constructor profile | Implemented; QA pending | Per-base geometry invariant tests | Audit every exposed option. |
| Subdivision patterns | Advanced geometry | class / HK / method fields | Partially functional | Targeted Class I/II/III audit | Keep standard terms in technical help; plain-language labels in primary UI. |
| Polygon/dual cells | Visualization / constructor | dual-cell generation | Verified functional | Topology invariant tests | Public label should be **Polygon Cells**; retain “dual” in technical documentation. |

## Visualization and interaction

| Feature | Locus | Status | Test needed | Notes |
|---|---|---:|---|---|
| Six coordinated palettes | Top bar / appearance | Verified functional | Switch all palettes; inspect scene materials | UI and Three.js materials change together. |
| Manual accent override | Appearance | Verified functional | Save/load round trip | Must remain independent of construction color logic. |
| Construction color modes | Appearance | Verified functional | Mode matrix | Preserve during palette changes. |
| Labels and overlays | Appearance / viewport | Implemented; QA pending | Dense model performance | Add label-density and reduced-motion controls. |
| Time Slicer | View & Playback | Verified functional | Playback smoke test | Confirm reduced-height visibility. |
| Animation Speed | View & Playback | Verified functional | Slider sync + persistence | Public deployment confirmed. |
| Camera presets | View controls | Implemented; QA pending | Fit/plan/iso/section tests | Add clearer named presets. |
| Resizable panels | Layout | Implemented; QA pending | Drag handles across viewport sizes | Add reset and layout presets. |
| Executive mode | Presentation layer | Implemented; QA pending | Visibility matrix | BOM discoverability may be reduced. |
| Engineering mode | Presentation layer | Implemented; QA pending | Visibility matrix | BOM should default open here. |
| Mobile drawers/layout | Responsive layer | Implemented; QA pending | Safari/Chrome/mobile widths | Accessibility and overlap review required. |

## BOM, schedules, and fabrication data

| Feature | Locus | Status | Test needed | Notes |
|---|---|---:|---|---|
| Preliminary BOM overview | `[data-tab="bom"]`; `drawBOM()`; `bomSummaryObject()` | Verified functional | Determinism fixture | Must become a clearly visible top-level tab. |
| Panel families | `panelFamilies()`; `drawBOM()`; export payload `panelFamilies` | Verified functional | Quantity/area fixture | Includes family quantity, area, volume, edges, and cut angles. |
| Member schedule | `memberInstances()` → `groupMemberInstances()`; `constructorSummary().members`; `drawStruts()` | Verified functional | Count and length fixture | Includes raw, net, deductions, and waste-adjusted totals. |
| Hub schedule | `hubSchedule()`; `constructorSummary().hubs`; `drawBOM()` / `drawTopology()` | Verified functional | Valence and class fixture | Angular classifications remain preliminary. |
| Rim policy | BOM / constructor | Verified functional | Policy matrix | Distinguish member rim and continuous ring behavior. |
| Material / grade | Fabrication / BOM | Verified functional | Save/load/export test | Editable assumption. |
| Density | Fabrication / BOM | Verified functional | Mass recomputation test | Must not trigger topology rebuild after state separation. |
| Waste factor | Fabrication / BOM | Verified functional | Boundary and persistence test | Default is 10%; editable preliminary assumption. |
| Surface area / shell volume / mass | BOM | Verified functional | Unit consistency test | Verify centimeter/meter conversion boundaries. |
| Configuration fingerprint | `calculationConfiguration()` → `configurationFingerprint()`; `refreshConfigurationFingerprint()`; `exportManifest()` | Verified functional | Stable same-input test | Same inputs should yield identical fingerprint and totals. |
| Connection deductions | BOM engine | Partially functional | Connection-specific fixture | Explicitly preliminary and unvalidated. |
| Connector hardware quantities | BOM | Pending | — | Bolts, plates, sleeves, brackets, welds, and fasteners. |
| Stock-length optimization | BOM/procurement | Pending | — | Cut planning and procurement quantities. |
| Cost and supplier columns | BOM/procurement | Pending | — | Future commercial/procurement layer. |

## Project persistence and exports

| Feature | Locus | Status | Test needed | Notes |
|---|---|---:|---|---|
| Save project JSON | `createProjectPayload()`; `saveProject()` | Implemented; QA pending | Save → reload round trip | Schema is `artemis-project-6.0-alpha`. |
| Load project JSON | `loadProjectPayload()`; `loadProjectFile()`; `#v59ProjectFile` | Implemented; QA pending | Current + legacy fixtures | Legacy-token normalization required. |
| Palette/accent persistence | `PALETTES`; `LEGACY_PALETTES`; `applyMaterial()`; project `ui.palette` / `ui.accentColor` | Verified in source | Round-trip test | Includes legacy palette fallback. |
| Animation speed persistence | Project JSON | Verified in source | Round-trip test | — |
| Waste-factor persistence | Project JSON | Verified in source | Round-trip test | — |
| BOM JSON | `#downloadJSON`; `exportJSON()`; `exportManifest()` | Verified functional | Schema fixture | Includes disclaimer, units, assumptions, warnings. |
| CSV exports | `#downloadCSV`, `#downloadMFGCSV`, `#downloadStruts`, `#downloadErectionCSV`; corresponding `export*CSV()` functions | Verified functional | Column/escaping test | Confirm large-model behavior. |
| Manufacturing JSON | `#downloadMFG`; `exportManufacturingJSON()` | Verified functional | Schema fixture | Clarify validated vs preliminary fields. |
| SVG/DXF/shop cards | `#downloadSVG`, `#downloadDXF`, `#snapshot`; `exportSelectedSVG()`, `exportSelectedDXF()`, `buildShopCardHtml()`, `snapshotPNG()` | Implemented; QA pending | Download and open each format | Exact capability and completeness should be inventoried. |
| Autosave/recovery | Project system | Pending | — | Add after schema audit. |
| Revision history/comparison | Project system | Pending | — | Named versions and BOM deltas. |

## Validation, diagnostics, and quality

| Feature | Status | Test needed | Notes |
|---|---:|---|---|
| Topology validation | Verified functional | `buildTopologyRegistry()` / `validateTopology()` integrity suite | Extend to disconnected, winding, and additional boundary diagnostics; nonmanifold and identity-collision failures are covered. |
| Parser diagnostics | Implemented; QA pending | Invalid/conflicting token tests | Must show visible error banners, not only console output. |
| Engineering disclaimer | Verified functional | Export/UI presence test | Production dimensions require engineering review and shop validation. |
| Accessibility | Partially functional | Keyboard, ARIA, contrast, reduced motion | Establish WCAG-oriented acceptance criteria. |
| Performance mode | Pending | — | Disable expensive effects, shadows, dense labels, and live rebuilds. |
| Debounced expensive inputs | Pending / audit required | Slider benchmark | Categorize geometry-, fabrication-, visual-, and layout-only changes. |

## Support and product integration

| Feature | Status | Test needed | Notes |
|---|---:|---|---|
| Product Home link | Verified functional | Click test | Routes to `/workbench`. |
| Squarespace support link | Implemented; QA pending | `V59.donationUrl`; `setupDonation()` popup/fallback regression | Canonical destination is `https://www.agoraxai.com/support`. |
| Amount/frequency prefill | Unconfirmed | End-to-end support flow | Do not claim until verified. |
| Product-page feature copy | Partially current | Content audit | Update version, palette count, BOM, save/load, and export language. |

## Naming and provenance priority

| Current term | Public treatment | Internal/backward compatibility | Priority |
|---|---|---|---:|
| Historical legacy token `Kruschke` | Removed from new public UI, glossary, presets, and exports | Exact case-insensitive import alias → `timber_optimized_subdivision` | Complete |
| Historical legacy token `GoodKarma` | Removed from new public UI, glossary, presets, and exports | Exact case-insensitive import alias → `inset_member_connection` | Complete |
| Class I / II / III | Use plain-language UI labels; retain standard technical term in help/docs | Preserve canonical technical identity | Medium |
| dual cells | Display **Polygon Cells**; explain dual relationship in help | Preserve geometry meaning | Low |
| dihedral angle | Display **Panel Joint Angle**; retain technical term in help/export metadata where useful | Preserve calculation semantics | Low |
| bevel | Display **Edge Cut Angle** or **Cut Angle** | Preserve fabrication semantics | Low |

## ARTEMIS behavior terminology contract

| Behavior | Stable internal ID | Public label | Serialization | Legacy import boundary |
|---|---|---|---|---|
| Timber-oriented subdivision intent | `timber_optimized_subdivision` | **Timber-Optimized Subdivision** | New projects, parser-normalized notation, fingerprints, JSON, CSV metadata, constructor output, and manufacturing output use the stable ID or public label as appropriate. | Historical `Kruschke` token only; exact token after tokenization, matched case-insensitively. |
| Panel-frame inset connection behavior | `inset_member_connection` | **Inset Member Connection** | New projects, BOM policy labels, member/hub schedules, JSON, CSV, constructor output, and manufacturing output use the stable ID or public label as appropriate. | Historical `GoodKarma` token only; exact token after tokenization, matched case-insensitively. |

The authoritative runtime registries are `BEHAVIOR_IDS`, `PUBLIC_BEHAVIOR_LABELS`, and `LEGACY_TOKEN_ALIASES` in `v6-integrity.js`. Legacy aliases are accepted only by parser/import normalization. They are not valid new output values, labels, filenames, presets, glossary terms, or marketing copy. Normalization is non-mutating and occurs before fingerprinting, persistence, and final JSON serialization.

The `inset_member_connection` behavior intentionally preserves the pre-migration panel-frame rules: two physical members per interior shared edge, one member per included boundary edge, and the existing beam-width/thickness deduction proxy with the unchanged 45% centerline clamp. Geometry, topology, BOM formulas, palettes, and export schemas are unchanged.

Remaining validation uncertainty: the subdivision label describes stored constructor intent; the current renderer still has no independently validated behavior-specific solver branch. Inset connection deductions and hub angular classifications remain preliminary, unvalidated proxies.

## Immediate acceptance criteria

Before modular extraction begins:

1. Every row above has an owner/status and at least one source locus.
2. Full Sphere, Hemisphere, and Custom Cap are visible choices.
3. BOM is a prominent tab and defaults open in Engineering mode.
4. Legacy naming tokens import successfully but are never emitted in new public UI or new project/export labels.
5. Save/load round trip preserves geometry, fabrication assumptions, palette, accent, animation speed, and waste factor.
6. Same inputs produce identical BOM totals and fingerprint.
7. Slider-driven expensive rebuilds are measured and categorized before optimization.
8. The public `/workbench` page accurately describes the deployed app.
