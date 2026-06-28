# 00 — Master Site Brief (Artemis Omni)

The canonical brief. All implementation and review prompts derive from this.

## Company / positioning (public)

Artemis Omni — a **5D Construction Intelligence Bridge** and Project Intelligence Command
Center for heavy civil, infrastructure, project controls, ERP/CMiC workflows, digital
twins, and executive forecasting. The defining output is a live **5D** comparison: **Bid
Estimate vs Actuals vs PM Forecast vs System-Generated Projections**, connecting design →
geometry → quantities → schedule → field production → actual cost → billing revenue → PM
Forecast → system projections → cashflow → risk/opportunity → executive action.

Audience: heavy civil contractors, infrastructure owners, PMCM teams, estimators, project
controls managers, and executives.

> The broader SMB AI Business OS vision (Artemis Core: Flow/Desk/Docs/Connect/Ops; verticals
> Construct/Twin/Atlas) is **internal roadmap only** — do NOT put it on the public homepage
> yet. Lead with construction. See `docs/BrandArchitecture.md` + `docs/ProductRoadmap.md`.

## Deployment

Default sharing is the Vercel-generated `*.vercel.app` preview URL. `artemis.agoraxai.com`
is only a **possible future** staging domain — NOT assumed live or configured. The final
domain is `ArtemisOmni.com` (future). `agoraxai.com` stays on Squarespace as a shell;
never build Artemis inside Squarespace; never expose Squarespace/DNS credentials. See
`docs/DeploymentPlan.md` (options A/B/C).

## Stack

Next.js App Router · TypeScript · Tailwind · shadcn-compatible · MDX · React tools/infographics
· R3F/GSAP/Lenis for selected cinematic sections only · Vercel · GitHub · Supabase later.

## Critical principle

Fast, SEO-friendly, maintainable business site with **selected** high-impact cinematic
pages. Do **not** make the whole site a heavy WebGL animation.

## Creative direction (visual only — language stays construction-credible)

Premium, cinematic, classical, lunar, executive-grade. Artemis/lunar symbolism,
classical/Greek-Roman architectural lines, and project-controls artifacts (cashflow
curves, schedules, BIM/quantity fragments, system projections, annotations). Palette:
dark navy, lunar black, silver, warm gold, parchment. Serif display + technical sans.
Meander borders, blueprint grids, fog, bloom.

**Disallowed product language** (the visuals may be classical/lunar, but the copy must
not): "atelier", "AI Decision Mesh", "ancient intelligence, modern automation", mystical
claims, generic "AI platform" framing. Use 5D Construction Intelligence / Project
Intelligence Command Center / Cashflow Intelligence Engine instead.

## Sections

Home · Solutions · Labs · Academy · Tools · Case Studies · About · Contact/Pilot Request.

## Homepage hero

**5D Construction Intelligence Bridge** — a Project Intelligence Command Center. Headline
leads with outcome (e.g. *"Connect the field to the forecast to the cash."*) and names the
4-way comparison (Bid vs Actuals vs PM Forecast vs System Projections) and the audience.
The page also carries the connected value chain (Design → … → Executive Action). Primary
artifact: a 5D cashflow forecast curve (Cashflow Intelligence Engine). Supporting: BIM/
quantity fragment, map/grid, schedule bar, system-projection nodes, annotations, lunar
orb (visual). First version may use procedural/SVG/CSS instead of final GLB.

## Requirements

Static + reduced-motion fallback, lazy-load cinematic code, lightweight first load,
SEO-accessible text outside the canvas, works without WebGL, no secrets committed, docs +
prompts + ADRs present, structure ready for future AI-added content/tools/scenes.
