# 01 — Codex Implementation Prompt

Role: **Codex CLI** — local code edits, patches, tests.

## Instructions

You are implementing changes in the `artemis-omni/` Next.js App Router project. Follow
`prompts/00-master-site-brief.md` and the docs in `docs/`.

### Rules

- Work on a branch; produce small, reviewable patches.
- Match existing conventions: TypeScript, Tailwind tokens from `app/globals.css`, the
  `cn()` helper, shadcn-style primitives in `components/ui`.
- Keep the cinematic layer lazy-loaded and behind the `ArtemisSceneCanvas` boundary.
  Never add heavy WebGL to the critical path.
- Respect `prefers-reduced-motion` and provide static fallbacks.
- No secrets in code. Read config from `process.env.*`; placeholders only.
- Add/maintain `generateMetadata` + sitemap entries for new routes.

### Definition of done

- `npm run typecheck` and `npm run build` pass.
- New content follows the frontmatter schema in `docs/ContentSystem.md`.
- New tools are registered in `lib/tools.ts` and have a route under `app/tools/<slug>`.
- No regression to mobile or reduced-motion behavior.

### Output

Return a unified diff / patch and a short summary of files changed and why.
