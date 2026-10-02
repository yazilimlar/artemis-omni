# Feature Passport: spatial-proof-surface

## Identity

- ID: spatial-proof-surface
- Name: Spatial Proof Surface
- Division: studio-media (scene content); core-platform (island, registry, tooling)
- Product family: immersive-layer
- Product: site-shell
- Owner / review authority: studio-media (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic proof of concept)
- Visibility class: public_safe_demo, with `approved_public: true` (approval recorded by the Batch 2 PR on `feat/batch-2-visuals-p2`)
- Data mode: synthetic
- Version: 1
- Created: 2026-10-01
- Modified: 2026-10-01

## Canonical Implementation

- Canonical route: /labs/scenes/spatial-proof-surface
- Canonical branch: main (via feat/batch-2-visuals-p2)
- Canonical commit or release tag: the merge commit of the Batch 2 PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: studio-media
- Source-of-truth data/system: data/scene-registry.json

## Purpose

The first real visual upgrade under ADR-015, from site audit D-1 (#89):
- It replaces the static "Spatial proof surface" render with a living surface that suggests spatial and project-controls intelligence.
- It is reached from the Spatial proof surface card on /products.
- It carries no product data.

## Scope

In scope:

- A procedural height field (96×96 plane): three pulsating Gaussian peaks plus a 4-harmonic Fourier ripple, vertex-coloured from signal blue to gold, with a faint wireframe overlay; a `paused` prop; a static SVG fallback (the GeodesicRenderCard dome render).

Out of scope:

- External models, textures or fonts.
- drei loaders (`useGLTF`, `Text`).
- Physics, WebXR, user content.

## Product and Division Boundaries

- Product-specific responsibilities: scene visuals only.
- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Cross-division dependencies: core-platform island and tooling.
- Other products explicitly not owned by this feature: all standalone labs (ADR-014 track).
- Allowed import directions: `components/scenes/spatial-proof-surface` → `three`, `@react-three/fiber`.
- Forbidden import directions: no imports from other products, `lib/supabase`, or `lib/github`.

## Testbed and Donor Provenance

- Testbed ancestry: None
- Donor branches: None
- Donor commits: None
- Selected source paths: None
- Excluded donor concerns: None
- Migration disposition: None
- Migration record: None
- Retirement/deprecation condition: replaced by a data-backed spatial scene.

## Dependencies

- Code:
  - three 0.186.1
  - @react-three/fiber 9.8.1
  - Next.js `next/dynamic` (`ssr: false`)
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback image is same-origin at `/textures/spatial-proof-surface/fallback.svg`
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Data Truth

- Declared data mode: synthetic
- Live source and retrieval method: none
- Sample/synthetic source: procedural Gaussian and Fourier height field (no data)
- Fallback behavior: static image whenever any of these apply:
  - reduced motion;
  - no WebGL;
  - a low-end device;
  - FPS below the floor;
  - an error;
  - SSR;
  - the session limit has been reached.
- Timestamp/freshness behavior: n/a
- Human-review boundary: n/a
- Official source-of-truth statement: decorative demo; it conveys no data.

## Architecture Links

- Related ADRs: ADR-015 (governing), ADR-002 (superseded), ADR-006, ADR-014
- Related docs: data/scene-registry.schema.json, scripts/validate-scenes.mjs
- Related prompts: M7 implementation brief
- Related milestones: Batch 2 (site audit D-1)
- Related division/product registry entries: studio-media

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public synthetic content only
- User data handling: none
- Internal operational information exposed: none
- Authentication/authorization: none (approved public_safe_demo)
- Known risks: none specific. The scene runs same-origin as reviewed first-party code with no third-party fetches.

## Validation

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build` (prebuild and postbuild run validate-scenes)
- Unit tests: tests/unit/scene-registry.test.ts and tests/unit/scene-island-decision.test.ts
- Integration tests: none
- Browser QA: manual. Check that the scene renders, and that the fallback appears under reduced motion and with WebGL disabled.
- Accessibility: the fallback image has alt text; the page copy is server-rendered.
- Performance: island ≤ 400 KB gz (postbuild check); fps_floor 20; session limit 120 s.
- Security/secret scan: no secrets, no remote URLs.
- Data-mode claim verification: synthetic, labeled on the page.
- Function-parity verification: n/a

## Lifecycle and Commercial Path

- Current lifecycle: active_lab
- Current maturity: internal_experiment
- Next maturity gate: in-place embedding after an ADR amendment.
- Pilot requirements: n/a
- Production requirements: n/a
- Subscription/auth requirements: none
- Deprecation condition: superseded by a data-backed spatial scene.

## Roadmap

- Next: decide whether registered scenes may be embedded in /products and /labs proof cards (needs an ADR-015 amendment).
- Later: `/departments/*` hero opt-ins (ADR-015).
- Not planned: physics, WebXR, user-generated content.

## AI Notes

Required context before modifying this feature:

- Owning division and product: studio-media, site-shell
- Canonical implementation: `components/scenes/spatial-proof-surface/`, `data/scene-registry.json`
- Applicable ADRs: ADR-015, ADR-014
- Visibility and data mode: public_safe_demo (approved), synthetic
- Testbed/donor migration state: none
- Protected paths and excluded concerns:
  - no CDN loads;
  - no drei `useGLTF` or `Text` without self-hosted assets;
  - no physics.
