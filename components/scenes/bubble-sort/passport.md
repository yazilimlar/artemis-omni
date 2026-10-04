# Feature Passport: bubble-sort

## Identity

- ID: bubble-sort
- Name: Bubble Sort
- Division: core-platform
- Product family: immersive-layer
- Product: site-shell
- Owner / review authority: core-platform (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic proof of concept)
- Visibility class: public_safe_demo, with `approved_public: true` (approval recorded by the PR that adds this scene, `feat/bubble-sort-canvas`)
- Data mode: synthetic
- Version: 1
- Created: 2026-10-04
- Modified: 2026-10-04

## Canonical Implementation

- Canonical route: /labs/scenes/bubble-sort
- Canonical branch: main (via feat/bubble-sort-canvas)
- Canonical commit or release tag: the merge commit of that PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: core-platform
- Source-of-truth data/system: data/scene-registry.json

## Purpose

First Tier 2 proof of ADR-020 (step-by-step 2D algorithm animations). It shows bubble sort on 20 bars so a reader can see how comparisons and swaps move the largest values to the end.

- Native visual type (ADR-017): an algorithm step view, the native grammar of computation and of the platform's own governing procedures.
- Hand-written Canvas 2D. No animation library: the Tier 2 gate evaluation (`docs/history/adr-020-tier2-gate-report.md`) found no package that passes the gates.
- It carries no product data.

## Scope

In scope:

- 20 bars, values 1..20, shuffled by a seeded generator (`BASE_SEED + round`, no `Math.random`), so every run is reproducible.
- One comparison per step (90 ms); colors: slate unsorted, cyan comparing, gold swapping, green sorted. A header on the canvas shows comparisons and swaps.
- When the sort completes it holds for 2 seconds, then reshuffles with the next seed and restarts. A `paused` prop freezes it.
- A pure step generator (`algorithm.ts`): the full sequence is computed up front and the renderer is a function of the step index.
- A static SVG fallback of a mid-sort state, generated from `algorithm.ts`.

Out of scope:

- Any library (Manim-Web, MathBox), external assets or fonts (it uses `system-ui`).
- User-supplied input; other algorithms (separate scenes).

## Product and Division Boundaries

- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Allowed import directions: `components/scenes/bubble-sort` → React only.
- Forbidden import directions: other products, `lib/supabase`, `lib/github`.

## Dependencies

- Code: React, Next.js `next/dynamic` (`ssr: false`), the Canvas 2D API. No three.js, no new dependency.
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback is same-origin at `/textures/bubble-sort/fallback.svg`
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Accessibility and Fallback

- Reduced motion, a low-end device, an error, SSR, FPS below the floor, or the 180 s session limit all show the static fallback image (ADR-015 chain). WebGL is not required for this scene.
- The canvas has `role="img"` and an `aria-label` describing the animation. The fallback SVG has a text description.
- Known gap: the live animation is not exposed step-by-step to assistive technology; the label explains what it shows.

## Data Truth

- Declared data mode: synthetic
- Sample/synthetic source: a seeded permutation of 1..20 (no data)
- Official source-of-truth statement: an algorithm illustration; it conveys no data.

## Architecture Links

- Related ADRs: ADR-020 (governing, with the 2026-10-04 Tier 1 and Tier 2 amendments), ADR-015, ADR-017, ADR-006
- Related docs: docs/history/adr-020-tier2-gate-report.md, data/scene-registry.schema.json, scripts/validate-scenes.mjs
