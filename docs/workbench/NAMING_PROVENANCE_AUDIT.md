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

## Initial terminology register

| Term | Category | Public UI decision | Internal decision | Required action |
|---|---|---|---|---|
| Kruschke | Unresolved third-party attribution / legacy token | Remove from controls, presets, glossary, examples, and new exports | Map exact legacy token to `timber_optimized_v1` | Verify all occurrences and preserve legacy import fixture. |
| GoodKarma | Unresolved third-party attribution / legacy token | Remove from controls, presets, glossary, examples, and new exports | Map exact legacy token to `inset_connection_v1` | Verify all occurrences and preserve legacy import fixture. |
| Class I | Generic technical term | Primary label: **Aligned Subdivision**; help: “Class I” | Preserve canonical ID such as `class_i` | Verify actual implementation and invariants. |
| Class II | Generic technical term | Primary label: **Alternating Subdivision**; help: “Class II” | Preserve canonical ID such as `class_ii` | Verify actual implementation and invariants. |
| Class III | Generic technical term | Primary label: **Skew Subdivision**; help: “Class III” | Preserve canonical ID such as `class_iii` | Verify actual implementation and invariants. |
| dual cells | Generic technical term | Primary label: **Polygon Cells** | Preserve dual construction semantics | Explain duality in glossary/help. |
| dihedral angle | Generic technical term | Primary label: **Panel Joint Angle** | Preserve calculation field and technical metadata | Add tooltip with technical term. |
| bevel | Generic fabrication term | Primary label: **Edge Cut Angle** | Preserve calculation semantics | Standardize label across BOM, inspector, shop cards, and exports. |
| Goldberg | Generic/historical mathematical attribution requiring documentation review | Retain only where mathematically accurate and properly contextualized | Preserve model identity if required | Document usage and avoid implying ownership. |
| Platonic / Archimedean | Established mathematical classifications | Retain | Preserve | No immediate removal; ensure descriptions are accurate. |
| ARTEMIS | Product label | Retain | Preserve | Confirm brand usage and product naming consistency. |

## Proposed internal IDs and labels

```js
const LEGACY_TOKEN_ALIASES = Object.freeze({
  kruschke: 'timber_optimized_v1',
  goodkarma: 'inset_connection_v1'
});

const ARTEMIS_PUBLIC_LABELS = Object.freeze({
  timber_optimized_v1: 'Timber-Optimized Subdivision',
  inset_connection_v1: 'Inset Member Connection',
  class_i: 'Aligned Subdivision',
  class_ii: 'Alternating Subdivision',
  class_iii: 'Skew Subdivision',
  dual_cells: 'Polygon Cells',
  dihedral_angle: 'Panel Joint Angle',
  bevel_angle: 'Edge Cut Angle'
});
```

These names are provisional until the code audit confirms that each label accurately describes the implemented behavior.

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

- [ ] Search source for every term in the register.
- [ ] Record file, line/function, surface, and behavior for every match.
- [ ] Separate display labels from stable internal IDs.
- [ ] Introduce exact-token alias mapping.
- [ ] Replace public labels using the centralized registry.
- [ ] Update glossary and examples.
- [ ] Update exports and project schema documentation.
- [ ] Add legacy import fixtures.
- [ ] Add public-output absence tests.
- [ ] Review product and support-page copy.
- [ ] Record unresolved terms and block them from new releases.

## Release gate

Naming normalization is complete only when:

1. all third-party or unresolved labels have an explicit disposition;
2. legacy projects continue to load;
3. public UI and new exports use only approved ARTEMIS or generic technical terminology;
4. calculation behavior and BOM totals are unchanged;
5. tests prove both backward compatibility and public-output hygiene.
