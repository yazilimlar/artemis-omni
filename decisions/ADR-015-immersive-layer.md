# ADR-015 - Immersive 3D Layer

- **Status:** Accepted
- **Date:** 2026-10-01
- **Supersedes:** ADR-002 (Cinematic / WebGL Layer)
- **Extends:** ADR-006, ADR-014
- **Cross-division effect:** core-platform owns the rendering island, the scene registry
  and the budget tooling. studio-media owns the visual scenes. Each scene's passport
  names the owning division.

## Context

### What ADR-002 decided, and what happened

ADR-002 (accepted 2026-06-28) decided, for Phase 1:

> For Phase 1, implement the hero with **HTML + SVG + CSS animations**, not a 3D engine

> The animated scene lives behind a single boundary, `ArtemisSceneCanvas`, and is
> **lazy-loaded** via `next/dynamic` with `ssr: false`.

> A future **React Three Fiber** scene (with Draco-compressed GLB assets) can replace the
> internals of `ArtemisSceneCanvas` behind the same boundary, lazy-loaded the same way —
> without touching pages, copy, or fallbacks.

It rejected R3F for Phase 1:

> **Ship R3F now** — rejected for Phase 1: bundle weight, asset pipeline not ready, risk
> to performance/accessibility goals.

The repository today, verified 2026-10-01:

- **Phase 1 was implemented.** `components/cinematic/` holds `CinematicHero`, the lazy
  `ArtemisSceneCanvas` boundary, `ReducedMotionFallback`/`SceneFallback` and
  `usePrefersStatic` (commit `0fed419`). **No route currently mounts `CinematicHero`.**
- **The R3F upgrade path was never implemented.** There is no `three`,
  `@react-three/fiber` or `@react-three/drei` dependency, and `public/models/` and
  `public/textures/` exist but are empty.
- 3D already runs on the site, but only inside standalone HTML labs:
  - `public/standalone/*.html` (tax-architecture-2026, troy-time-atlas-600bc,
    finance-architecture-5d, artemis-atlas-kings-highway-v0) and
    `public/labs/geometric-workbench/v5-8/`;
  - they load **Three.js from third-party CDNs** (jsDelivr, cdnjs) at mixed versions
    (r128, 0.160.0, 0.164.1) and run same-origin. ADR-014 already records that
    same-origin standalone labs can read the JS-readable Supabase session cookie.
- `app/labs/[slug]` (MDX Labs content) already occupies the dynamic segment under `/labs`.

Since ADR-002, M1–M6 added the following, so a concrete plan is needed that fits the
current architecture:

- registry-driven routes;
- auth (ADR-011), roles (ADR-012), proposals (ADR-013);
- the sandbox (ADR-014).

### Superseded parts of ADR-002

- The "future R3F scene … replace the internals of `ArtemisSceneCanvas`" path, and the
  homepage as the place for 3D. Both are replaced by the registered-scene model below; the
  homepage is excluded from 3D in v1.
- The Phase 1 rejection of R3F, which is lifted for registered scenes only.
- Still in force, and carried forward: the lazy `ssr: false` boundary, server-rendered copy,
  static-first fallbacks, and `usePrefersStatic`-style gating. The existing
  `components/cinematic/` code may be reused, but is not required.

## Decision

The 3D immersive layer is a **progressive enhancement, not a site-wide rewrite**. It exists
only in **registered scenes**, never in arbitrary routes.

### Architecture

- The 2D presentation engine stays the default for every route. Copy, headings and
  navigation are always server-rendered.
- **One React island** (a client component) hosts the 3D canvas. Pages render a server
  fallback, and the island upgrades it in place.
- Scenes are registered in `data/scene-registry.json`, following the
  `PRODUCT_REGISTRY.yaml` and `data/artifact-registry.json` pattern. It is changed only
  through reviewed PRs.
- Fields per scene:
  - `id`, `title`, `division`;
  - `entry_component` (a path under `components/scenes/<id>/`);
  - `route`;
  - `visibility`, `data_mode` (Product Registry vocabulary);
  - `assets` (a list of same-origin paths);
  - `performance_budget` (asset MB, JS KB);
  - `fallback_2d` (a static image path or a 2D component path).

### Rendering stack (locked for v1)

- Three.js via `@react-three/fiber` (R3F), plus `@react-three/drei` for helpers. Major
  versions must support React 19, and `three` comes from npm.
- No other 3D libraries in the Next.js application bundle, and no physics engine, in v1.
- The island loads through `next/dynamic(() => import(...), { ssr: false })` from inside a
  client component. Next 15 does not allow `ssr: false` in server components.
- 3D code loads only on routes with a registered scene.
- **No third-party runtime fetches.** Scenes must not load code, models, textures, fonts or
  decoders from a CDN.
  - The DRACO/meshopt decoders are self-hosted under `public/`. By default drei's
    `useGLTF` fetches its DRACO decoder from a Google CDN; that default is not allowed.
  - The drei `<Text>` font is self-hosted; by default it is fetched from a CDN.
  - All assets are same-origin. These scenes are first-party code running on the Artemis
    origin, which can read session cookies (ADR-014 context), so supply-chain exposure is
    kept to the reviewed npm lockfile.
