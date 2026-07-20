# ARTEMIS Geometric Workbench v6.0.0-alpha — BOM Integrity

## Scope and architecture

This alpha separates geometric topology from physical member quantity. Geometry builders attach stable endpoint references to every local face edge. `buildTopologyRegistry()` creates canonical vertices, edges, and faces before `memberInstances()` applies the selected connection and rim policies. Grouping occurs only after physical instances exist.

The public route remains `/labs/geometric-workbench/v5-8/`; the visible build identity is `v6.0.0-alpha`.

The calculation flow is:

1. Generate cells and stable local `edgeRefs`.
2. Build and validate the canonical topology registry.
3. Apply the connection system and boundary policy to canonical edges.
4. Create traceable physical member instances.
5. Group instances using explicit tolerances.
6. Calculate preliminary section volume and mass.
7. Generate a deterministic SHA-256 configuration fingerprint.

## Topology identity by builder

### Uniform-solid builder

Uniform solids use the integer indices already present in `UNIFORM_SOLIDS[*].face`. Vertex IDs are `UV-000001`-style IDs derived from the source vertex index. Winding reversal reverses the vertex-ID list with the geometry, preserving endpoint correspondence. No floating-point comparison or coordinate quantization is used.

### Geodesic / Goldberg dual builder

Each dual-cell vertex is an existing subdivided triangular face center. The builder now preserves that triangle's stable `fi` index while sorting incident centers. Vertex IDs are `GV-000001`-style IDs derived from the shared triangle index. Adjacent dual cells therefore reference the same endpoint IDs. No coordinate quantization is used.

### Coordinate fallback

Coordinate fallback was not required. The quantization tolerance is `null`. A future builder lacking shared source identity must normalize and quantize deliberately, detect collisions, and fail validation rather than use raw floating-point strings.

## Canonical topology registry

Each canonical edge stores endpoint IDs, adjacent cells/local edges, centerline/outer/inner length, manifold class, bevel and dihedral samples, and reserved ring/zone references. Classification is based on adjacent face count:

- one: boundary;
- two: interior;
- more than two: nonmanifold and `FAIL`.

Validation also fails for missing endpoints, zero-length edges, inconsistent adjacent lengths, nonexistent vertices, duplicate local edge references, identity collisions, and malformed boundary loops. Boundary-loop detection requires boundary valence two. Surface component count is recorded; disconnected surfaces are not assigned the genus-zero expected Euler value.

For supported connected convex surfaces, validation uses:

`χ = V − E + F = 2 − 2g − b`

The alpha assumes `g = 0` only for supported convex closed solids and connected convex caps. Closed solids expect `χ = 2`; one-boundary caps expect `χ = 1`.

## Edge multiplicity and rim policies

Physical member quantity is not raw face-edge slots and is not always canonical edge count:

`physical members = Σ(canonical edges by class × active multiplicity)`

| Connection | Assembly model | Interior multiplier | Boundary default | Deduction |
| --- | --- | ---: | ---: | --- |
| Piped | shared strut | 1 | rim policy | unvalidated proxy |
| GoodKarma | panel frame | 2 | rim policy | unvalidated proxy |
| Semicone | shared strut | 1 | rim policy | unvalidated proxy |
| Cone | shared strut | 1 | rim policy | unvalidated proxy |
| Joint / Flush | shared strut | 1 | rim policy | unvalidated proxy |

GoodKarma is treated as a preliminary Artemis panel-frame mapping. Its two interior instances retain the owning adjacent cell and local edge. Shared-strut instances retain both adjacent cell IDs.

Rim policies are:

| Policy | Boundary member multiplier | Material reporting |
| --- | ---: | --- |
| Boundary members | 1 | individual members included |
| Continuous rim / bottom plate | 0 | boundary perimeter reported separately |
| Excluded | 0 | boundary perimeter remains visible, member BOM excludes it |

`Align Base = Flat` does not silently remove boundary members. When flat alignment and individual members are both active, the UI warns that a continuous rim may replace them only after explicit selection.

