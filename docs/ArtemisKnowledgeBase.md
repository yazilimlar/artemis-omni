# Artemis Omni — Knowledge Base

The single entry point for understanding this repository: what Artemis is, how the
site is built, and where to find everything.

## 1. What Artemis Omni is (public positioning)

Artemis Omni is a **5D Construction Intelligence Bridge** — a Project Intelligence
Command Center for heavy civil, infrastructure, project controls, ERP/CMiC workflows,
digital twins, and executive forecasting. Its defining output is a live **5D** cashflow
comparison: **Bid Estimate vs Actuals vs PM Forecast vs System-Generated Projections**,
connecting design → geometry → quantities → schedule → field production → actual cost →
billing revenue → PM Forecast → system projections → cashflow → risk/opportunity →
executive action.

> The broader long-term vision (Artemis Core modules — Flow/Desk/Docs/Connect/Ops — and
> additional verticals as an SMB AI Business OS) is **internal roadmap only** and must
> **not** appear on the public homepage yet. See `BrandArchitecture.md` and
> `ProductRoadmap.md`. Lead with the construction beachhead first.

The website's job is to communicate the construction beachhead with an **executive-grade,
premium, cinematic** aesthetic while remaining fast, accessible, and easy to extend.
Disallowed product language: "atelier", "AI Decision Mesh", "ancient intelligence,
modern automation", mystical claims, and generic "AI platform" framing (`BrandSystem.md`).

## 2. Phase 1 scope (this repo)

A foundation, deliberately not overbuilt:

- Working Next.js App Router shell (TypeScript + Tailwind)
- Premium homepage with the cinematic **5D Construction Intelligence Bridge** hero
- Responsive navigation + footer
- All main routes: Solutions, Labs, Academy, Tools, Case Studies, About, Contact
- MDX content system with sample Academy / Labs / Case Study packages
- Sample interactive Tool (Fuel Price Adjustment)
- SEO + Open Graph helpers, sitemap, robots
- Docs, prompts, and ADRs for the AI operating model

## 3. Architecture at a glance

| Concern | Where |
| --- | --- |
| Routes / pages | `app/` |
| Reusable UI | `components/ui`, `components/layout` |
| Cinematic hero | `components/cinematic` (lazy-loaded, SVG/CSS, R3F-ready) |
| Interactive tools | `components/tools` + `lib/tools.ts` |
| MDX content | `content/*` + `lib/content` + `components/content` |
| SEO | `lib/seo/metadata.ts`, `app/sitemap.ts`, `app/robots.ts` |
| Brand tokens | `app/globals.css` + `tailwind.config.ts` |
| Site config / nav | `lib/site.ts` |

## 4. Key principles

1. **Fast by default.** No heavy WebGL on first load; cinematic code is isolated and
   lazy-loaded. The site must work without WebGL.
2. **Accessible.** Reduced-motion and mobile users get a static fallback; hero copy is
   real DOM for SEO and screen readers.
3. **Modular content.** Articles/tools/case studies are self-contained packages future
   AI agents can add without touching rendering code.
4. **No secrets in code.** All keys come from environment variables. See
   `SecurityRules.md`.

## 5. Related documents

- `ProductVision.md` — what we're building and why
- `BrandSystem.md` — palette, type, motifs, disallowed product language
- `brand/BrandAssetNotes.md` — intake analysis of reference imagery in `/public/brand/reference/` *(reference only)*
- `BrandArchitecture.md` — umbrella, beachhead, Core modules + verticals *(internal)*
- `ProductRoadmap.md` — phased sequencing from beachhead to Business OS *(internal)*
- `ArtemisFlow.md` — Artemis Flow module positioning *(internal, not public)*
- `ContentSystem.md` — how to author MDX content packages
- `AIWorkflow.md` — the multi-tool AI operating model
- `DeploymentPlan.md` — deployment options (Vercel preview / staging / production)
- `SecurityRules.md` — secrets, env vars, do/don't
- `../decisions/` — Architecture Decision Records
