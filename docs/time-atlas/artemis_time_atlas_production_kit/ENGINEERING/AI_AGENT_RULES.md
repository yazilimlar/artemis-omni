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
