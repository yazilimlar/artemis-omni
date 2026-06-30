# Artemis Vercel Milestone And Next Phase Architecture

Date: 2026-06-30
Status: Custom subdomain verified live
Production domain: https://artemis.agoraxai.com
Vercel project: artemis-omni
Local workspace: /Users/theoppositeofturtle/Documents/artemis-for-codex/artemis-omni-codex-local

## Executive Record

Artemis moved into a live Vercel-hosted product surface on 2026-06-30. The parent
AgoraXAI web presence remains on Squarespace, while Artemis now runs as its own
Next.js application on the Vercel subdomain:

```text
agoraxai.com                 -> Squarespace parent site
www.agoraxai.com             -> Squarespace parent site
artemis.agoraxai.com         -> Vercel / Next.js Artemis Omni app
agoraxai.com/artemis-2026    -> Squarespace page or redirect only, not DNS-routable
```

The DNS rule is permanent until ownership deliberately changes:

```text
Do not move the root/apex agoraxai.com domain to Vercel.
Do not add A @ 216.198.79.1 unless the company intentionally moves the root domain.
Do not change nameservers.
Keep artemis.agoraxai.com on Vercel through the subdomain CNAME.
```

Current verified DNS and hosting pattern:

```text
Squarespace / Google Domains DNS
  CNAME artemis -> cname.vercel-dns.com

Vercel
  Project: artemis-omni
  Domain: artemis.agoraxai.com
  Framework: Next.js
```

Current live verification command:

```bash
curl -I -L --max-time 20 https://artemis.agoraxai.com
```

Expected current result:

```text
HTTP/2 200
server: Vercel
```

## System Architecture

```text
Browser
  |
  | HTTPS
  v
artemis.agoraxai.com
  |
  | CNAME through Squarespace / Google Domains DNS
  v
cname.vercel-dns.com
  |
  v
Vercel Edge Network
  |
  v
Vercel Project: artemis-omni
  |
  v
Next.js App Router
  |
  +-- app/page.tsx
  +-- app/solutions/*
  +-- app/products/*
  +-- app/labs/*
  +-- app/library/*
  +-- app/academy/*
  +-- app/tools/*
  +-- app/case-studies/*
  +-- app/for/*
  +-- app/contact/*
  +-- public/standalone/*
```

## Technology Stack

Core application:

```text
Framework: Next.js App Router
Language: TypeScript
UI runtime: React
Styling: Tailwind CSS, global Artemis tokens, custom component classes
Content: MDX plus structured TypeScript data modules
Icons: lucide-react
Deployment: Vercel
Package manager: npm
Version control: Git / GitHub
```

Primary application areas:

```text
app/
  Route segments, pages, metadata, sitemap, robots.

components/
  Artemis layout, content, cinematic, labs, showcase, tools, and UI primitives.

data/
  Structured public-safe proof modules, program catalog, audience data, visual assets,
  and ArtemisIX19 generator data.

content/
  MDX articles, academy items, case studies, and article-backed labs.

public/
  Static public assets and reviewed standalone lab HTML artifacts.

docs/
  Product, brand, deployment, governance, milestone, and company-history records.
```

Important current scripts:

```bash
npm run typecheck
npm run lint
npm run build
npm run dev -- --port 3001
```

## Public Website Map

Primary routes:

```text
/                         Artemis homepage and system narrative
/solutions                 Solution families
/products                  Product lines
/labs                      Proof library and standalone lab modules
/portfolio                 Portfolio narrative
/library                   Knowledge library
/library/programs          Program and source-artifact catalog
/academy                   Tutorials and explainers
/tools                     Calculators and utilities
/case-studies              Public-safe outcome stories
/departments               Operating model by department
/about                     Company and mission
/contact                   Pilot request path
```

Major live Labs routes:

```text
/labs/artemisix19
/labs/construction-intelligence-workbench
/labs/utility-intelligence-bridge
/labs/geodesic-intelligence
/labs/diana-moonshot
/labs/tax-architecture-2026
/labs/turkiye-atlas
```

## 2026-06-30 Standalone Labs Milestone

Two reviewed standalone HTML prototypes were promoted into Artemis Labs as isolated,
full-screen modules:

```text
public/standalone/tax-architecture-2026.html
app/labs/tax-architecture-2026/page.tsx

public/standalone/turkiye-atlas.html
app/labs/turkiye-atlas/page.tsx
```

### 1040 Finance Architecture

Route:

```text
/labs/tax-architecture-2026
```

Source artifact:

```text
individual_tax_true_3d_finance_architecture_2026 (1).html
```

Technology and product notes:

```text
Three.js via import map
CSS2D spatial cards
Scenario controls
Local scenario storage
CSV export
Print/PDF review
Finance education and advisory-intake potential
```

Boundary:

```text
Educational prototype only. Not tax advice, filing software, accounting advice,
legal advice, or investment advice.
```

