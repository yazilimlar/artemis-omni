# Feature Passport: site-hero

## Identity

- ID: site-hero
- Name: Artemis System
- Division: core-platform (scene and homepage mount); studio-media (visual conventions)
- Product family: immersive-layer
- Product: site-shell
- Owner / review authority: core-platform (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic visual)
- Visibility class: public_safe_demo, with `approved_public: true`. Shown on the public homepage under ADR-016; approval recorded by the Batch 4 PR on `feat/batch-4-homepage-hero`.
- Data mode: synthetic
- Version: 1
- Created: 2026-10-02
- Modified: 2026-10-02

## Canonical Implementation

- Canonical route: `/` (homepage hero only). `/labs/scenes/site-hero` returns 404 by design.
- Canonical branch: main (via feat/batch-4-homepage-hero)
- Canonical commit or release tag: the merge commit of the Batch 4 PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: core-platform
- Source-of-truth data/system: data/scene-registry.json

## Purpose

One minimal 3D moment on the homepage (ADR-016): a slowly rotating wireframe icosahedron whose vertices breathe. It signals "system" without competing with the hero copy or slowing the page.

## Scope

In scope:

- A once-subdivided icosahedron (42 vertices, 120 edges) drawn with the native Canvas 2D API: perspective projection, depth-shaded edges from signal blue to gold, and a ±7% per-vertex breathing displacement.
- The `paused` prop.
- A static SVG fallback generated from the same geometry.
- Mounted below the homepage hero section and loaded after idle.

Out of scope:

- three.js/R3F on the homepage (it would add 240 KB gz; ADR-016 renderer exception).
- Particles, video, scroll effects, full-screen canvas, parallax over text.

## Product and Division Boundaries

- Product-specific responsibilities: the hero visual and the homepage mount.
- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes (including the ADR-016 hero budget).
- Cross-division dependencies: none beyond the core-platform tooling.
- Other products explicitly not owned by this feature: all /labs scenes and products.
- Allowed import directions: `components/scenes/site-hero` → its own `geometry.ts` and `next/dynamic`.
- Forbidden import directions: no `three`, no `@react-three/*` (enforced: the postbuild check fails if hero chunks share any chunk with R3F scenes). No product, `lib/supabase` or `lib/github` imports.

## Testbed and Donor Provenance

- Testbed ancestry: None
- Donor branches: None
- Donor commits: None
- Selected source paths: None
- Excluded donor concerns: None
- Migration disposition: None
- Migration record: None
- Retirement/deprecation condition: replaced by a reviewed homepage visual under ADR-016.

## Dependencies

- Code: React, Next.js `next/dynamic` (`ssr: false`), the Canvas 2D API. No 3D library.
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback is same-origin at `/textures/site-hero/fallback.svg`
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`, `components/scenes/site-hero/HomeHeroScene.tsx`

## Data Truth

- Declared data mode: synthetic
- Live source and retrieval method: none
- Sample/synthetic source: procedural geometry
- Fallback behavior:
  - static SVG on the server and first paint;
  - kept when reduced motion, `saveData`, or a `slow-2g`/`2g`/`3g` connection applies;
  - then SceneIsland's chain applies: low-end device, no WebGL, FPS below 24, error, or the 30 s session limit.
- Timestamp/freshness behavior: n/a
- Human-review boundary: n/a
- Official source-of-truth statement: decorative; it conveys no data.

## Architecture Links

- Related ADRs: ADR-016 (governing), ADR-015, ADR-002
- Related docs: data/scene-registry.schema.json, scripts/validate-scenes.mjs
- Related prompts: Batch 4 brief
- Related milestones: Batch 4
- Related division/product registry entries: core-platform

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public synthetic content only
- User data handling: none (`navigator.connection` is read locally and never sent)
- Internal operational information exposed: none
- Authentication/authorization: none
- Known risks: none specific. First-party code with no third-party fetches.

## Validation

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build` (prebuild validates the registry; postbuild enforces the 100 KB hero budget and no shared R3F chunks)
- Unit tests: tests/unit/scene-registry.test.ts (hero route rules, hero bundle) and tests/unit/site-hero.test.ts (geometry, load gate)
- Integration tests: none
- Browser QA: manual.
  1. The homepage hero copy paints first.
  2. The icosahedron appears below the hero after idle.
  3. Reduced motion shows the SVG.
  4. DevTools "Slow 3G" shows the SVG.
- Accessibility: the canvas has role="img" with a label; the fallback has alt text; hero copy and CTAs are unchanged.
- Performance: 42 vertices; one Canvas 2D path per edge per frame; no geometry rebuilds; fps_floor 24; 30 s session limit. The hero chunks' total is reported by the postbuild check.
- Security/secret scan: no secrets, no remote URLs.
- Data-mode claim verification: decorative, with no data claims.
- Function-parity verification: n/a

## Lifecycle and Commercial Path

- Current lifecycle: active_lab
- Current maturity: internal_experiment
- Next maturity gate: real-device LCP verification on the Vercel preview (mid-tier mobile under 2.5 s).
- Pilot requirements: n/a
- Production requirements: n/a
- Subscription/auth requirements: none
- Deprecation condition: replaced by a reviewed homepage visual.

## Roadmap

- Next: tune motion and colour after real-device QA.
- Later: none planned. ADR-016 allows only one homepage scene.
- Not planned: three.js on the homepage, particles, scroll effects.

## AI Notes

Required context before modifying this feature:

- Owning division and product: core-platform, site-shell
- Canonical implementation: `components/scenes/site-hero/`, `data/scene-registry.json`
- Applicable ADRs: ADR-016, ADR-015
- Visibility and data mode: public_safe_demo (approved), synthetic
- Testbed/donor migration state: none
- Protected paths and excluded concerns:
  - never import three.js here;
  - keep the hero below the existing hero section;
  - do not touch hero text or CTAs.
