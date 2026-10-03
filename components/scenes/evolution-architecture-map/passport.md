# Feature Passport: evolution-architecture-map

## Identity

- ID: evolution-architecture-map
- Name: Evolution Architecture Map
- Division: core-platform
- Product family: platform-governance
- Product: artemis-evolution-archive (registry id `artemis-evolution-console`)
- Owner / review authority: core-platform (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment
- Visibility class: internal_operations (auth required on `/evolution` and `/labs/scenes/evolution-architecture-map`)
- Data mode: mixed_explicit (a hand-maintained structure naming real files and routes; not generated)
- Version: 1
- Created: 2026-10-03
- Modified: 2026-10-03

## Canonical Implementation

- Canonical route: /labs/scenes/evolution-architecture-map (embedded on /evolution)
- Canonical branch: main (via feat/evolution-visualization)
- Product Registry entry: artemis-evolution-console
- Source-of-truth data/system: `lib/evolution/architecture.ts`, `data/scene-registry.json`

## Purpose

Native visual for the Evolution Archive's "architecture map" (ADR-017, ADR-018): the platform as a graph of registries, scripts, routes, APIs and services, with directed data flow. It maps to the architecture-map grammar of development history, so it satisfies the ADR-017 rule that 3D must represent a native visual type.

## Scope

In scope:

- 17 nodes and 20 directed edges defined in `lib/evolution/architecture.ts`.
- Spheres (10x6 segments), arrowhead cones, line segments. Under 3,000 vertices in total (asserted in `tests/unit/evolution-architecture.test.ts`).
- DOM labels via drei `Html`; a gentle sway, a `paused` prop.
- A static SVG fallback of the same layout.

Out of scope:

- MathBox, D3, force layout, external models, textures or fonts (ADR-018 defers MathBox).
- Deriving the structure from code; it is maintained by hand for now.

## Product and Division Boundaries

- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Allowed import directions: `components/scenes/evolution-architecture-map` → `three`, `@react-three/fiber`, `@react-three/drei` (Html only), `lib/evolution/architecture`.
- Forbidden import directions: `lib/supabase`, `lib/github`, other products.

## Dependencies

- Code: three 0.186.1, @react-three/fiber 9.8.1, @react-three/drei (Html), Next.js `next/dynamic` (`ssr: false`)
- Data: none at runtime beyond the static structure
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback is same-origin at `/textures/evolution-architecture-map/fallback.svg`

## Data Truth

- Declared data mode: mixed_explicit
- Sample/synthetic source: none; nodes and edges name real repository files and routes, written by hand
- Fallback behavior: static image on reduced motion, no WebGL, low device, FPS below the floor, error, SSR, or session limit
- Known gap: the structure can drift from the code; review it when routes or registries change

## Architecture Links

- Related ADRs: ADR-018 (governing), ADR-017, ADR-015, ADR-006
