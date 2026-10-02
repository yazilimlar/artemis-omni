# Feature Passport: botanical-garden

## Identity

- ID: botanical-garden
- Name: Botanical Garden
- Division: natural-systems (scene owner); studio-media (scene rendering); core-platform (island, registry, tooling)
- Product family: immersive-layer
- Product: site-shell. **This scene is not the `rainbow-botanics` product.** That product is registered `noindex_draft` / `noindex_review` (next_gate `resolve_publication_blockers`). This scene is an unbranded, synthetic botanical visualisation. It reuses only that product's colour palette and exposes no specimen data, imagery or Rainbow Botanics branding. Owner decision, Batch 3.
- Owner / review authority: natural-systems (team role)
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic visual)
- Visibility class: public_safe_demo, with `approved_public: true` (approval recorded by the Batch 3 PR on `feat/batch-3-botanical-scene`)
- Data mode: synthetic
- Version: 1
- Created: 2026-10-02
- Modified: 2026-10-02

## Canonical Implementation

- Canonical route: /labs/scenes/botanical-garden
- Canonical branch: main (via feat/batch-3-botanical-scene)
- Canonical commit or release tag: the merge commit of the Batch 3 PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: natural-systems
- Source-of-truth data/system: data/scene-registry.json

## Purpose

A second ADR-015 scene: a calm, living botanical form for the natural-systems division.
- It is reached from the Rainbow Botanics specimen pages ("Explore in 3D") and from the /labs Immersive scenes list.
- It carries no data.

## Scope

In scope:

- Fibonacci phyllotaxis: 180 leaf-shaped petals at the golden angle (~137.5°), each 12 vertices, in one instanced mesh.
- Petals are upright at the centre and open toward the rim; each breathes on its own phase, and the flower turns slowly.
- An amber seed dome at the centre.
- Colours run from deep green to amber and gold.
- A `paused` prop, and a static SVG fallback (the same phyllotaxis, top-down).

Out of scope:

- Specimen data, botanical claims or Rainbow Botanics branding.
- External models, textures or fonts.
- drei loaders.
- Physics, WebXR, user content.

## Product and Division Boundaries

- Product-specific responsibilities: scene visuals only.
- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Cross-division dependencies: core-platform island and tooling; studio-media rendering conventions.
- Other products explicitly not owned by this feature: `rainbow-botanics` (its specimen pages only link here), and all standalone labs.
- Allowed import directions: `components/scenes/botanical-garden` → `three`, `@react-three/fiber`.
- Forbidden import directions: no imports from `components/rainbow`, `data/rainbow`, other products, `lib/supabase` or `lib/github`.

## Testbed and Donor Provenance

- Testbed ancestry: None
- Donor branches: None
- Donor commits: None
- Selected source paths: None
- Excluded donor concerns: None
- Migration disposition: None
- Migration record: None
- Retirement/deprecation condition: replaced by a reviewed natural-systems scene.

## Dependencies

- Code:
  - three 0.186.1
  - @react-three/fiber 9.8.1
  - Next.js `next/dynamic` (`ssr: false`)
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none; the fallback is same-origin at `/textures/botanical-garden/fallback.svg`
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Data Truth

- Declared data mode: synthetic
- Live source and retrieval method: none
- Sample/synthetic source: procedural golden-angle phyllotaxis (no data)
- Fallback behavior: static SVG whenever any of these apply:
  - reduced motion;
  - no WebGL;
  - a low-end device;
  - FPS below the floor;
  - an error;
  - SSR;
  - the session limit (180 s) has been reached.
- Timestamp/freshness behavior: n/a
- Human-review boundary: n/a
- Official source-of-truth statement: decorative botanical form; it is not a specimen and makes no botanical claims.

## Architecture Links

- Related ADRs: ADR-015 (governing), ADR-006, ADR-014
- Related docs: data/scene-registry.schema.json, scripts/validate-scenes.mjs
- Related prompts: Batch 3 brief
- Related milestones: Batch 3
- Related division/product registry entries: natural-systems. `rainbow-botanics` is related only by link and palette.

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
- Unit tests: tests/unit/scene-registry.test.ts (validates the committed registry, including this scene)
- Integration tests: none
- Browser QA: manual. Check that the flower renders, and that the fallback appears under reduced motion and with WebGL disabled.
- Accessibility: the fallback image has alt text; the page copy is server-rendered.
- Performance: 2,700 vertices in total; one instanced draw call for the petals; 180 instance matrices updated per frame; fps_floor 20; session limit 180 s.
- Security/secret scan: no secrets, no remote URLs.
- Data-mode claim verification: synthetic, labeled on the page.
- Function-parity verification: n/a

## Lifecycle and Commercial Path

- Current lifecycle: active_lab
- Current maturity: internal_experiment
- Next maturity gate: owner review of whether rainbow-botanics clears `resolve_publication_blockers`, before any product-branded version.
- Pilot requirements: n/a
- Production requirements: n/a
- Subscription/auth requirements: none
- Deprecation condition: replaced by a reviewed natural-systems scene.

## Roadmap

- Next: optional growth animation (an L-system variant) if a clean, fast version is wanted.
- Later: a product-branded variant, but only after rainbow-botanics' publication blockers are resolved.
- Not planned: physics, WebXR, user-generated content.

## AI Notes

Required context before modifying this feature:

- Owning division and product: natural-systems, site-shell. **Not** rainbow-botanics.
- Canonical implementation: `components/scenes/botanical-garden/`, `data/scene-registry.json`
- Applicable ADRs: ADR-015, ADR-014
- Visibility and data mode: public_safe_demo (approved), synthetic
- Testbed/donor migration state: none
- Protected paths and excluded concerns:
  - no CDN loads;
  - no drei `useGLTF` or `Text` without self-hosted assets;
  - no Rainbow Botanics specimen data or branding.
