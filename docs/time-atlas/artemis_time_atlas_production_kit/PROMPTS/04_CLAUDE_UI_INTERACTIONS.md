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