## Assumptions ledger

`BOM_ASSUMPTIONS` makes the previously implicit grouping and clamp rules visible:

- member length grouping tolerance: 1 mm;
- bevel grouping tolerance: 0.1°;
- maximum connection deduction: 45% of centerline length;
- topology identity: shared source index;
- coordinate quantization: not used.

Every deduction record exports requested deduction, applied deduction, clamp limit, clamp activation, and the proxy-rule note. All connection deduction models remain unvalidated. No member is presented as a final shop-cut dimension.

## Materials limitations

Only two section families are supported:

- rectangular solid: width × thickness;
- circular hollow section: annular area from outside diameter and editable wall thickness.

The default pipe wall is 4 mm. Density is an editable, visible preliminary assumption. Selecting `piped` exposes the circular hollow section and a visible density value; the output does not silently treat a pipe as a solid circle or claim accurate material mass.

The alpha does not provide procurement pricing, structural certification, connector solids, code compliance, material-grade certification, or final fabrication dimensions.

## Constructor Notation Interoperability and Legacy Migration

The public feature name is **Constructor Configuration Parser**:

> Imports common dome-construction notation and converts it into an Artemis project configuration.

Parsing is independent token-level interoperability, not official compatibility or complete project interchangeability. Parsed values, warnings, unsupported tokens, and applied fields are visible before application.

### Compatible-token matrix

| Category | Examples | Mapping |
| --- | --- | --- |
| Dome fraction | `1/2`, `5/8`, `7/12` | dome fraction and cut plane; clamp warning when required |
| Subdivision method | `Kruschke`, `Mexican`, `Equal_Arcs`, `Equal_Chords` | Artemis method selector; renderer equivalence is still engine-dependent |
| Frequency | `2V`, `3V`, `4V` | supported 1V–7V frequency |
| Radius | `R2.20`, `R3.00` | metres converted to active centimetre model units; interpretation warning shown |
| Beam section | `beams_120x40` | rectangular width and thickness |
| Symmetry / spin / alignment | `Pentad`, `Cross`, `Triad`, `cw`, `ccw`, `align_flat` | corresponding Artemis fields |

### Partial-support matrix

| Category | Examples | Limitation |
| --- | --- | --- |
| Base polyhedron | `Icosahedron`, `Octahedron`, `Octohedron`, `Tetrahedron` | selects a supported family; subdivision behavior varies by engine; `Octohedron` is a deprecated spelling alias |
| Class III | `Class_III_1,2` | h,k parses; geometric equivalence is not independently validated |
| Connection | `GoodKarma`, `Semicone`, `Piped`, `Cone`, `Joint` | preliminary Artemis profile; deduction models are unvalidated proxies |
| Fullerene intent | `Inscribed_Fulleren`, `Circumscribed_Fullerene` | intent is retained; complete geometric equivalence is not implemented for every family; filler token `on` is reported as unsupported |

GoodKarma is classified as a preliminary Artemis mapping/compatibility alias, not verified third-party compatibility.

### Artemis extensions

| Token | Applied field |
| --- | --- |
| `rim_continuous`, `rim_member`, `rim_excluded` | boundary/rim policy |
| `material_S355` | visible material label metadata |
| `pipewall_4` | pipe wall thickness in mm |
| `density_7850` | preliminary density in kg/m³ |

### Unsupported-token behavior

Unknown segments are never silently discarded. They appear in `unsupportedTokens`, produce a visible warning such as `Unknown token XYZ was not applied`, and do not mutate controls. Diagnostics offer Apply recognized values, Review parsed values, Cancel, and Copy diagnostics.

### Parser result contract

Parser results include source and normalized notation, recognized/partial/unsupported/ambiguous tokens, warnings, errors, applied configuration, and parser version `artemis-constructor-parser-1.0.0`. Token records include token, category, parsed value, applied field, and support classification.

### Legacy migration

