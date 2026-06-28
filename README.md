# Artemis Omni — Website Prototype

The first production-grade prototype of the **Artemis Omni** website: an AI-first
intelligence platform for engineering, construction, project controls, and business
operations.

> Phase 1 goal: a fast, SEO-friendly, maintainable business website with selected
> high-impact cinematic pages — not a heavy WebGL site.

## Stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** (shadcn/ui-compatible component structure)
- **MDX** for Academy articles, Labs notes, and Case Studies
- React components for tools, calculators, and infographics
- Lightweight SVG/CSS cinematic hero (R3F-ready, lazy-loaded boundary)
- **Vercel** for deployment · **GitHub** as source of truth
- Supabase later (no auth/db in this phase)

## Getting started

```bash
cd artemis-omni
npm install
cp .env.local.example .env.local   # then edit values
npm run dev                        # http://localhost:3000
```

Useful scripts:

```bash
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## Project structure

```
app/                 # routes (Home, Solutions, Labs, Academy, Tools, Case Studies, About, Contact)
components/
  ui/                # shadcn-style primitives (button, card, badge, container, section-heading)
  layout/            # SiteHeader, SiteFooter, PageHero, ArtemisMark
  cinematic/         # ArtemisSceneCanvas, CinematicHero, artifacts + fallbacks
  infographics/      # (reserved)
  tools/             # interactive tools (Fuel Price Adjustment, Pilot Request form)
  content/           # MDX rendering layout + Prose + ContentCard
content/
  academy/  labs/  case-studies/   # MDX content packages (frontmatter + body)
  scenes/                          # (reserved for future cinematic scene data)
lib/
  seo/     # createMetadata() + JSON-LD
  content/ # MDX collection loader (gray-matter + dynamic import)
  utils/   # cn(), usePrefersStatic()
  analytics/  # placeholder
  site.ts  tools.ts
public/    # models/ textures/ images/ og/  (asset placeholders)
docs/      # knowledge base, vision, brand, content, AI workflow, deployment, security
prompts/   # AI workflow prompt files
decisions/ # ADRs
```

## Content authoring

Add an `.mdx` file under `content/academy`, `content/labs`, or `content/case-studies`
with the frontmatter shown in [`docs/ContentSystem.md`](docs/ContentSystem.md). It will
appear automatically in the listing and get its own page, SEO metadata, and sitemap entry.

## Documentation

See [`docs/`](docs/) — start with `ArtemisKnowledgeBase.md`. Deployment to Vercel and
`artemis.agoraxai.com` is in [`docs/DeploymentPlan.md`](docs/DeploymentPlan.md). Security
rules (secrets, env vars) are in [`docs/SecurityRules.md`](docs/SecurityRules.md).

## Status & limitations

This is a foundation. Known limitations and the recommended next ticket are tracked in
the build summary and in `decisions/`. No secrets are committed; the pilot form does not
yet send messages (no backend in this phase).
