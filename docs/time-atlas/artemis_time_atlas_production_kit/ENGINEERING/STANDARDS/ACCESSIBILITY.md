# Accessibility Standard

## Requirements

- UI controls must be keyboard reachable.
- Bottom sheet must trap focus when open.
- Buttons need descriptive labels.
- Color is not the only indicator of state.
- Text contrast should meet WCAG AA where possible.
- Motion should be subtle and avoid flashing.

## 3D Scene Accessibility

The 3D canvas should be accompanied by accessible text:
- page description
- list of POIs
- current era label
- selected layer labels
- historical disclaimer

## Reduced Motion

Respect `prefers-reduced-motion`.
If reduced motion is enabled:
- reduce camera auto-pan
- reduce scroll transition intensity
- preserve all content access
