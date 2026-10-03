# ADR-017 - Contextual Design Language

- **Status:** Accepted
- **Date:** 2026-10-02
- **Extends:** ADR-006, ADR-015

## Context

The site has grown to include multiple divisions with very different subject matter:
construction intelligence, financial forecasting, botanical, atlas, media. Today most
pages reuse a similar card/layout grammar regardless of subject. A finance page and a
construction page look the same. That weakens comprehension and the sense that each
division is genuinely specialized.

## Decision

Every page must present its subject in a visual grammar native to that subject.

Examples of native grammars:

- Plumbing / mechanical: pipe schematics, P&ID, schedule tables, takeoff lists
- Construction: geometry views, quantity tables, cashflow waterfalls, 4D schedule
  sequence, BOM trees
- Forecasting / finance: plots, projections, dashboards, correlation matrices, variance
  tables, governing equations, cashflow waterfalls
- Atlas / places: maps, KML layers, spatial timelines, coordinate tables
- Botanical: taxonomy trees, specimen plates, seasonal cycles
- Media / AI generation: storyboards, prompt chains, output galleries
- Governance: dependency graphs, ADR timelines, registry tables

Each product and division declares its native grammar(s) in its registry entry or
feature passport under a new optional field:

```yaml
native_visuals: [list of visual types]
```

A page that has no native visuals assigned defaults to the site shell grammar (text +
cards). It does not fabricate a visual grammar.

## Consequences

- Design work must ask "what visuals are native to this subject?" before "how do I make
  this pretty?"
- The registry (or feature passports) gains an optional `native_visuals` field. This ADR
  proposes the field; it is **not** applied to any schema in the PR that adds this ADR.
  It is applied in a follow-up registry PR.
- 3D scenes must map to a native visual type. A 3D scene that does not represent a
  native grammar of its subject is rejected in review.
- The site shell (hero, nav, footer, general copy) remains brand-consistent. Only the
  body of a page changes per subject.

## Non-goals

- Not a mandate to build every possible visual type.
- Not a design system replacement. Existing components remain.
- Not a reason to add 3D to every page. Native visuals can be 2D.

## References

ADR-006 (multi-division product architecture), ADR-015 (immersive layer), the owner's
design direction 2026-10-02.
