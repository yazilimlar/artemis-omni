# Artemis Omni — Brand System

The visual system serves one product positioning: **Artemis Omni as a 5D Construction
Intelligence Bridge** — a Project Intelligence Command Center for heavy civil and
infrastructure. The aesthetic may be premium, cinematic, classical, lunar, and
executive-grade, but the *language* must stay construction-credible (see the Voice and
"Disallowed language" sections below, and `BrandArchitecture.md`).

Visual motifs: lunar symbolism, classical/Greek-Roman architectural lines, blueprint
grids, fine technical annotations, and project-controls artifacts (cashflow curves,
schedules, BIM/quantity fragments). These are **visual** devices — they dress the
5D construction intelligence story; they are not the product story themselves.

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

Executive, precise, confident, lightly classical — and unmistakably about construction.
Lead with concrete project-controls meaning: *"Connect the field to the forecast to the
cash."* Speak to heavy civil contractors, infrastructure owners, PMCM teams, estimators,
project controls managers, and executives. Evidence over adjectives.

## Disallowed product language

Do **not** describe Artemis with these (they make it sound like an art installation,
fantasy site, or vague AI SaaS):

- ❌ "atelier"
- ❌ "AI Decision Mesh"
- ❌ "ancient intelligence, modern automation"
- ❌ mystical/fantasy product claims
- ❌ generic "AI platform" language with no project-controls meaning

Use instead: **5D Construction Intelligence**, **Project Intelligence Command Center**,
**construction intelligence bridge**, **Cashflow Intelligence Engine**, and the explicit
comparison **Bid Estimate vs Actuals vs PM Forecast vs System-Generated Projections**.
Note: "lunar" remains acceptable as a *visual/palette* descriptor only.

## Avoid (visual/build)

Generic SaaS templates, game-like 3D assets, unoptimized heavy GLB files, over-animated
pages that hurt performance, and exposed secrets.