Legacy `acidomeHash` and `sourceHash` fields are read only by `migrateLegacyConstructorConfig()`. They migrate to `constructorNotation` and `sourceNotation`, emit one migration notice, and are deleted from the canonical object. New project/export schemas never write them as primary fields. Optional provenance is limited to `legacyCompatibility`.

Legacy and canonical inputs are normalized before fingerprinting; regression tests confirm identical full SHA-256 fingerprints.

### Attribution statement

Artemis supports selected conventions commonly used in dome-construction configuration strings. Support is implemented independently as token-level interoperability. Names of third-party methods, systems or products remain the property of their respective owners. Parsing a token does not certify geometric, structural or fabrication equivalence.

## Configuration fingerprint

`canonicalStringify()` recursively sorts object keys and excludes undefined fields. `configurationFingerprint()` hashes the canonical UTF-8 JSON with Web Crypto SHA-256. The UI displays the first 12 hexadecimal characters; JSON and CSV exports include the complete hash, abbreviated hash, engine/parser versions, timestamp, assumptions, validation summary, and parser diagnostics.

Calculation-relevant geometry, fabrication, parser, assumptions, and engine fields are included. Legacy names are never fingerprint inputs.

## Hub schedule foundation

Canonical vertices record incident edges, normalized incident member directions, neighboring cells, and boundary status. The preliminary hub schedule groups by valence, boundary/interior class, and connection type. Equal valence is explicitly not claimed to imply equal manufacturable hub geometry; angular classification remains future work.

## Regression evidence

Focused Vitest harness: `tests/unit/geometricWorkbenchV6Integrity.test.ts`.

| Model | V | Canonical E | F | Raw slots | Boundary E | χ | Piped / Semicone / Cone / Joint | GoodKarma |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Icosahedron | 12 | 30 | 20 | 60 | 0 | 2 | 30 | 60 |
| Truncated icosahedron | 60 | 90 | 32 | 180 | 0 | 2 | 90 | 180 |
| 7/12 3V Goldberg dome cap | 118 | 169 | 52 | 304 | 34 | 1 | 169 with boundary members; 135 otherwise | 304 with boundary members; 270 otherwise |

The 7/12 cap has 135 interior edges, 34 boundary edges, one boundary loop, no nonmanifold edges, and no unresolved vertices. Continuous-rim and excluded policies remove the 34 boundary member instances but retain the separately reported boundary perimeter.

Parser tests cover fully recognized input, GoodKarma partial support, Class III/spelling aliases/fullerene intent, unsupported tokens, and legacy migration/fingerprint equivalence. Traceability tests verify every member resolves to a canonical edge, both endpoint vertices, adjacent cells, and the explicit clamp assumption. CHS tests verify annular area.

Current focused result: 14 tests passed, 0 failed. The harness also proves Artemis-extension parsing, required route/tab/export hooks, external support navigation, and that nonmanifold edges/shared-ID position collisions produce `FAIL` without tolerance widening.

Repository verification result: 57 tests passed across four test files, 0 failed. `next build` compiled, type-checked, generated all 88 static pages, and retained `/labs/geometric-workbench/v5-8` as a static route.

## Remaining limitations

- Connection deductions are geometric/proxy rules, not validated connector geometry.
- Material properties are user-editable assumptions, not certified specifications.
- Hub grouping does not yet compare full angular configurations.
- Ring geometry is reported as perimeter only; no plate section or splice model exists.
- The parser does not promise complete third-party project interchange.
- Browser screenshot and console evidence require an available browser backend in the execution environment.
- Procurement, costing, waste factors, stock optimization, structural analysis, and code compliance are out of scope.

Approved product language:

> This selected geometry contains a validated set of canonical geometric edges. Physical member quantities are derived from the active assembly model, connection multiplicity and boundary policy. Constructor notation is parsed through an Artemis-owned interoperability layer. Geometry counts are topology-validated; connection deductions, material properties and fabrication assumptions remain preliminary.
