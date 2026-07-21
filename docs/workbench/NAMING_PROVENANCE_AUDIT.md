# ARTEMIS Workbench — Naming and Provenance Audit

Status date: 2026-07-20

## Purpose

This document governs public terminology, legacy-import compatibility, and provenance review for ARTEMIS Geometric Workbench.

The objective is not to remove legitimate mathematical or engineering vocabulary. The objective is to prevent unclear attribution, implied third-party compatibility, and accidental reuse of names whose provenance or commercial significance has not been documented.

This is a product-governance document, not a legal opinion.

## Classification

Every visible or serialized term should be assigned one category:

1. **Generic technical term** — established mathematical or engineering language that may remain, preferably with plain-language UI assistance.
2. **ARTEMIS-owned product label** — terminology created and controlled for this product.
3. **Third-party attribution** — a person, product, organization, implementation, or named method requiring documented provenance and approved usage.
4. **Legacy compatibility token** — accepted only while loading older projects or constructor strings; never emitted in new UI or exports.
5. **Unresolved** — usage is blocked from new public surfaces pending review.

## Governing rules

1. Public UI labels must come from one centralized label registry.
2. Parser aliases must operate on exact tokens after tokenization; do not globally replace substrings.
3. Legacy aliases may be accepted on import but must normalize to stable ARTEMIS internal IDs.
4. New project files and exports must emit normalized IDs and ARTEMIS labels, not legacy third-party names.
5. Original source tokens may be retained only in import diagnostics when required for traceability.
6. Technical terms should not be replaced with less precise language inside calculation logic.
7. Marketing copy must not claim exact compatibility with a named third-party system unless that claim is documented and approved.
8. Removal of a visible label must not silently change geometry, connection assumptions, or BOM behavior.

## Historical Sprint 0B baseline and migration scope

The Sprint 0B baseline below records the pre-migration state and is retained as historical legacy documentation. The terminology migration then covered the canonical runtime (`public/labs/geometric-workbench/v5-8/index.html` and `v6-integrity.js`), public product page, focused integrity tests, generated-output paths, and Workbench documentation. Dependency, build, Git, and archived-backup content is outside the runtime corpus.

Stable identifiers below are authoritative locators. Line numbers may help navigation but are not the audit identity.

## Historical pre-migration occurrence classification

