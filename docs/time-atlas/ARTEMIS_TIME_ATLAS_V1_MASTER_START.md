# Artemis Time Atlas V1 — Command Center

## Product

**Artemis Time Atlas: Troy / Ilion c. 600 BC**

A vertical mobile-first historical reconstruction app showing Troy as a cinematic 3D diorama.

## Core Thesis

**Fixed terrain. Changing civilization.**

The terrain stays stable. Human layers appear, disappear, and transform through time.

## V1 Scope

### Build Now

- Route: `/time-atlas/troy`
- One controlled 9:16 mobile-first experience
- React Three Fiber 3D diorama
- Fixed isometric/axonometric camera
- No free camera navigation
- Scroll-driven timeline
- 600 BC active layer
- 1200 BC / 150 AD / 2026 AD as ghost teaser layers
- 8–10 clickable POIs
- POI bottom-sheet cards
- Confidence badges
- Evidence snippets
- Local data files only
- Vercel-ready build

### Do Not Build Yet

- Full globe
- Cesium streaming
- Supabase
- user accounts
- multiplayer
- full GIS pipeline
- photorealistic reconstruction
- advanced archaeology database
- free-roam controls
- multiple complete cities

## Success Standard

The prototype should feel like:

- museum scale model
- premium strategy-game map
- Apple-style scroll narrative
- historical exhibit

It should not feel like:

- a generic low-poly demo
- a flat educational webpage
- a Wikipedia wrapper
- an unfinished game prototype

## First Public Message

> One location. Three thousand years. Same terrain. Changing civilization.


# AI Agent Rules — Artemis Time Atlas

## Branch Safety

- Work only on a dedicated feature branch.
- Preferred branch: `feature/time-atlas-troy-v1`
- Do not modify unrelated product routes.
- Do not commit `.env.local`, `.next`, `node_modules`, generated build artifacts, or secrets.

## Scope Control

V1 is a controlled vertical slice.

Agents must not expand the scope to:
- full globe
- full city database
- Supabase
- user authentication
- Cesium streaming
- Unreal/Unity
- free-roam camera
- procedural world generator

## Build Discipline

Before claiming completion, run:

```bash
npm run lint
npm run build
```

If the repo has a typecheck command, also run:

```bash
npm run type-check
```

## Historical Integrity

All historical statements must have:
- confidence level
- evidence snippet
- source note
- clear separation between evidence and artistic reconstruction

Do not present speculative features as verified.

## Visual Direction

Use the phrase:

> museum-quality diorama

Avoid:
- cartoon low-poly
- photorealistic uncanny valley
- noisy game UI
- excessive fantasy styling

## Performance First

Mobile browser performance is mandatory.

Prioritize:
- instanced meshes
- procedural placeholders
- simple materials
- limited shadows
- no physics
- no heavy post-processing


# Prompt 00 — Claude Code Fable: Bootstrap the Production Factory

You are the primary implementation agent for Artemis Time Atlas V1.

## Goal

Create the permanent production foundation for a vertical mobile-first interactive historical reconstruction of Troy / Ilion c. 600 BC.

## Hard Constraints

- Work only on a dedicated branch: `feature/time-atlas-troy-v1`.
- Do not modify unrelated routes.
- Do not add Supabase yet.
- Do not build a full globe.
- Do not add free camera navigation.
- Do not expose secrets.
- Keep all V1 data local.
- Keep the route isolated at `/time-atlas/troy`.

## First Task

Create the project documentation and production factory structure inside the existing repo:

```txt
docs/time-atlas/
  README_PRODUCTION_START.md
  00_COMMAND_CENTER.md
  ENGINEERING/
    AI_AGENT_RULES.md
    ADR/
    STANDARDS/
  PROMPTS/
  RESEARCH/TROY/
  ASSETS/
```

If similar governance folders already exist, extend them rather than duplicating conflicting systems.

## Deliverables

- Production docs committed or staged
- Clear summary of created files
- No app implementation yet
- Run `git status`


# Prompt 01 — Claude Code Fable: App Scaffold

You are implementing Artemis Time Atlas V1 in the existing Next.js repo.

## Goal

Create a working shell route at:

```txt
/time-atlas/troy
```

## Install Dependencies

Install only what is needed:

```bash
npm install three @types/three @react-three/fiber @react-three/drei
npm install gsap zustand framer-motion
```

Only install `leva` if used as a development-only debug panel.

## Create Structure

```txt
app/time-atlas/troy/page.tsx
components/time-atlas/troy/TroyScene.tsx
components/time-atlas/troy/TimelineScroll.tsx
components/time-atlas/troy/PoiCard.tsx
components/time-atlas/troy/OverlayControls.tsx
components/time-atlas/troy/EraBadge.tsx
components/time-atlas/troy/ConfidenceBadge.tsx
components/time-atlas/troy/MiniMap.tsx
components/time-atlas/troy/Legend.tsx
components/time-atlas/troy/LoadingScreen.tsx
data/troy/eras.ts
data/troy/pois.ts
data/troy/layers.ts
data/troy/kmlAnchors.ts
hooks/useTimeAtlas.ts
hooks/useScrollTimeline.ts
hooks/usePoiInteraction.ts
hooks/useOverlayState.ts
types/time-atlas/index.ts
```

