# ARTEMIS v3.6.1 Dowel/Socket System — Connector Semantics Extraction & Behavior Fixtures

**Purpose:** Reference package for Workbench Release 6.2B-1 (parity port of the archived
connector system). Fulfils the "extract connector semantics / build behavioral fixtures"
preparation steps of the approved plan. No semantics recreated from memory — every statement
below is verified against executed archive code.

**Source:** `ARTEMIS_v3_6_1_download.html` (archived single-file application, 3 inline scripts,
all pass `node --check`).
**Method:** Geometry pipeline transplanted verbatim into `generate-fixtures.js` (Node + three.js
r0.128). Only DOM parameter reads were replaced by injected configuration. An independent audit
layer computes ground-truth values the archive does not compute.
**Units:** centimetres, degrees (legacy convention).

## Verified connector semantics

- Parameters: `dowelDia` (4), `dowelDepth` (8), `gapTol` (0.05, stored as `fitAllowance`), and `toolDia` (0.635 = ¼ inch).
- `connectorMode`: `off / sockets / dowels / both`; rendering only. Connector specs are generated for every edge.
- Placement: exactly one connector per panel edge at the side-wall quadrilateral centroid.
- Drill axis: perpendicular to the side wall using its Newell normal.
- Local datum: origin at inner vertex, X along the inner edge, Y toward the outer face; `sideFace2D` contains the wall development and hole coordinates.
- Dome cut: whole-cell centroid inclusion; no geometric clipping.
- Winding: ordered perimeter is reversed before shell construction.
- Mating: shared outer-vertex-pair keys; boundary edges are open.
- Not present: multi-dowel spacing, end offsets, embedment A/B, separate hole and dowel diameters, minimum edge distance, or procurement calculations.

## Joint model and archived angle label

The archive builds radial ruled side walls. Mating walls are geometrically coincident by construction. The archived label **Saw Bevel** is not a direct edge-butt machine setting. The physically meaningful value is wall tilt from square. The v6 port must preserve legacy values for parity while exposing explicit, unambiguous angle conventions for fabrication.

## Legacy defects that must not be carried forward

1. The socket renderer silently clamps depth while the manufacturing schedule reports the requested unclamped depth. The port must report breakthrough explicitly.
2. `fitAllowance` is recorded but not applied. Applying it to hole diameter is a documented engineering correction, not a parity result.
3. Connector ownership is ambiguous. Sockets are half-edge-owned; physical dowels are internal-physical-edge-owned; boundary policy must be explicit.

## Fixture matrix

Eight configurations cover full spheres at frequencies 1–4 and centroid-cut domes. Full spheres satisfy the closed Goldberg counts and Euler characteristic 2. Cut domes give Euler characteristic 1. Fixtures include topology counts, connector counts, areas, volumes, wall-coincidence audits, angle residuals, planarity, and representative connector specifications.

Headline values include an F2 hexagon planarity deviation of approximately 0.495 cm at radius 150 cm and the F3 cut-0 case with 304 panel-side connector specs, 34 boundary specs, and 135 internal physical edges.

## Port parity requirements

Release 6.2B-1 must reproduce counts, areas, volumes, sample connector centers and axes, local datum coordinates, side-wall developments, legacy angle fields, mating annotations, and radial-wall residuals within the tolerances documented by the fixture generator. New validation is asserted in addition to parity, not instead of it.