| Term | Generic technical vocabulary | Public-facing UI | Glossary / documentation | Parser / import compatibility | Export output | Internal implementation | Provenance / attribution finding |
|---|---|---|---|---|---|---|---|
| Kruschke | No disposition established as generic | `#constructorNotation` default; `#presetKruschke`; `#geoMethod` option; parser diagnostics can echo the token | `GLOSSARY_ENTRIES` item `Kruschke method`; `V6_BOM_INTEGRITY.md`; Workbench audit docs | `CONSTRUCTOR_TOKEN_SUPPORT.subdivisionMethod`; `CONSTRUCTOR_NOTATION_PRESETS.kruschke`; `parseConstructorNotation()` exact token branch; legacy constructor fields migrate through `migrateLegacyConstructorConfig()` | Can flow through `createProjectPayload()`, `exportConstructorJSON()`, `exportJSON()`, and `exportManufacturingJSON()` via constructor notation/profile; glossary JSON/CSV/print exports emit the glossary entry | Lowercase value `kruschke` is stored as `constructorProfile().subdivisionMethod`; `resetDefaults()` and preset wiring select it; integrity fixtures exercise it | **Provenance-sensitive.** The UI attributes the method to David Kruschke, but the repository contains no source/license/permission record or independently validated solver. It is not currently confined to legacy import. |
| GoodKarma | No evidence that this is generic fabrication vocabulary | `#constructorNotation` default; `#geoConnection` option; `CONNECTION_SYSTEMS.goodkarma.label` appears in constructor/BOM output; parser warnings can echo it | `GLOSSARY_ENTRIES` item `GoodKarma connection`; `V6_BOM_INTEGRITY.md`; Workbench audit docs | `CONSTRUCTOR_TOKEN_SUPPORT.connection`; `CONSTRUCTOR_NOTATION_PRESETS.kruschke`; `parseConstructorNotation()` connection branch; accepted case-insensitively as partial support | Can flow through project, constructor, BOM, manufacturing, member/strut, and glossary outputs via `constructorProfile().connection`, policy labels, instances, schedules, and glossary entries | `CONNECTION_SYSTEMS.goodkarma`; `connectionDeductionCm()` case `goodkarma`; `memberInstances()` applies panel-frame multiplicity; `resetDefaults()` selects it | **Provenance-sensitive.** No provenance/license record was found. It is also behavior-bearing: it selects a two-members-per-interior-edge assembly model and a deduction proxy, so later naming work must preserve semantics. |
| Class I | Established geodesic subdivision taxonomy | `#geoClass` option `I` | Combined `GLOSSARY_ENTRIES` item `Class I / II / III`; feature/BOM docs | Stored through constructor profile/project load; no dedicated parser token branch was found for textual `Class_I` | Constructor/project/BOM/manufacturing outputs may serialize `subdivisionClass: "I"` | Default in `constructorProfile()` / `resetDefaults()`; presently constructor metadata rather than a distinct audited renderer branch | Generic technical vocabulary; technically appropriate, but the UI currently exposes the technical label without a plain-language companion. |
| Class II | Established geodesic subdivision taxonomy | `#geoClass` option `II` (`Class II / Triacon`) | Combined glossary item and Workbench docs | Stored through constructor profile/project load; no dedicated `Class_II` parser branch was found | Same constructor/profile serialization path as Class I | Value is retained as metadata; no Class-II-specific geometry branch was found in `buildGoldberg()` | Generic technical vocabulary. `Triacon` was observed but is outside this sprint's requested term set and should receive a later provenance check. |
| Class III | Established geodesic h,k taxonomy | `#presetOcto`; `#geoClass` option `III`; `#geoHK`; constructor profile display | Combined glossary item; `V6_BOM_INTEGRITY.md`; Workbench docs | `CONSTRUCTOR_TOKEN_SUPPORT.classIII`; `CONSTRUCTOR_NOTATION_PRESETS.octo`; `parseConstructorNotation()` consumes `Class_III_h,k` and warns that equivalence is unvalidated | Constructor/project/BOM/manufacturing outputs may serialize `subdivisionClass: "III"` and `hk` | Parser and metadata handling exist; no independently validated Class-III renderer branch was found | Generic technical vocabulary, not a removal target. Accuracy risk is implementation equivalence, not naming ownership. |
| dual cells / dual cell | Established computational-geometry vocabulary | Header subline/badge; `#geoPolyhedron` help; top-plan SVG label; construction/schedule copy | `GLOSSARY_ENTRIES` items `Dual cells`, `Hexagon cell`, and `Pentagon cell`; `V6_BOM_INTEGRITY.md`; Workbench docs | Not a legacy parser alias | Appears in visible drawing/shop copy generated for output; no provenance-sensitive filename was found | `buildGoldberg()` constructs the geometric dual from incident triangle centers; stable topology method is `goldberg_shared_triangle_index` | Generic technical vocabulary. It may remain in technical contexts; “Polygon Cells” can later serve as a plain-language UI label without changing dual construction semantics. |
| dihedral | Established geometry/fabrication vocabulary | Inspector/detail tables, strut schedule, shop cards, manufacturing panels, and construction copy | `GLOSSARY_ENTRIES` item `Dihedral angle`; `V6_BOM_INTEGRITY.md`; product-page copy; Workbench docs | Not a parser compatibility term | JSON fields `dihedral` / `dihedralDeg`, CSV columns `dihedral_deg`, shop-card tables, and manufacturing output | `bevels[].dihedral`; topology `dihedralSamples`; `memberInstances().dihedralDeg`; solid/Goldberg side-wall calculations | Generic technical vocabulary. Retain in calculation and technical export metadata; a later UI alias must not obscure the exact angle definition. |
| bevel | Established fabrication vocabulary | Edge color/label options, inspector/detail tables, assumptions ledger, shop cards, BOM panel families, warnings, and notes | `GLOSSARY_ENTRIES` item `Saw bevel`; `V6_BOM_INTEGRITY.md`; product-page copy; Workbench docs | Not a parser compatibility term | JSON `bevels` / `sawBevelDeg`, CSV `saw_bevel_deg`, SVG/shop text, and filename `artemis_geodesic_coordinates_angles_bevels.csv` | `BOM_ASSUMPTIONS.bevelGroupingToleranceDeg`; `bevelSamples`; `sawBevel`; grouping keys and schedule fields | Generic fabrication vocabulary. It is technically appropriate internally and in explicit engineering exports; plain-language UI treatment can be considered later. |

## Surface-specific findings

