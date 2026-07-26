# Clean-Room Architecture

## Product identity

The product name is always **ARTEMIS Geometric Workbench**. Internal release versions must not appear in route or directory names.

## Layer boundaries

- **Configuration** owns validated user intent.
- **Dependency graph** determines which derived domains are stale.
- **Revision controller** owns mutation sequencing, stale-build rejection, and export eligibility.
- **Geometry kernel** will own mathematical geometry only.
- **Topology** will own vertices, edges, half-edges, faces, adjacency, and invariants.
- **Fabrication** will own panels, struts, hubs, sockets, dowels, joints, and tolerances.
- **Engineering** will own lengths, areas, volumes, masses, angles, and transparent calculation traces.
- **BOM/drawings/exporters** will consume the canonical completed model and never recompute geometry independently.
- **Renderers** will visualize canonical data but never become the source of engineering truth.

## Non-negotiable invariants

1. Configuration changes occur only through `setConfiguration(patch, source)`.
2. Fingerprints are invalidated synchronously on a semantic configuration mutation.
3. Completed revisions are immutable.
4. A build may commit only when its revision equals the current configuration revision.
5. Stale builds return `null` and log the required debug diagnostic; they never throw merely because they are stale.
6. Exports are blocked unless configuration and canonical model are clean and revision-aligned.
7. Configuration fingerprints are computed only from the normalized configuration captured for the completed revision.
8. Display-only changes may invalidate render state but must not alter engineering geometry or BOM.
9. Geometry, BOM, drawings, and exports must be reproducible from a saved project configuration and schema version.
10. No legacy runtime DOM, iframe, or Three.js mesh may serve as canonical engineering state.

## Delivery gates

### Gate A — Foundation
Typed configuration, deterministic normalization, mutation gateway, revisions, dependency graph, fingerprints, test harness.

### Gate B — Geometry Kernel
Vectors, planes, intersections, geodesic/Goldberg generation, immutable vertices/edges/faces, golden models.

### Gate C — Topology & Parametrics
Half-edge registry, canonical cyclic signatures, planarity, dependency-driven recomputation, model inspector.

### Gate D — Fabrication Intelligence
Panels, struts, hubs, sockets, dowels, joints, bend/cut data, tolerances, weights, families.

### Gate E — Documentation & Manufacturing
Plan/elevation/section/detail views, dimensions, schedules, BOM, STEP/3MF/DXF/SVG/CSV/project exports.

### Gate F — Production
Projects, persistence, undo/redo, revision compare, performance workers, diagnostics, security, release pipeline.

A gate advances only when its invariant and golden-model regression suites pass.
