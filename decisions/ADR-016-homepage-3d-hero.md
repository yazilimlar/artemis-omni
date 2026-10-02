# ADR-016 - Homepage 3D Hero

- **Status:** Accepted
- **Date:** 2026-10-02
- **Amends:** ADR-015 (Immersive 3D Layer)
- **Extends:** ADR-002, ADR-015

## Context

ADR-015 excluded the homepage from 3D in v1 and locked the 3D stack to Three.js through
React Three Fiber (R3F). Batches 1–3 (#89–#92) shipped three registered `/labs/scenes`
scenes with the full ADR-015 fallback chain. The owner now wants one minimal 3D moment on
the homepage.

Measurements on `main` @ `e011ede`, 2026-10-02:

- The homepage's first-load JS is **106 KB**, and it loads no 3D code.
- **Every R3F scene depends on 240.3 KB gz of shared Three.js/R3F chunks**, measured from
  `.next/react-loadable-manifest.json`. Each scene's own code is only 0.5–1.1 KB gz.
- An R3F hero would therefore add about 241 KB gz to the homepage. That is well over the
  100 KB incremental budget this ADR sets, so the owner chose a dependency-free renderer
  for the hero.

## Decision

The homepage hero **may** render **one** registered scene, under all of these conditions.

### Registration
- The scene is registered in `data/scene-registry.json`, with a passport and a static 2D
  fallback, as for any ADR-015 scene.
- A hero scene declares `route: "/"`. At most **one** scene may do so. It is hero-only:
  `/labs/scenes/[id]` returns 404 for any scene whose route is not
  `/labs/scenes/<id>`, and the `/labs` scene list shows only `/labs/scenes/*` scenes.

### Minimal by budget (enforced by code)
- Under **5,000 vertices**.
- Under **100 KB gz incremental bundle**: every chunk the hero's dynamic import loads,
  counted in total. `scripts/validate-scenes.mjs --bundle` fails the build above that.
- No external assets, and no runtime fetches beyond same-origin JS chunks.

### Renderer: a scoped exception to the ADR-015 stack lock
- The homepage hero **may use the native Canvas 2D API with no 3D library**, drawing a
  projected 3D form. Three.js/R3F cannot meet the 100 KB budget (see Context).
- This exception covers the homepage hero only. `/labs/scenes` scenes and department heroes
  stay on R3F per ADR-015, and no other 3D library is admitted.

### Placement and loading
- The scene renders **below the existing above-the-fold content**. On mobile that is
  below the fold. Hero text, CTAs and layout are unchanged.
- **First paint is never blocked:**
  - the server renders the static fallback;
  - scene code loads only after the page is idle (`requestIdleCallback`, with a timeout
    fallback), through `next/dynamic` with `ssr: false`.
- **The 2D fallback is always served when:**
  - `prefers-reduced-motion: reduce` is set;
  - the network is slow (`navigator.connection.effectiveType` is `slow-2g`, `2g` or `3g`,
    or `saveData` is on);
  - the device is low-end (ADR-015's rule);
  - WebGL is unavailable (the ADR-015 chain is kept for consistency);
  - FPS falls below the scene's floor;
  - an error occurs;
  - the session limit is reached.

### Performance budget
- LCP stays under 2.5 s on mid-tier mobile. The hero visual is never the LCP element: it
  sits below the fold and loads after idle.
- First paint is not blocked by scene code.

## Non-goals

This ADR does not allow:

- autoplay video;
- particle systems;
- scroll-jacking;
- full-screen WebGL;
- parallax over text;
- more than one 3D scene on the homepage;
- loading Three.js/R3F on the homepage.

## Consequences

- The homepage gains about one lazily loaded chunk plus a tiny client wrapper. Its
  first-load JS grows only by the wrapper.
- The scene registry schema and validator accept `route: "/"` for exactly one hero scene,
  and enforce the hero bundle budget after every build.
- ADR-015's "no 3D on the homepage in v1" is amended by this ADR. The rest of ADR-015
  stands.

## References

ADR-002, ADR-015, PRs #89, #90, #91, #92.
