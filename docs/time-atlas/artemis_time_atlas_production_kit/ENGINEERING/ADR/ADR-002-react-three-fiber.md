# ADR-002 — Use React Three Fiber for Web 3D

## Status
Accepted

## Decision
Use React Three Fiber, Three.js, and Drei for the Troy diorama.

## Rationale
React Three Fiber fits the existing React/Next.js stack and enables a high-quality web-native 3D scene without requiring Unreal or Unity.

## Consequences
- Keep the scene lightweight.
- Use instancing for repeated objects.
- Avoid expensive post-processing in the first build.
- Keep non-3D UI as normal React/Tailwind components.
