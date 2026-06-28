# Artemis Omni — Content System

Content is authored as **modular MDX packages** so future AI agents (and humans) can add
articles, notes, and case studies without touching rendering code.

## Collections

| Collection | Folder | Route | Purpose |
| --- | --- | --- | --- |
| Academy | `content/academy` | `/academy/<slug>` | Tutorials, explainers, frameworks |
| Labs | `content/labs` | `/labs/<slug>` | Experiment notes, prototypes |
| Case Studies | `content/case-studies` | `/case-studies/<slug>` | Outcomes |

The file name (without `.mdx`) is the slug.

## Frontmatter schema

Every item supports these fields (see `lib/content/types.ts`):

```yaml
---
title: "Human-readable title"            # required
summary: "One-to-two sentence summary"   # required
date: "2026-06-20"                        # required, ISO yyyy-mm-dd
category: "Project Controls"             # required
tags: ["5D", "cost control"]             # optional
heroImage: "/og/artemis-default.svg"     # optional
seoDescription: "Custom SEO description"  # optional (falls back to summary)
relatedTools: ["fuel-price-adjustment"]  # optional (tool slugs)
relatedInfographics: ["cost-curve"]      # optional (infographic ids)
draft: false                              # optional (true = hidden)
author: "Artemis Omni"                    # optional
readingTime: "6 min read"                # optional
---
```

## Body

Standard MDX (GitHub-flavored Markdown + JSX). Frontmatter is stripped at compile time
(`remark-frontmatter`) and parsed separately with `gray-matter`. Tables, code, and lists
are styled by the `Prose` wrapper.

### Custom components available in MDX

- `<Callout title="...">...</Callout>` — highlighted aside.
- Internal links (`/path`) automatically render as Next `Link`s.
- You can embed any React component — import it at the top of the MDX file. This is how
  an article can ship an interactive infographic or calculator inline.

## How it renders

1. `lib/content/getAllMeta(collection)` reads frontmatter for the listing pages.
2. `lib/content/getMdxComponent(collection, slug)` dynamically imports the compiled MDX
   body for the detail page.
3. `app/<collection>/[slug]/page.tsx` provides `generateStaticParams`,
   `generateMetadata`, and the `ArticleLayout`.
4. New files automatically get a sitemap entry (`app/sitemap.ts`).

## Adding a content package (the future-AI workflow)

1. Create `content/<collection>/<slug>.mdx` with valid frontmatter.
2. Write the body; embed components as needed.
3. (Optional) Reference a tool via `relatedTools` and an infographic via
   `relatedInfographics`.
4. Done — it appears in the listing, gets a page, SEO metadata, and a sitemap entry.

Example future packages: Fuel Price Adjustment explainer, 5D cost control tutorial,
construction cash-flow dashboard guide, AI invoice automation tutorial, Supabase +
Next.js dashboard tutorial, project controls glossary, executive reporting framework,
WebGL construction intelligence demo.