### Public UI — migrated state

- Historical provenance-sensitive labels have been removed from controls, presets, examples, parser diagnostics, connection policy labels, constructor summaries, BOM tables, schedules, and glossary records.
- Class I/II/III, dual, dihedral, and bevel are used in technically recognizable contexts. Sprint 0B does not replace them.
- The public product page contains dihedral/bevel language but no Kruschke or GoodKarma occurrence.

### Parser and import compatibility — implemented boundary

- `parseConstructorNotation()` tokenizes before performing exact, case-insensitive legacy-alias lookup. Broad substring replacement is not used.
- Historical `Kruschke` normalizes to `timber_optimized_subdivision`; historical `GoodKarma` normalizes to `inset_member_connection`.
- `migrateLegacyConstructorConfig()` normalizes legacy field names, direct constructor/fabrication values, and notation values. Public diagnostics expose neutral IDs and labels, plus only a generic alias-normalized flag.
- `BEHAVIOR_IDS`, `PUBLIC_BEHAVIOR_LABELS`, and `LEGACY_TOKEN_ALIASES` are authoritative runtime registries in `v6-integrity.js`.

### Export output — migrated state

- Download filenames and the public product-page copy contain neither provenance-sensitive name; a regression guard now enforces that boundary.
- Project, constructor, BOM, manufacturing, member/strut, erection, glossary, JSON, and CSV output paths now receive normalized IDs and neutral labels. JSON output applies a final non-mutating behavior-normalization pass before serialization.
- Dihedral and bevel fields are intentional technical output and should not be globally removed.

### Internal implementation — preserved behavior

- The historical connection behavior was not label-only. It is now keyed by `inset_member_connection`; `CONNECTION_SYSTEMS`, `connectionDeductionCm()`, and `memberInstances()` preserve two interior members per shared edge, boundary rim policy, ownership tracing, and the existing deduction/clamp formula.
- `timber_optimized_subdivision` and Class I/II/III remain constructor metadata. No behavior-specific subdivision renderer branch was found in `buildGoldberg()`, so the neutral public wording continues to describe constructor intent rather than independently validated solver equivalence.
- Dihedral, bevel, and dual-cell names correspond directly to implemented geometry/topology fields and are not provenance-removal candidates.

## Risk register

| Risk | Severity | Evidence | Sprint 0B disposition |
|---|---:|---|---|
| Historical `Kruschke` label lacked a repository provenance record | High | Historical controls/preset/glossary and constructor/project/export paths | Mitigated: import-only alias; new surfaces use `timber_optimized_subdivision` / **Timber-Optimized Subdivision**. |
| Historical `GoodKarma` label was visible, serializable, and behavior-bearing | Critical | Historical control/glossary plus connection policy, multiplicity, deduction, schedules, and exports | Mitigated: import-only alias; behavior moved intact to `inset_member_connection` / **Inset Member Connection**. |
| Runtime and audit terminology could drift | High | Three registries govern IDs, labels, and aliases | Mitigated by exported registries, static public-surface guards, migration tests, and final-output normalization. |
| Class taxonomy suggests renderer variants not independently verified | Medium | Constructor metadata/parser exists; no matching renderer branches found | Retain technical terms with qualification; add algorithm-equivalence tests before stronger claims. |
| Generic technical terms could be over-corrected during naming work | Medium | dihedral/bevel/dual fields are calculation- and export-bearing | Protected by this classification; no global replacement. |

## Initial terminology register

| Term | Category | Public UI decision | Internal decision | Required action |
|---|---|---|---|---|
| Historical `Kruschke` | Legacy compatibility token | Removed from controls, presets, glossary, examples, and new exports | Exact case-insensitive alias to `timber_optimized_subdivision` | Complete; retained only in alias registry, migration tests, and this historical audit. |
| Historical `GoodKarma` | Legacy compatibility token | Removed from controls, presets, glossary, examples, and new exports | Exact case-insensitive alias to `inset_member_connection` | Complete; retained only in alias registry, migration tests, and this historical audit. |
| Class I | Generic technical term | Primary label: **Aligned Subdivision**; help: “Class I” | Preserve canonical ID such as `class_i` | Verify actual implementation and invariants. |
| Class II | Generic technical term | Primary label: **Alternating Subdivision**; help: “Class II” | Preserve canonical ID such as `class_ii` | Verify actual implementation and invariants. |
| Class III | Generic technical term | Primary label: **Skew Subdivision**; help: “Class III” | Preserve canonical ID such as `class_iii` | Verify actual implementation and invariants. |
| dual cells | Generic technical term | Primary label: **Polygon Cells** | Preserve dual construction semantics | Explain duality in glossary/help. |
| dihedral angle | Generic technical term | Primary label: **Panel Joint Angle** | Preserve calculation field and technical metadata | Add tooltip with technical term. |
| bevel | Generic fabrication term | Primary label: **Edge Cut Angle** | Preserve calculation semantics | Standardize label across BOM, inspector, shop cards, and exports. |
| Goldberg | Generic/historical mathematical attribution requiring documentation review | Retain only where mathematically accurate and properly contextualized | Preserve model identity if required | Document usage and avoid implying ownership. |
| Platonic / Archimedean | Established mathematical classifications | Retain | Preserve | No immediate removal; ensure descriptions are accurate. |
| ARTEMIS | Product label | Retain | Preserve | Confirm brand usage and product naming consistency. |