Revenue direction:

```text
Executive finance education
Scenario workshops
Creator-led explainers
Advisory intake and premium review packages
```

### ARTEMIS Turkiye Atlas

Route:

```text
/labs/turkiye-atlas
```

Source artifact:

```text
artemis_turkiye_atlas_v0_26_polished_interactive_atlas.html
```

Technology and product notes:

```text
Mapbox GL JS v3.24.0
MapLibre GL v5.24.0
Leaflet v1.9.4
Mapbox -> MapLibre -> Leaflet fallback policy
Route planning and itinerary workspace
Commercial layer and partner CRM concepts
Dataset diagnostics
Bilingual and cultural-route potential
```

Security note:

```text
The artifact contains a public browser Mapbox pk token. Public pk tokens are not
secrets, but the token must be URL-restricted to approved domains before stronger
promotion. Never embed a Mapbox sk secret token in browser code.
```

Revenue direction:

```text
Destination intelligence pilots
Tourism campaign packages
Local partner discovery
Sponsored cultural-route products
Public-sector and private destination-development proposals
```

## Commercial Architecture

Artemis should monetize through controlled product paths, not by publishing raw
internal work. The current public website should support these revenue routes:

```text
Pilot requests
Executive workshops
Decision-support demos
Education products
Destination and infrastructure intelligence packages
Private implementation engagements
Sponsored public-safe showcases
```

Public-facing copy should stay grounded in reviewable implementation, not inflated
automation claims. The current safe language is:

```text
AI-enabled execution
Public-safe prototype
Synthetic where live
Human review required
Private data protected
```

Avoid claiming:

```text
Autonomous legal, tax, engineering, accounting, or investment decisions
Guaranteed revenue
Production readiness for unreviewed standalone artifacts
Publication of private project files or client-specific source data
```

## Component And Data Responsibilities

Key routes and files for this milestone:

```text
app/labs/page.tsx
  Labs index, public-safe rule, standalone module cards, proof-card grid,
  pilot CTA.

app/library/programs/page.tsx
  Program index and durable source-artifact catalog.

data/programCatalog.ts
  Structured program records, migration paths, public links, boundaries,
  and revenue-fit notes.

app/sitemap.ts
  Static route publication list for crawlers.

lib/site.ts
  Canonical domain, navigation metadata, and production-domain comment.
```

Standalone wrappers:

```text
app/labs/tax-architecture-2026/page.tsx
app/labs/turkiye-atlas/page.tsx
```

The wrappers intentionally keep the original engines intact for this milestone.
Do not rewrite the standalone prototypes into React until a future migration pass
has a defined test plan, component boundary, and product reason.

## Quality Gates

Required local verification before deployment:

```bash
npm run typecheck
npm run lint
npm run build
grep -RInE 'sk-[A-Za-z0-9]|github_pat_|ghp_|AKIA|BEGIN .*PRIVATE KEY|mapbox.*sk\\.' \
  public/standalone app/labs app/library data docs \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git || true
```

Local browser smoke test:

```bash
npm run dev -- --port 3001
open http://127.0.0.1:3001/labs
open http://127.0.0.1:3001/labs/tax-architecture-2026
open http://127.0.0.1:3001/labs/turkiye-atlas
```

Production verification after deploy:

```bash
curl -I -L https://artemis.agoraxai.com
curl -I -L https://artemis.agoraxai.com/labs
curl -I -L https://artemis.agoraxai.com/labs/tax-architecture-2026
curl -I -L https://artemis.agoraxai.com/labs/turkiye-atlas
curl -I -L https://artemis.agoraxai.com/sitemap.xml
```

Expected result:

```text
HTTP/2 200
```

## Codex And Claude Code Handoff Rule

Keep coordination records in:

```text
work/coordination/CODEX_CLAUDE_HANDOFF.md
```

Every handoff should include:

```text
Objective
Current owner
Branch
Changed files
Commands run
Verification
Blockers
Next commands
```

Do not ask Claude Code or any agent to change DNS, root-domain records, billing,
production secrets, GitHub repository visibility, or Vercel ownership without an
explicit human confirmation.

## Next Phase Development Agenda

Highest-leverage next website work:

```text
1. Add screenshots or generated thumbnails for each lab card.
2. Build a paid-offer page for executive workshops and pilot engagements.
3. Add analytics/observability after privacy review.
4. Convert reusable lab concepts into native React modules one at a time.
5. Create Academy articles from the tax model and atlas modules.
6. Add screenshot-based QA evidence to docs/history for every public release.
7. Add Mapbox URL restriction evidence after the token is restricted.
```

The production direction is continuous but controlled:

```text
Publish reviewed public artifacts.
Route private material through sanitized catalog records.
Use Labs for proof.
Use Academy and Insights for education.
Use Contact and future offer pages for revenue conversion.
Keep root DNS stable.
```