## Route Requirements

- Full viewport vertical experience
- Mobile-first 9:16 composition
- Desktop may center the vertical app frame
- Metadata title: `Artemis Time Atlas — Troy c. 600 BC`
- Description: `A museum-quality interactive reconstruction of Troy through time.`
- No global navigation interference unless the existing app requires it

## Do Not

- Do not build the full 3D scene yet.
- Do not add Supabase.
- Do not add external secrets.
- Do not add Cesium.

## Validation

Run:

```bash
npm run lint
npm run build
```

Fix errors before completion.


# Prompt 02 — Claude Code Fable: Local Data Layer

Create the local data layer for Artemis Time Atlas V1.

## Required Files

```txt
data/troy/eras.ts
data/troy/pois.ts
data/troy/layers.ts
data/troy/kmlAnchors.ts
types/time-atlas/index.ts
```

## Data Requirements

- 4 eras:
  - 1200 BC ghost teaser
  - 600 BC active
  - 150 AD ghost teaser
  - 2026 AD ghost teaser

- 10 POIs:
  - Citadel
  - Temple of Athena
  - Lower Town
  - South Gate
  - Harbor Outpost
  - Scamander River
  - Farmland
  - Sacred Spring
  - Hellespont / Dardanelles
  - Mount Ida

- 5 layers:
  - Defense
  - Trade
  - Religion
  - Agriculture
  - Water

## Historical Credibility

Each POI must include:
- confidence level
- evidence snippet
- source note
- coordinates
- local scene position
- layer
- category

## Tone

Use cautious scholarly language.

Do not assert speculative details as facts.

## Validation

Create a utility or runtime check that ensures:
- every POI references a valid layer
- every POI references a valid era
- every POI has a confidence label
- every POI has an evidence snippet


# Prompt 03 — Claude Code Fable: Core 3D Diorama Scene

Build the initial React Three Fiber scene for `/time-atlas/troy`.

## Visual Goal

A museum-quality strategy-map diorama of Troy / Ilion c. 600 BC.

## Camera

- Fixed isometric/axonometric perspective
- No free orbit controls in production
- Gentle auto-pan
- subtle pointer parallax
- no camera movement that breaks the composed view

## Scene Elements

Use procedural geometry first:

- Hisarlik hill
- Scamander plain
- Dardanelles water
- coastline
- Mount Ida backdrop
- citadel
- inner walls
- lower town houses
- temple
- farms
- roads
- harbor
- ships
- trees
- haze/fog

## Style

- matte clay, stone, wood, terracotta
- golden-hour lighting
- soft shadows
- subtle atmospheric haze
- readable from mobile screen
- not cartoon low-poly
- not photorealistic

## Performance

- instanced trees
- instanced small houses where sensible
- limited shadows
- no physics
- no heavy post-processing
- keep draw calls controlled

## Deliverables

- visible 3D scene
- loading fallback
- mobile-safe canvas
- data-driven POI marker positions
- active layers influence marker visibility


# Prompt 04 — Claude Code Fable: UI and Interaction Layer

Implement the complete mobile UI for Artemis Time Atlas V1.

## Components

- Title plaque
- Era badge
- Vertical or bottom timeline
- POI labels
- POI bottom sheet
- Overlay controls
- Mini-map
- Legend
- Historical reconstruction disclaimer

## Interactions

### Timeline

- 1200 BC: ghost teaser
- 600 BC: active
- 150 AD: ghost teaser
- 2026 AD: ghost teaser

Scrolling should update the active era display and fade ghost layers if implemented.

### POIs

Tapping a POI:
- highlights marker
- opens bottom sheet
- shows title
- description
- confidence badge
- evidence snippet
- source note
- layer category

### Overlay Controls

Toggling a layer:
- filters POI markers
- changes highlighted objects where implemented
- updates UI state through Zustand

## Accessibility

- bottom sheet focus management
- buttons have labels
- color is not the only state indicator
- reduced motion respected


# Prompt 90 — Codex: Independent Review and Hardening

You are the independent reviewer for Artemis Time Atlas V1.

Review the branch `feature/time-atlas-troy-v1`.

## Focus Areas

- route isolation
- TypeScript correctness
- lint/build issues
- React Three Fiber anti-patterns
- mobile performance risks
- unnecessary dependencies
- security/secrets
- accessibility
- historical claim labeling
- Vercel deployment risk

## Rules

- Do not rewrite the whole app.
- Make targeted fixes only.
- Do not add Supabase.
- Do not add a full globe.
- Do not add free camera navigation.

## Commands

Run:

```bash
npm run lint
npm run build
```

If available:

```bash
npm run type-check
```

## Deliverables

- concise PR review
- list of files changed
- issues fixed
- issues left for later
- merge readiness recommendation
