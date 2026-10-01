# ADR-007 - Sala Rotonda Retention and Review

- **Status:** Accepted
- **Date:** 2026-10-01
- **Extends:** ADR-006

## Context

`/departments/art/sala-rotonda` ("Octavian Rotunda", Artemis Art) is a public route that
iframes an external `*.chatgpt.site` host. The Phase 1 inventory (PR #67, item C9) flagged
two problems:

- the route was indexable while serving externally hosted content that Artemis does not
  build or review in this repository;
- `departments/art` is not a division in `ENGINEERING/DIVISION_REGISTRY.yaml`, so the route
  sits outside the multi-division model adopted in ADR-006.

The owner decided in PR #67 to add noindex, keep the route, leave the iframe target
unchanged, not delete anything, and record a follow-up ADR. PR #68 applied the noindex
metadata (`robots: { index: false, follow: false }`). The product registry entry
`sala-rotonda` records `visibility: noindex_review` with every other classification
`UNREVIEWED`.

## Decision

Sala Rotonda is retained as a noindex public route until a hosting and content review is
completed.

- The noindex metadata applied in PR #68 stays in place.
- The external iframe target is under review. Until the review completes, it is neither
  changed nor promoted.
- `departments/art` is not recognized as a division. The route has no owning division or
  product family until the owner chooses one of the outcomes below.

### Owner follow-up

After the hosting and content review, the owner chooses one of:

- **(a) Keep:** retain the route and register a new division or product family for it
  through a Division Registry change and, if needed, a further ADR;
- **(b) Redirect:** redirect the route to a registered product;
- **(c) Remove:** remove the route, with the removal recorded in the Product Registry.

## Consequences

- The route stays reachable by URL but is excluded from search indexing.
- The `sala-rotonda` registry entry stays `UNREVIEWED` for division, family, lifecycle,
  maturity and data mode until the owner follow-up is recorded.
- Agents must not change the iframe target, promote the route, or link it from indexed
  navigation while the review is open.

## Non-goals

This ADR does not:

- change the route, its metadata or its iframe target;
- create an Art division or product family;
- evaluate the external host's content;
- modify any registry YAML.
