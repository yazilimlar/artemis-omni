# Feature Passport: gaussian-surface

## Identity

- ID: gaussian-surface
- Name: Gaussian Surface
- Division: core-platform
- Product family: immersive-layer
- Product: site-shell
- Owner / review authority: core-platform (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic proof of concept)
- Visibility class: public_safe_demo, with `approved_public: true` (approval recorded by the PR that adds this scene, `feat/gaussian-surface-r3f`)
- Data mode: synthetic
- Version: 1
- Created: 2026-10-04
- Modified: 2026-10-04

## Canonical Implementation

- Canonical route: /labs/scenes/gaussian-surface
- Canonical branch: main (via feat/gaussian-surface-r3f)
- Canonical commit or release tag: the merge commit of that PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: core-platform
- Source-of-truth data/system: data/scene-registry.json

## Purpose

First Tier 1 proof of ADR-020 (algorithm and mathematical visualizations). It shows the Gaussian surface z = exp(-(x² + y²) / 2σ²) with σ = 1, the building block of the probability and forecasting figures the site will need.

- Native visual type (ADR-017): a plot of a governing function, the native grammar of forecasting and mathematics.
- It uses plain React Three Fiber. MathBox was rejected at Gate 3 (ADR-020 amendment).
- It carries no product data.

## Scope

In scope:

- A 64 x 64-cell grid (65 x 65 = 4,225 vertices) displaced by the Gaussian, coloured blue → cyan → gold by height, with a faint wireframe overlay, rotating about the vertical axis at 0.1 rad/s; a `paused` prop.
- A static SVG fallback: a top-down shaded plot with exact iso-height circles at z = 0.2, 0.4, 0.6, 0.8, generated from `surface.ts`.
- The formula stated as text on this passport and in the fallback image.

Out of scope:

- MathBox, Manim-Web, axis ticks and labels (may be drawn manually later).
- External models, textures or fonts; drei loaders.
- Interactivity beyond the island's pause and fallback behavior (orbit controls are not included).

## Product and Division Boundaries

- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Allowed import directions: `components/scenes/gaussian-surface` → `three`, `@react-three/fiber`.
- Forbidden import directions: other products, `lib/supabase`, `lib/github`.

## Dependencies

- Code: three 0.186.1, @react-three/fiber 9.8.1, Next.js `next/dynamic` (`ssr: false`)
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback image is same-origin at `/textures/gaussian-surface/fallback.svg`
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Data Truth

- Declared data mode: synthetic
- Sample/synthetic source: the closed-form Gaussian (no data)
- Fallback behavior: static image on reduced motion, no WebGL, low device, FPS below the floor, error, SSR, or the session limit
- Timestamp/freshness behavior: n/a
- Official source-of-truth statement: a mathematical illustration; it conveys no data.

## Architecture Links

- Related ADRs: ADR-020 (governing, with the 2026-10-04 amendment), ADR-015, ADR-017, ADR-006
- Related docs: data/scene-registry.schema.json, scripts/validate-scenes.mjs
