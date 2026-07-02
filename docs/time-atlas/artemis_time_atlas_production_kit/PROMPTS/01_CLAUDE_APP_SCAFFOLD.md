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
