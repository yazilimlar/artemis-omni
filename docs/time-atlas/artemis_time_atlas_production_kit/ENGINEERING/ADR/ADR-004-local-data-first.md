# ADR-004 — Local Data First, Supabase Later

## Status
Accepted

## Decision
V1 will use local TypeScript data files for eras, POIs, layers, KML anchors, and asset specifications.

## Rationale
The first prototype must prioritize emotional impact and polish. A database would add configuration burden before the data model is proven.

## Consequences
- Use files under `data/troy/`.
- Structure the data as if it can migrate to Supabase later.
- Avoid hardcoding POI text directly inside UI components.
