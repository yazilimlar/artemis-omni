# ADR-020 - Algorithm Visualizations

- **Status:** Accepted
- **Date:** 2026-10-04
- **Amends:** ADR-015 (rendering stack lock and scene registry shape; see Consequences)
- **Extends:** ADR-016, ADR-017, ADR-018

## Context

The owner wants 3blue1brown-style algorithm and mathematical visualizations on the site,
particularly for the Evolution Archive and product pages: derived equations, step-by-step
algorithm animations, geometric proofs and projections.

State of the repository on `main`, 2026-10-04:

- The scene registry (`data/scene-registry.json`) holds five scenes: `hello-orb`,
  `spatial-proof-surface`, `botanical-garden` and `evolution-architecture-map` (four
  React Three Fiber scenes), and the Canvas 2D homepage hero `site-hero` (ADR-016).
- ADR-015 locks the 3D stack to Three.js through React Three Fiber plus drei, forbids other
  3D libraries in the application bundle, forbids third-party runtime fetches, caps the 3D
  island at 400 KB gzipped (it is about 253 KB today), and requires a 2D fallback that
  carries the same information as the scene.
- ADR-018 deferred MathBox and Manim-Web ("a separate ADR if used"). This is that ADR.
- ADR-017 requires 3D and rich visuals to map to a native visual type of their subject.
  Algorithm and mathematical figures are the native grammar of forecasting, geometry,
  costing and of the archive's own governing equations.
- `public/video/` holds one 5.2 MB video (the homepage hero) and its poster.

Three candidate approaches exist, each with different trade-offs. The facts below about
each tool come from the owner's brief and general knowledge; none has been verified in
this repository. This session does not install or evaluate any library.

## Options evaluated

### Option A: ManimCE (Python, pre-rendered)

The original 3blue1brown engine, community edition. Renders to MP4.

- Pros: mature, community-tested, LaTeX support, a large community.
- Cons: needs a Python toolchain, renders in batches, no interactivity, and each clip adds
  5 to 50 MB.
- Fits: pre-rendered explainer videos embedded on pages.

### Option B: Manim-Web (TypeScript, interactive)

A JavaScript port with interactivity.

- Pros: React-friendly, interactive (drag, click), fits the Next.js stack.
- Cons: a smaller project, fewer features than ManimCE, uncertain long-term maintenance,
  less documentation.
- Fits: interactive 2D math figures and step-by-step algorithms in the archive and on
  product pages.

### Option C: React Three Fiber plus MathBox (existing stack)

R3F is already in the repository. MathBox is a mathematical visualization layer on
Three.js.

- Pros: reuses `three` and `@react-three/fiber`, adds no new language, and fits the scene
  registry from ADR-015.
- Cons: no native LaTeX rendering, more manual work for step-by-step animation, less
  automatic than Manim.
- Fits: 3D surfaces (Gaussian, Fourier, topology) and interactive scenes.

## Decision

Adopt a **tiered approach**. The tiers and their rules are decided now. Each library is
chosen for its tier but adopted only after the adoption gates below pass, so no library is
committed to before it has been evaluated against this repository.

### a. Tier 1: 3D mathematical surfaces and interactive scenes (Option C)

React Three Fiber plus MathBox. No dependency beyond MathBox. Scenes are registered under
ADR-015 and run in the existing 3D island, within its 400 KB budget and fallback chain.

- MathBox must use the application's single `three` instance (no second copy of Three.js).
- ADR-015's "no other 3D libraries" lock is amended to allow MathBox as a layer over that
  same instance. Nothing else in the lock changes.

### b. Tier 2: 2D step-by-step algorithm animations (Option B)

Manim-Web, for sorting, graph traversal, dynamic programming and geometry proofs. It is a
**separate island**, code-split, loaded only on routes with a registered scene of type
`manim`, and never inside the 3D island or on the homepage.

- Registered under `/labs/scenes/<id>` like any scene; the registry entry has
  `type: "manim"` (see Consequences).
- It has its own bundle budget, enforced by the validator after every build. Starting
  budget: 150 KB gzipped for the island, separate from the 400 KB 3D island. The first
  proof measures it; a change to the number needs an amendment to this ADR.

### c. Tier 3: long-form explainer videos (Option A)

