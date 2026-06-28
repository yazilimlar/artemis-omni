# ADR-003 — Content & MDX System

- **Status:** Accepted
- **Date:** 2026-06-28

## Context

Academy articles, Labs notes, and Case Studies must be authorable as **modular packages**
that future AI agents can add without touching rendering code. Each item needs rich
metadata (title, summary, date, category, tags, hero image, SEO, related tools/
infographics) and an MDX body that can embed interactive React.

## Decision

- Store content as `.mdx` files under `content/<collection>/` (academy, labs,
  case-studies). Filename = slug.
- Use **`@next/mdx`** with **`remark-frontmatter`** (strips the `---` block at compile)
  and **`remark-gfm`** (tables, etc.).
- Parse frontmatter separately with **`gray-matter`** in `lib/content` for listings,
  metadata, and sitemap generation.
- Render bodies via **dynamic import** of the compiled MDX (`getMdxComponent`).
- A shared `ArticleLayout` + `Prose` render any collection consistently; `ContentCard`
  renders listings. Custom MDX components (e.g. `<Callout>`) live in `mdx-components.tsx`.

## Consequences

- ✅ Adding content is "drop a file in a folder" — listing, page, SEO, and sitemap are
  automatic.
- ✅ Native Next.js MDX (no runtime compiler); content can embed React components.
- ✅ One typed frontmatter schema (`lib/content/types.ts`) shared across collections.
- ⚠️ Frontmatter is parsed twice (gray-matter for meta, stripped at compile for body) —
  a deliberate, cheap trade for reliability.
- ⚠️ Dynamic `import()` by slug relies on the collection folder structure staying stable.

## Alternatives considered

- **`next-mdx-remote` (runtime compile)** — rejected: extra dependency and runtime cost.
- **A headless CMS** — deferred: unnecessary for Phase 1; file-based is simpler and
  Git-reviewable.
- **TS-only content registry** — rejected: loses the ergonomics of MDX authoring.