## Final stable IDs and labels

```js
const LEGACY_TOKEN_ALIASES = Object.freeze({
  kruschke: 'timber_optimized_subdivision',
  goodkarma: 'inset_member_connection'
});

const PUBLIC_BEHAVIOR_LABELS = Object.freeze({
  timber_optimized_subdivision: 'Timber-Optimized Subdivision',
  inset_member_connection: 'Inset Member Connection'
});
```

These names are final for the current migration schema. Stable IDs are intended to outlive future wording changes.

## Safe normalization contract

```js
function normalizeConstructorToken(rawToken) {
  const sourceToken = String(rawToken ?? '').trim();
  const lookupToken = sourceToken.toLowerCase();
  const normalizedToken = LEGACY_TOKEN_ALIASES[lookupToken] ?? lookupToken;

  return {
    sourceToken,
    normalizedToken,
    legacyAliasUsed: normalizedToken !== lookupToken
  };
}
```

Requirements:

- Tokenization occurs before normalization.
- Matching is exact and case-insensitive.
- The parser records whether a legacy alias was used.
- New saves and exports emit `normalizedToken` only.
- Import diagnostics may report that a legacy alias was normalized, without displaying that legacy term elsewhere in normal UI.

## Surfaces to audit

The naming sweep must cover:

- visible controls and option labels;
- quickbar and preset names;
- glossary entries;
- help text and tooltips;
- HUD and inspector text;
- BOM overview and schedules;
- shop cards and drawing labels;
- JSON, CSV, SVG, DXF, and manufacturing exports;
- project save/load schema;
- constructor parser examples;
- tests and fixtures;
- product-page and marketing copy;
- accessibility labels and announcements;
- filenames generated for downloads.

## Required tests

### Legacy import

- A fixture containing each legacy token loads successfully.
- The normalized internal ID is correct.
- Geometry and BOM totals match the approved pre-normalization fixture.
- Saving the loaded project emits no legacy third-party label.

### Public output

- New projects contain no blocked public terms.
- Visible UI contains no blocked public terms.
- BOM and manufacturing exports contain normalized IDs and approved labels.
- Glossary and tooltips use approved terminology.

### Behavioral non-regression

- Terminology changes do not alter geometry.
- Terminology changes do not alter connection assumptions.
- Terminology changes do not alter BOM quantities, cut lengths, mass, validation status, or fingerprint except where the fingerprint intentionally includes normalized schema identifiers.

## Audit checklist

- [x] Search canonical runtime, product page, tests, documentation, and repository source for every requested term.
- [x] Record stable file/function/constant/element loci, surface class, and behavior for each occurrence family.
- [x] Separate display labels from stable internal IDs.
- [x] Introduce exact-token alias mapping.
- [x] Replace public labels using the centralized registry.
- [x] Update glossary and examples.
- [x] Update exports and project schema documentation.
- [x] Add regression coverage for current case-insensitive legacy-token parser behavior.
- [x] Add public filename and product-marketing absence tests for provenance-sensitive names.
- [x] Review product and support-page copy in the audited corpus.
- [x] Record unresolved provenance-sensitive terms and current emission paths.

## Release gate

Naming normalization is complete only when:

1. all third-party or unresolved labels have an explicit disposition;
2. legacy projects continue to load;
3. public UI and new exports use only approved ARTEMIS or generic technical terminology;
4. calculation behavior and BOM totals are unchanged;
5. tests prove both backward compatibility and public-output hygiene.