ManimCE, for explainers of about five minutes or more. They are rendered offline and stored
as static assets in `public/video/`. They are watch-only, not interactive.

Budget, in the style of ADR-016:

- each video is under 30 MB;
- lazy-loaded: `preload="none"` and a poster image, nothing fetched before the visitor
  asks to play;
- started by the visitor, never autoplayed; captions or a transcript are provided.
- The source scripts and the Manim version used are recorded with the video (in its feature
  passport, and committed as text) so a render can be reproduced on the owner's machine.

### d. ManimCE stays out of CI

Renders happen on the owner's machine. Videos are committed as static assets. No Python
in CI, in Docker, or on any server.

### e. First proof in each tier, in order

1. **Tier 1:** a MathBox Gaussian surface, built on the same height-field idea as the
   existing `spatial-proof-surface` scene so the two can be compared. The implementing PR
   decides whether it replaces or sits beside that scene.
2. **Tier 2:** Manim-Web bubble sort on 20 items.
3. **Tier 3:** a 3-minute explainer on the Evolution Archive itself. Its script must pass
   the `/platform` public-safety rules (ADR-018) if it will be shown on a public page.

Each proof ships as its own PR and is reviewed before the next tier starts.

### f. Adoption gates (every library, in its implementing PR)

A library is installed only after the PR records:

1. **License:** read from the installed package, acceptable for the intended use (the GSAP
   check in the Evolution Archive PR is the precedent).
2. **Size:** measured gzipped cost against the tier's budget.
3. **Compatibility:** works with the installed React, Next.js and, for Tier 1, `three` and
   `@react-three/fiber`; no second `three`.
4. **Maintenance:** release history and open issues reviewed; a documented exit route if it
   is abandoned.
5. **No third-party runtime fetches:** fonts, decoders and assets are self-hosted (ADR-015,
   ADR-014).
6. **Accessibility:** reduced motion shows a static view; the content is available as text;
   playback can be paused or stepped.
7. **Fallback:** a static 2D fallback that carries the same information.

If a gate fails, the tier is not built on that library. The PR says so and proposes an
amendment to this ADR. Tier 2 has the most uncertainty (a smaller, less documented
project); if Manim-Web fails, a hand-written 2D canvas is the fallback for the sorting
proof rather than a different new dependency.

## Consequences

- New dependency, Tier 1: MathBox (one small package), after the gates.
- New dependency, Tier 2: Manim-Web, after license and size are evaluated.
- No new server-side Python.
- Videos live in `public/video/` with lazy loading. Repository growth is real (up to 30 MB
  per clip, kept in git history). The implementing PR for the first video should propose a
  total cap for `public/video/`, and a move to Git LFS or external storage if the cap is
  reached; that is a separate decision.
- The scene registry gains an optional `type: "3d" | "manim"` field. Omitted means `"3d"`,
  so existing entries stay valid. `data/scene-registry.schema.json` and
  `scripts/validate-scenes.mjs` are updated in the implementing PR. A `manim` scene still
  needs `fallback_2d`, an `entry_component` under `components/scenes/<id>/`, a feature
  passport, and a route of the form `/labs/scenes/<id>`. It is not subject to the WebGL
  checks, and it has the Manim island budget instead of the 3D island budget. The earlier
  idea of a separate "manim flag" is replaced by this `type` field.
- ADR-015's fallback chain applies to both scene types. For `manim` scenes the reduced
  motion and error fallbacks are static figures or step tables.
- Equation typesetting is **not** decided here. Tiers 1 and 2 have no native LaTeX; Tier 3
  bakes LaTeX into video. If equations need to appear as live text, that is a separate
  decision (it would add a dependency).
- Visualizations map to a native visual type (ADR-017). Each new scene's passport names
  the native grammar it serves.

## Non-goals

- No Python in CI.
- No server-side rendering of math.
- No ManimCE in Docker.
- No user-authored visualizations.
- No library is installed or evaluated by this ADR.
- No autoplay video, and no scroll-jacking.

## References

ADR-015 (immersive layer), ADR-016 (homepage hero and budgets), ADR-017 (contextual design
language), ADR-018 (Evolution Archive), ADR-019 (compositional architecture), ADR-014 (no
third-party runtime content), the owner's direction on 2026-10-04.
