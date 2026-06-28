# Artemis Omni — Brand System

Translate the "renaissance-inspired commerce" concept into an Artemis-specific visual
language: ancient intelligence + modern automation, Artemis/lunar symbolism, a classical
engineering atelier, Greek/Roman architectural motifs, and Renaissance editorial
composition.

## Palette

Defined as HSL design tokens in `app/globals.css` and surfaced through
`tailwind.config.ts`.

| Token | Use | Tailwind |
| --- | --- | --- |
| Lunar black `--lunar` | deepest backgrounds | `bg-lunar` |
| Dark navy `--navy`, `--navy-deep` | panels, sections | `bg-navy`, `bg-navy-deep` |
| Silver `--silver` | hairlines, technical annotations | `text-silver` |
| Warm gold `--gold`, `--gold-soft` | primary accent, CTAs | `text-gold`, `bg-gold` |
| Parchment `--parchment` | headings, high-contrast text | `text-parchment` |

Semantic tokens (`background`, `foreground`, `muted`, `border`, `ring`) are alpha-aware
for use with Tailwind's `/<opacity>` syntax.

## Typography

- **Display serif** — Cormorant Garamond (`.display-serif`, `font-serif`). Elegant,
  editorial headings.
- **UI sans** — Inter (`font-sans`). Clean technical body/UI text.
- **Mono** — JetBrains Mono (`font-mono`). Eyebrows, annotations, data values.

Fonts load via Google Fonts `<link>` (graceful fallback to Georgia / system fonts if
offline) — see `app/layout.tsx`. The `.eyebrow` class is the standard kicker style.

## Motifs

- **Greek meander border** — `.meander-divider` (pure CSS key pattern).
- **Blueprint grid** — `bg-blueprint-grid` + `bg-grid` utilities.
- **Lunar radial** — `bg-lunar-radial` atmospheric background.
- **Gold sheen** — `bg-gold-sheen` for the lunar orb / highlights.
- **Technical annotations** — `TechnicalAnnotation` component (node + leader + label).

## Motion

- Subtle, atmospheric: `float`, `float-slow`, `drift`, `pulse-node`, `sweep`, `fade-up`
  (see `tailwind.config.ts`).
- **Always** honor `prefers-reduced-motion` (globally disabled via media query in
  `globals.css`, and via `usePrefersStatic()` for the cinematic layer).

## Components

shadcn/ui-compatible primitives live in `components/ui` (`Button`, `Card`, `Badge`,
`Container`, `SectionHeading`). Extend via `components.json` conventions.

## Voice

Executive, precise, confident, lightly classical. "Ancient intelligence, modern
automation." Avoid generic SaaS hype and over-promising. Evidence over adjectives.

## Avoid

Generic SaaS templates, game-like 3D assets, unoptimized heavy GLB files, over-animated
pages that hurt performance, and exposed secrets.
