# Feature Passport: artplex-command-room

## Identity

- ID: artplex-command-room
- Name: ArtPlex Command Room
- Division: infrastructure-construction (scene owner; Artemis Construction, estimating); core-platform (island, registry, tooling)
- Product family: immersive-layer
- Product: ArtPlex introduction (`/labs/artplex`). **This scene is not the gated ArtPlex control panel.** That panel runs inside the private, fail-closed ArtLoop workspace. The scene shows no pursuit, date, result or figure from it.
- Owner / review authority: infrastructure-construction (team role); release authority is the owner
- Lifecycle status: active_lab
- Commercial maturity: internal_experiment (synthetic visual)
- Visibility class: public_safe_demo, with `approved_public: true`. Approval is recorded by the owner's review and merge of the PR on `labs/artplex-command-room`.
- Data mode: synthetic
- Version: 1
- Created: 2026-11-02
- Modified: 2026-11-02

## Canonical Implementation

- Canonical route: /labs/scenes/artplex-command-room
- Canonical branch: main (via labs/artplex-command-room)
- Canonical commit or release tag: the merge commit of that PR
- Product Registry entry: none (a scene, not a product)
- Division Registry entry: infrastructure-construction
- Source-of-truth data/system: data/scene-registry.json

## Purpose

A command room that shows the three ideas on `/labs/artplex` working at once across several pursuits. It is the companion to `artloop-agents-office`: one loop per project there, the layer above every loop here. It is reached from "See the command picture in 3D" under "The command picture" on `/labs/artplex`, and from the /labs scene list.

## Scope

In scope:

- Six synthetic pursuits, lettered A to F, on a ring around a central experience ledger. Each pursuit has a small ArtLoop infinity mark and an agent.
- **Countdown:** a gold arc around each pursuit shrinks toward bid time and turns red near the end. Pursuit D has no due date, so it shows a dashed **NOT SET** ring and no arc. The board never invents a deadline.
- **Ball-in-court:** a gold token hops between six owner seats, matching the six owners named on the page: us, GC/CM, owner, sub or vendor, model team, approver.
- **Gates:** five pillars per pursuit (boundary, intake, capacity and fit, commercial, submission authorization). Passed gates are gold and the current one pulses. Pursuit E is held at a red hard stop at the commercial gate.
- **Experience ledger:** at each bid close, a packet flies from the pursuit to the central column and adds a disc.
- An overhead command ring, beams to each pursuit, and three walking analysts.
- A camera tour every 7 s: the whole room, then Countdown, Ball-in-court, Gates and the Experience ledger. View buttons and clickable pursuit labels hold the tour for 14 s.
- A `paused` prop, and a static SVG fallback: the same room from above, with a legend for the three ideas.

Out of scope:

- Pursuit data, project names, dates, results, figures, owner names, or anything from the gated workspace. The "n of 5 gates passed" captions describe the synthetic letters only.
- Modules on the page that are not part of the command picture (historical results, alternates, leveling, escalation).
- External models, textures, fonts, drei.
- 3D on `/labs/artplex` itself (ADR-015; the page links here).

## Product and Division Boundaries

- Product-specific responsibilities: scene visuals and copy only.
- Shared Artemis Core capabilities consumed: SceneIsland (fallback chain), the scene registry, validate-scenes.
- Cross-division dependencies: core-platform island and tooling.
- Other products explicitly not owned by this feature: the gated ArtPlex control panel, `artloop-ws`, ArtLoop's scene (`artloop-agents-office`, no shared code), AttemptBook, and all standalone labs.
- Allowed import directions: `components/scenes/artplex-command-room` → `three`, `@react-three/fiber`.
- Forbidden import directions: no imports from other scenes or products, `lib/supabase` or `lib/github`.

## Testbed and Donor Provenance

- Testbed ancestry: None. It follows the pattern of `artloop-agents-office` (PR #288) but shares no code with it, by design.
- Donor branches: None
- Donor commits: None
- Selected source paths: None
- Excluded donor concerns: None
- Migration disposition: None
- Migration record: None
- Retirement/deprecation condition: replaced by a reviewed infrastructure-construction scene.

## Dependencies

- Code:
  - three 0.186
  - @react-three/fiber 9
  - Next.js `next/dynamic` (`ssr: false`)
- Data: none
- Third-party services: none
- Environment variables: none
- External assets: none. Labels are DOM buttons positioned by projection. The fallback is same-origin at `/textures/artplex-command-room/fallback.svg`.
- Shared platform interfaces: `components/scenes/SceneIsland.tsx`

## Data Truth

- Declared data mode: synthetic
- Live source and retrieval method: none
- Sample/synthetic source: `components/scenes/artplex-command-room/pursuits.ts` (letters, gate counts, cycle timings). Gate, court and idea wording are copied from `/labs/artplex`.
- Fallback behavior: static SVG whenever any of these apply:
  - reduced motion;
  - no WebGL;
  - a low-end device;
  - FPS below the floor (20);
  - an error;
  - SSR;
  - the session limit (180 s) has been reached.
- Timestamp/freshness behavior: countdowns are animation cycles, not clocks. No date or time is shown.
- Official source-of-truth statement: an illustration of the ArtPlex command picture. It shows no pursuit and makes no claim about any bid.

## Architecture Links

- Related ADRs: ADR-015 (governing), ADR-017 (native visual: a pursuit command board), ADR-006, ADR-014 (`/labs/artplex` stays a sandboxed standalone document)
- Related docs: data/scene-registry.schema.json, scripts/validate-scenes.mjs
- Related prompts: owner request 2026-11-02 ("How about the other page (for ArtPlex)?") after approving the ArtLoop scene preview

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public synthetic content only
- User data handling: none
- Internal operational information exposed: none
- Authentication/authorization: none (approved public_safe_demo)
- Known risks: the scene route is indexable (approved public_safe_demo), while `/labs/artplex` is noindex. Same open owner decision as `artloop-agents-office`.

## Validation

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build` (prebuild and postbuild run validate-scenes)
- Unit tests: tests/unit/scene-registry.test.ts (validates the committed registry, including this scene)
- Browser QA:
  - labels render;
  - view buttons and pursuit labels focus the camera;
  - NOT SET and hard stop are visible;
  - the fallback appears under reduced motion.
- Accessibility: the fallback has full alt text; labels and view buttons are real buttons with names.
- Performance: no shadows, three lights, 49 shared countdown geometries swapped by reference (no per-frame allocation); fps_floor 20; session limit 180 s.
- Security/secret scan: no secrets, no remote URLs.
- Data-mode claim verification: synthetic, labeled in the scene and in the fallback.

## Lifecycle and Commercial Path

- Current lifecycle: active_lab
- Current maturity: internal_experiment
- Next maturity gate: owner review on the Vercel preview.
- Deprecation condition: replaced by a reviewed scene.

## Roadmap

- Later: if the owner wants either scene inside its introduction page, an ADR-015 amendment first.
- Not planned: pursuit data in any scene.

## AI Notes

- Owning division and product: infrastructure-construction, ArtPlex introduction. **Not** the gated control panel.
- Canonical implementation: `components/scenes/artplex-command-room/`, `data/scene-registry.json`
- Applicable ADRs: ADR-015, ADR-017, ADR-014
- Visibility and data mode: public_safe_demo (approved), synthetic
- Protected paths and excluded concerns: no CDN loads; no project figures, dates or names; keep NOT SET honest (never give Pursuit D a countdown).
