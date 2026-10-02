# Feature Passport: hello-orb

## Identity

- ID: hello-orb
- Name: Hello Orb
- Division: studio-media (scene content); core-platform (island, registry, tooling)
- Product family: immersive-layer
- Product: site-shell
- Owner / review authority: studio-media (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic proof of concept)
- Visibility class: public_safe_demo, with `approved_public: true` (approval recorded by the M7 implementation PR on `feature/immersive-layer`)
- Data mode: synthetic
- Version: 1
- Created: 2026-10-01
- Modified: 2026-10-01

## Canonical Implementation

- Canonical route: /labs/scenes/hello-orb
- Canonical branch: main (via feature/immersive-layer)
- Canonical commit or release tag: the merge commit of the M7 PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: studio-media
- Source-of-truth data/system: data/scene-registry.json

## Purpose

Proves the ADR-015 immersive layer end to end:
- a registered scene, a lazy client island and the full 2D fallback chain;
- budgets enforced in code.

It carries no product content.

## Scope

In scope:

- A rotating icosahedron with lighting, a `paused` prop, and a static 2D fallback image.

Out of scope:

- External models, textures or fonts.
- drei loaders (`useGLTF`, `Text`).
- Physics, WebXR, user content.

## Product and Division Boundaries

- Product-specific responsibilities: scene visuals only.
- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Cross-division dependencies: core-platform island and tooling.
- Other products explicitly not owned by this feature: all standalone labs (ADR-014 track).
- Allowed import directions: `components/scenes/hello-orb` → `three`, `@react-three/fiber`.
- Forbidden import directions: no imports from other products, `lib/supabase`, or `lib/github`.

## Testbed and Donor Provenance

- Testbed ancestry: None
- Donor branches: None
- Donor commits: None
- Selected source paths: None
- Excluded donor concerns: None
- Migration disposition: None
- Migration record: None
- Retirement/deprecation condition: replace it with the first real scene, or retire it once the layer is proven.

## Dependencies

- Code:
  - three 0.186.1
  - @react-three/fiber 9.8.1
  - Next.js `next/dynamic` (`ssr: false`)
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback image is same-origin at `/textures/hello-orb/fallback.png`
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Data Truth

- Declared data mode: synthetic
- Live source and retrieval method: none
- Sample/synthetic source: procedural geometry
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
- Related milestones: M7
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
- Next maturity gate: the first real scene replaces it.
- Pilot requirements: n/a
- Production requirements: n/a
- Subscription/auth requirements: none
- Deprecation condition: superseded by a real scene.

## Roadmap

- Next: the first real scene, with self-hosted DRACO decoder and font if it needs them.
- Later: `/departments/*` hero opt-ins (ADR-015).
- Not planned: physics, WebXR, user-generated content.

## AI Notes

Required context before modifying this feature:

- Owning division and product: studio-media, site-shell
- Canonical implementation: `components/scenes/hello-orb/`, `data/scene-registry.json`
- Applicable ADRs: ADR-015, ADR-014
- Visibility and data mode: public_safe_demo (approved), synthetic
- Testbed/donor migration state: none
- Protected paths and excluded concerns:
  - no CDN loads;
  - no drei `useGLTF` or `Text` without self-hosted assets;
  - no physics.
