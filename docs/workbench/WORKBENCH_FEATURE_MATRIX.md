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

## Geometry and structure extent

| Feature | User-facing locus | Internal locus / state | Status | Test needed | Naming risk / notes |
|---|---|---|---:|---|---|
| Full sphere | Model & Geometry | `viewMode` non-dome path | Verified functional | Browser smoke test | Rename visibly to **Full Sphere**. |
| Dome cap | Model & Geometry | `viewMode='dome'` plus `cut` | Verified functional | Browser smoke test | Present but terminology is technical. |
| Hemisphere | Derived dome preset | `viewMode='dome'` plus hemisphere cut value | Partially functional | Preset/metric verification | Expose directly as **Hemisphere**. |
| Custom dome cap | Model & Geometry | `cut` control | Verified functional | Extreme-value test | Rename `Dome Cut` to **Custom Cap** workflow. |
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
| Preliminary BOM overview | Bottom workspace / generated HTML | Verified functional | Determinism fixture | Must become a clearly visible top-level tab. |
| Panel families | BOM | Verified functional | Quantity/area fixture | Includes family quantity, area, volume, edges, and cut angles. |
| Member schedule | BOM / exports | Verified functional | Count and length fixture | Includes raw, net, deductions, and waste-adjusted totals. |
| Hub schedule | BOM | Verified functional | Valence and class fixture | Angular classifications remain preliminary. |
| Rim policy | BOM / constructor | Verified functional | Policy matrix | Distinguish member rim and continuous ring behavior. |
| Material / grade | Fabrication / BOM | Verified functional | Save/load/export test | Editable assumption. |
| Density | Fabrication / BOM | Verified functional | Mass recomputation test | Must not trigger topology rebuild after state separation. |
| Waste factor | Fabrication / BOM | Verified functional | Boundary and persistence test | Default is 10%; editable preliminary assumption. |
| Surface area / shell volume / mass | BOM | Verified functional | Unit consistency test | Verify centimeter/meter conversion boundaries. |
| Configuration fingerprint | BOM/project/export | Verified functional | Stable same-input test | Same inputs should yield identical fingerprint and totals. |
| Connection deductions | BOM engine | Partially functional | Connection-specific fixture | Explicitly preliminary and unvalidated. |
| Connector hardware quantities | BOM | Pending | — | Bolts, plates, sleeves, brackets, welds, and fasteners. |
| Stock-length optimization | BOM/procurement | Pending | — | Cut planning and procurement quantities. |
| Cost and supplier columns | BOM/procurement | Pending | — | Future commercial/procurement layer. |

## Project persistence and exports

| Feature | Locus | Status | Test needed | Notes |
|---|---|---:|---|---|
| Save project JSON | Project actions | Implemented; QA pending | Save → reload round trip | Schema is `artemis-project-6.0-alpha`. |
| Load project JSON | Project actions | Implemented; QA pending | Current + legacy fixtures | Legacy-token normalization required. |
| Palette/accent persistence | Project JSON | Verified in source | Round-trip test | Includes legacy palette fallback. |
| Animation speed persistence | Project JSON | Verified in source | Round-trip test | — |
| Waste-factor persistence | Project JSON | Verified in source | Round-trip test | — |
| BOM JSON | Export | Verified functional | Schema fixture | Includes disclaimer, units, assumptions, warnings. |
| CSV exports | Export | Verified functional | Column/escaping test | Confirm large-model behavior. |
| Manufacturing JSON | Export | Verified functional | Schema fixture | Clarify validated vs preliminary fields. |
| SVG/DXF/shop cards | Export | Implemented; QA pending | Download and open each format | Exact capability and completeness should be inventoried. |
| Autosave/recovery | Project system | Pending | — | Add after schema audit. |
| Revision history/comparison | Project system | Pending | — | Named versions and BOM deltas. |

## Validation, diagnostics, and quality

| Feature | Status | Test needed | Notes |
|---|---:|---|---|
| Topology validation | Verified functional | Geometry invariant suite | Extend to non-manifold, disconnected, winding, duplicate-vertex, and boundary diagnostics. |
| Parser diagnostics | Implemented; QA pending | Invalid/conflicting token tests | Must show visible error banners, not only console output. |
| Engineering disclaimer | Verified functional | Export/UI presence test | Production dimensions require engineering review and shop validation. |
| Accessibility | Partially functional | Keyboard, ARIA, contrast, reduced motion | Establish WCAG-oriented acceptance criteria. |
| Performance mode | Pending | — | Disable expensive effects, shadows, dense labels, and live rebuilds. |
| Debounced expensive inputs | Pending / audit required | Slider benchmark | Categorize geometry-, fabrication-, visual-, and layout-only changes. |

## Support and product integration

| Feature | Status | Test needed | Notes |
|---|---:|---|---|
| Product Home link | Verified functional | Click test | Routes to `/workbench`. |
| Squarespace support link | Implemented; QA pending | Modal, popup, fallback | Canonical destination is `https://www.agoraxai.com/support`. |
| Amount/frequency prefill | Unconfirmed | End-to-end support flow | Do not claim until verified. |
| Product-page feature copy | Partially current | Content audit | Update version, palette count, BOM, save/load, and export language. |

## Naming and provenance priority

| Current term | Public treatment | Internal/backward compatibility | Priority |
|---|---|---|---:|
| Kruschke | Remove from new public UI, glossary, presets, and exports | Accept exact legacy token and normalize | Critical |
| GoodKarma | Remove from new public UI, glossary, presets, and exports | Accept exact legacy token and normalize | Critical |
| Class I / II / III | Use plain-language UI labels; retain standard technical term in help/docs | Preserve canonical technical identity | Medium |
| dual cells | Display **Polygon Cells**; explain dual relationship in help | Preserve geometry meaning | Low |
| dihedral angle | Display **Panel Joint Angle**; retain technical term in help/export metadata where useful | Preserve calculation semantics | Low |
| bevel | Display **Edge Cut Angle** or **Cut Angle** | Preserve fabrication semantics | Low |

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
