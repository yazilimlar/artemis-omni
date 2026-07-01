# Color System

## Color Philosophy

Rainbow Botanics does not use a single universal black background. The visual system is
species-driven. Every palette is derived from:

- source photos,
- plant morphology,
- habitat,
- season,
- knowledge mode,
- accessibility constraints.

## Token Roles

Each generated theme must define:

| Token | Purpose |
| --- | --- |
| `background` | page or mode ground |
| `surface` | panels, sheets, and grouped content |
| `surface_alt` | secondary surface |
| `text` | primary readable text |
| `muted_text` | secondary text |
| `primary` | main botanical color |
| `secondary` | supporting botanical color |
| `accent` | actions, highlights, active tab |
| `line` | borders, dividers, technical lines |
| `focus` | keyboard focus state |
| `warning` | source or QA warnings |

## Palette Types

### Extracted Palette

Measured or sampled from photos.

### Habitat Palette

Chosen from ecosystem context.

### Seasonal Palette

Computed from current or selected phenology state.

### Mode Palette

Overrides for scientific, engineering, heritage, social, or Atlas modes.

## Hemerocallis fulva Baseline

```text
primary: #FFD700
secondary: #FF8C00
accent: #D2691E
structural: #8B1A1A
leaf: #228B22
shadow: #556B2F
paper: #FFF8F0
blueprint_background: #6A3B1F
blueprint_line: #F7E7C2
```

## Public QA

Before a theme is accepted:

- Verify contrast for body text and buttons.
- Confirm focus rings are visible.
- Confirm the palette works on mobile and desktop.
- Confirm no text is placed over high-detail photos without a readable overlay.
- Confirm the theme does not visually imply unverified historical era or cultural
  provenance.
