# ADR-002 — Cinematic / WebGL Layer

- **Status:** Accepted
- **Date:** 2026-06-28

## Context

The brief calls for a cinematic homepage hero (the **5D Construction Intelligence Bridge**)
with floating project-control artifacts, while also demanding a fast, SEO-friendly site that
works without WebGL and respects reduced-motion and mobile constraints.

> Note: this hero was originally drafted under the name "The Artemis Intelligence Atelier".
> That artistic naming was retired in favor of construction-credible positioning; the
> decision below is unchanged. See `docs/BrandSystem.md`.

## Decision

For Phase 1, implement the hero with **HTML + SVG + CSS animations**, not a 3D engine:

- The 5D cost curve and fragments are inline SVG (kilobytes, crisp at any DPI).
- Floating panels are styled elements with CSS keyframe animation + light
  pointer-parallax.
- The animated scene lives behind a single boundary, `ArtemisSceneCanvas`, and is
  **lazy-loaded** via `next/dynamic` with `ssr: false`.
- `CinematicHero` renders a **static fallback** (`ReducedMotionFallback`/`SceneFallback`)
  by default and only upgrades to the animated scene for motion-OK, non-mobile clients
  (`usePrefersStatic`). Hero copy is always server-rendered for SEO/a11y.

A future **React Three Fiber** scene (with Draco-compressed GLB assets) can replace the
internals of `ArtemisSceneCanvas` behind the same boundary, lazy-loaded the same way —
without touching pages, copy, or fallbacks.

## Consequences

- ✅ Tiny first load; works without WebGL; strong Core Web Vitals.
- ✅ Accessible and SEO-friendly by construction.
- ✅ Clear, low-risk upgrade path to real 3D.
- ⚠️ The current scene is stylized, not photoreal — acceptable for a prototype.
- ⚠️ Pointer-parallax adds minor client JS (only on the enhanced path).

## Alternatives considered

- **Ship R3F now** — rejected for Phase 1: bundle weight, asset pipeline not ready, risk
  to performance/accessibility goals.
- **Static image hero** — rejected: misses the "cinematic" requirement and the artifact
  storytelling.
