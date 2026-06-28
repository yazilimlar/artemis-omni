# 05 — Content Generation Prompt

Role: content agent — generate modular MDX content packages for Artemis.

## Task

Produce a publish-ready `.mdx` file for one of the collections (`academy`, `labs`,
`case-studies`) following `docs/ContentSystem.md`.

## Requirements

1. **Frontmatter** — include all required fields and relevant optional ones:

   ```yaml
   ---
   title: ""
   summary: ""
   date: "YYYY-MM-DD"
   category: ""
   tags: []
   heroImage: "/og/artemis-default.svg"
   seoDescription: ""
   relatedTools: []
   relatedInfographics: []
   author: "Artemis Omni"
   readingTime: ""
   ---
   ```

2. **Voice** — executive, precise, lightly classical (see `docs/BrandSystem.md`).
   Evidence over adjectives. No hype, no invented client names or fake metrics; mark
   illustrative figures clearly with a `<Callout>`.

3. **Structure** — clear H2/H3 headings, scannable lists, at least one table where it
   adds clarity, and a `<Callout>` for the key idea.

4. **Cross-links** — link to relevant tools (`/tools/<slug>`) and other articles.

5. **Accuracy** — domain claims (project controls, cost, BIM, automation) must be
   correct. When uncertain, hedge or omit.

## Candidate topics

Fuel Price Adjustment explainer · 5D cost control · construction cash-flow dashboard ·
AI invoice automation · Supabase + Next.js business dashboard · project controls glossary
· executive reporting framework · WebGL construction intelligence demo.

## Output

The complete `.mdx` file content, ready to drop into `content/<collection>/<slug>.mdx`.