- Standalone HTML labs and sandboxed artifacts are **not** governed by this stack lock;
  ADR-014 governs them. Their CDN-loaded Three.js is a recorded risk for that track.

### Where 3D may appear in v1

- **`/labs/scenes/[id]`**, a new registry-driven route. The brief's `/labs/<scene-id>`
  would collide with the existing `app/labs/[slug]` dynamic segment, and per-scene static
  folders would allow routes that skip the registry check. Unregistered ids return 404.
- **`/departments/*` hero sections:** opt-in per department, decided editorially, and only
  through a registered scene whose `route` names that page.
- **`/dashboard`:** an owner-only preview block, later. It requires the ADR-012 owner role.

### Where 3D must NOT appear

- The homepage, in v1.
- Any route not named by a scene in the registry.
- Any route whose visibility is `public_safe_demo`, unless the scene is explicitly approved
  (`approved_public: true` recorded in the registry, with the approving PR in the scene
  passport).

### Performance budget (enforced by code)

| Budget | Enforcement |
|---|---|
| ≤ 400 KB gzipped of initial JS added by the 3D island | Post-build check of the island chunk(s) in `.next`, in CI; it fails the PR |
| No texture larger than 2048×2048 | `scripts/validate-scenes.ts` reads image dimensions; it fails the build |
| Per-scene asset budget (MB) | `scripts/validate-scenes.ts`; it fails the build |
| Models > 500 KB must be DRACO- or meshopt-compressed | `scripts/validate-scenes.ts` inspects the GLB extensions; it fails the build |
| 60 fps desktop target; 30 fps acceptable on mobile | Targets, verified in scene review |
| FPS < 20 for 3 consecutive seconds → automatic 2D fallback | Runtime monitor in the island |
| `prefers-reduced-motion: reduce` → always 2D | Runtime (reuses `usePrefersStatic`) |
| Low-end device → 2D | Runtime: `navigator.hardwareConcurrency < 4`, or `navigator.deviceMemory < 4` **where supported**. `deviceMemory` is Chromium-only, so an unknown value is not a reason to downgrade. |

`scripts/validate-scenes.ts` must run in CI and as part of `npm run build` (e.g. a
`prebuild` step) to count as enforced.

### Asset policy

- Assets live under `public/models/` and `public/textures/`. Both directories already
  exist and are empty.
- Each scene declares its total asset budget (MB) in the registry. Going over it is a
  build-time error.
- Models over 500 KB must use DRACO or meshopt compression, with self-hosted decoders.

### Fallback

- Every scene **must** declare `fallback_2d`.
- The fallback renders on:
  - server render (SSR);
  - reduced motion;
  - a low-end device;
  - WebGL being unavailable or the context being lost;
  - the FPS threshold being breached;
  - the island failing to load (error boundary).
- The fallback carries the same information as the scene. 3D never holds content that
  exists nowhere else.

### Governance

- Adding a scene requires:
  - an entry in `data/scene-registry.json`;
  - its component under `components/scenes/<id>/`;
  - a feature passport (`ENGINEERING/FEATURE_PASSPORT_TEMPLATE.md`).
- A scene becomes public only through the standard visibility workflow: registry PR and
  review.
- `validate-scenes.ts` also checks, for every scene:
  - `fallback_2d` exists;
  - `entry_component` is under `components/scenes/<id>/`;
  - `route` is allowed by this ADR;
  - every asset is a same-origin path.

## Non-goals (v1)

- No VR, AR or WebXR.
- No multiplayer or real-time sync.
- No physics.
- No user-generated 3D content and no in-browser 3D editor.
- No 3D anywhere except registered routes, and none on the homepage.
- No migration of the standalone Three.js labs; ADR-014 handles those.

## Consequences

- **New dependencies** (in the implementation PR): `@react-three/fiber`,
  `@react-three/drei`, `three` (and `@types/three`).
- **New directories and files:**
  - `components/scenes/`;
  - `data/scene-registry.json`;
  - self-hosted decoder and font assets under `public/`.
- **New script:** `scripts/validate-scenes.ts` (budgets, texture size, compression,
  fallback, routes, same-origin assets), wired into CI and the build. This needs a way to
  run TypeScript scripts (e.g. `tsx`) or the script must be written in JS; the
  implementation PR decides.
- **New route:** `/labs/scenes/[id]`.
- **`/labs` index:** it reads the scene registry as well as the product registry.
- **First scene:** a synthetic demo (proof of concept), not a real product.
- ADR-002 is superseded. Its Phase 1 components in `components/cinematic/` stay
  unmounted unless a later decision reuses them.

## References

ADR-002, ADR-006, ADR-014, `ENGINEERING/PROJECT_GENOME.yaml` (`mapping` section and the
`mapping` and `visualization` shared capabilities), PR #67, PR #69.
