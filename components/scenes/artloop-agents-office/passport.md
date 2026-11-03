# Feature Passport: artloop-agents-office

## Identity

- ID: artloop-agents-office
- Name: ArtLoop Agents Office
- Division: infrastructure-construction (scene owner; Artemis Construction, estimating); core-platform (island, registry, tooling)
- Product family: immersive-layer
- Product: ArtLoop introduction (`/labs/artloop`). **This scene is not the gated ArtLoop estimating workspace** (`yazilimlar/artloop-ws`, authenticated, private approved). It shows none of that workspace's data, figures, bids or documents.
- Owner / review authority: infrastructure-construction (team role); release authority is the owner
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic visual)
- Visibility class: public_safe_demo, with `approved_public: true`. Approval is recorded by the owner's review and merge of the PR on `labs/artloop-agents-office`.
- Data mode: synthetic
- Version: 1
- Created: 2026-11-02
- Modified: 2026-11-02

## Canonical Implementation

- Canonical route: /labs/scenes/artloop-agents-office
- Canonical branch: main (via labs/artloop-agents-office)
- Canonical commit or release tag: the merge commit of that PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: infrastructure-construction
- Source-of-truth data/system: data/scene-registry.json

## Purpose

An "agents office" view of the five ArtLoop stages, so a visitor can see the loop working instead of only reading about it. It is reached from the "Walk the loop in 3D" link under "The loop" on `/labs/artloop` and from the /labs scene list.

## Scope

In scope:

- An office floor with five desks on a pentagon, one per stage, in the published stage order and wording: Intake, Takeoff, Priced basis, Figure governance, Proposal.
- Each desk has a seated agent and one stage prop:
  - Intake: sheets dropping into an inbox tray.
  - Takeoff: a scan line over a plan sheet.
  - Priced basis: rate bars, one held in amber (no source recorded).
  - Figure governance: a glass vault with a turning lock ring.
  - Proposal: pages stacking up.
- A red infinity loop at the centre (the ArtLoop mark) and a walking path; three courier agents carry documents along it while packets travel the path.
- The camera tours the overview and each desk every 7 s. Clicking a desk label focuses that desk and holds the tour for 14 s; "Whole floor" returns to the overview.
- A caption names the focused stage. A chip reads "Synthetic illustration · no project data".
- A `paused` prop, and a static SVG fallback: the same floor from above, with all five stage names and notes.

Out of scope:

- Project data, quantities, rates, totals, bid names, or anything from `artloop-ws`.
- External models, textures, fonts, drei loaders.
- Scroll-driven camera on `/labs/artloop` itself. ADR-015 limits 3D to registered scene routes, so the introduction page links here instead of embedding the scene. Embedding it would need an ADR amendment.
- Physics, WebXR, user content.

## Product and Division Boundaries

- Product-specific responsibilities: scene visuals and stage copy only.
- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Cross-division dependencies: core-platform island and tooling.
- Other products explicitly not owned by this feature: the ArtLoop estimating workspace (`artloop-ws`), ArtPlex, AttemptBook, and all standalone labs.
- Allowed import directions: `components/scenes/artloop-agents-office` → `three`, `@react-three/fiber`.
- Forbidden import directions: no imports from other products, `lib/supabase` or `lib/github`.

## Testbed and Donor Provenance

- Testbed ancestry: a single-file Three.js prototype (r128 from cdnjs) built and reviewed in a Claude session on 2026-11-02. It was rewritten for R3F from npm; no prototype code or CDN load ships.
- Donor branches: None
- Donor commits: None
- Selected source paths: None
- Excluded donor concerns: the prototype's CDN Three.js, web fonts, and its ledger/SHA-256 demo (a separate concern, not part of this scene)
- Migration disposition: rewritten
- Migration record: this passport
- Retirement/deprecation condition: replaced by a reviewed infrastructure-construction scene.

## Dependencies

- Code:
  - three 0.186
  - @react-three/fiber 9
  - Next.js `next/dynamic` (`ssr: false`)
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none. Desk labels are DOM buttons positioned by projecting the desk positions each frame (drei `Html` was dropped because it threw on unmount). Monitor screens are drawn at runtime with Canvas 2D in system fonts; the fallback is same-origin at `/textures/artloop-agents-office/fallback.svg`.
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Data Truth

- Declared data mode: synthetic
- Live source and retrieval method: none
- Sample/synthetic source: procedural geometry; stage names and notes copied from `/labs/artloop`
- Fallback behavior: static SVG whenever any of these apply:
  - reduced motion;
  - no WebGL;
  - a low-end device;
  - FPS below the floor (20);
  - an error;
  - SSR;
  - the session limit (180 s) has been reached.
- Timestamp/freshness behavior: n/a
- Human-review boundary: n/a
- Official source-of-truth statement: an illustration of the ArtLoop process. It shows no estimate and makes no claim about any project.

## Architecture Links

- Related ADRs: ADR-015 (governing), ADR-017 (native visual: an estimating office and its document flow), ADR-006, ADR-014 (the `/labs/artloop` page stays a sandboxed standalone document)
- Related docs: data/scene-registry.schema.json, scripts/validate-scenes.mjs
- Related prompts: owner request 2026-11-02 (agents-office 3D animation for ArtLoop)
- Related division/product registry entries: infrastructure-construction

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public synthetic content only
- User data handling: none
- Internal operational information exposed: none
- Authentication/authorization: none (approved public_safe_demo)
- Known risks: the scene route is indexable (approved public_safe_demo), while `/labs/artloop` is noindex. The owner may prefer the scene noindex too; that needs a scene-page change, not a registry change.

## Validation

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build` (prebuild and postbuild run validate-scenes)
- Unit tests: tests/unit/scene-registry.test.ts (validates the committed registry, including this scene)
- Browser QA: desks, labels and couriers render; label click focuses a desk; fallback appears under reduced motion.
- Accessibility: the fallback image has full alt text naming all five stages; labels are real buttons.
- Performance: no shadows, two lights, 14 packet meshes, 3 couriers, 5 desks; fps_floor 20; session limit 180 s.
- Security/secret scan: no secrets, no remote URLs.
- Data-mode claim verification: synthetic, labeled in the scene and in the fallback.

## Lifecycle and Commercial Path

- Current lifecycle: active_lab
- Current maturity: internal_experiment
- Next maturity gate: owner review on the Vercel preview.
- Deprecation condition: replaced by a reviewed scene.

## Roadmap

- Next: an ArtPlex command-room scene (several loops, gates, countdowns), as its own scene and PR.
- Later: if the owner wants the scene inside `/labs/artloop`, an ADR-015 amendment first.
- Not planned: project data in any scene.

## AI Notes

- Owning division and product: infrastructure-construction, ArtLoop introduction. **Not** artloop-ws.
- Canonical implementation: `components/scenes/artloop-agents-office/`, `data/scene-registry.json`
- Applicable ADRs: ADR-015, ADR-017, ADR-014
- Visibility and data mode: public_safe_demo (approved), synthetic
- Protected paths and excluded concerns: no CDN loads; no drei `useGLTF` or `Text` without self-hosted assets; no project figures.
