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
