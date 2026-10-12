# ADR-021: HVAC product catalog module location

## Status

Proposed (2026-10-11)

## Context

The HVAC-to-MEP program (P1, concern HVAC-P1-PRODUCTS) introduces a normalized PRODUCTS catalog with quantity/cost lineage into the RC8.11 bridge. The catalog is a new data module needing a home that does not disturb the single-file standalone app or existing product boundaries.

## Decision

The product catalog lives in a new top-level products/ directory: schema, driver registry, sample rows, fixtures, validation tools (products/tools/). Consumed by build/test tooling; the standalone app file is not restructured. Cross-discipline interfaces (plumbing, fire suppression) are stubbed in the schema from P1 to avoid HVAC-only architecture.

## Consequences

- New top-level folder scoped to one product concern; no routing, build, or product-boundary changes.
- Future disciplines extend the schema rather than creating parallel catalogs.
- Revisit if the catalog grows into a shared cross-product service.
