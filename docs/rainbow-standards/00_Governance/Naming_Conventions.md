# Naming Conventions

## Canonical System Names

| Acronym | Name | Meaning |
| --- | --- | --- |
| RBSM | Rainbow Botanical Standards Manual | This documentation set. |
| RBS | Rainbow Botanical Specification | Required record standard for each specimen. |
| RBDS | Rainbow Botanical Design System | Design tokens, components, and layout conventions. |
| ABTE | Adaptive Botanical Theme Engine | Species, habitat, season, and mode-aware theming. |
| RVAS | Rainbow Visual Asset Specification | Output standard for posters, blueprints, heritage sketches, social assets, and video. |
| RBPS | Rainbow Botanical Production System | End-to-end production workflow. |
| PFP | Prismaflora Foundry Pipeline | Canonical named production pipeline for AI-assisted generation. |
| BDT | Botanical Digital Twin | Persistent specimen-level knowledge object. |
| RKA | Rainbow Knowledge Architecture | The 12-domain knowledge model. |

## Specimen IDs

Specimen IDs use:

```text
RB-{year}-{sequence}
```

Example:

```text
RB-2026-00071
```

Rules:

- IDs are assigned at intake.
- IDs do not change if the plant is re-observed in later years.
- A clonal colony or dense patch can be one specimen when individual separation is not
  practical, but the scope must be stated.
- Public assets may use a public-safe alias if the specimen location is private.

## File and Slug Names

- Species slugs use lowercase binomial names: `hemerocallis-fulva`.
- Reference implementation folders use title case with underscores:
  `Hemerocallis_fulva`.
- Public page paths should use the approved launch pattern:
  `/rainbowbotanics-2026/{species-slug}`.
- Draft local assets should include specimen ID and mode:
  `RB-2026-00071_blueprint_v001.png`.

## Claim Labels

Every factual or interpretive claim that could affect credibility should carry a source
status:

```text
verified | historical | traditional | interpretive | needs_source
```

## Visual Mode Names

Approved mode names:

- Overview
- Scientific Herbarium
- Blueprint Engineering
- Heritage Illustration
- Photographic Plate
- Ecology Network
- Cultural Atlas
- Atlas Digital Twin
- Social Package
