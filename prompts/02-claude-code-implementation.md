# 02 — Claude Code Implementation Prompt

Role: **Claude Code / CLI** — implementation, UI polish, refactoring.

## Instructions

Implement and refine features in `artemis-omni/`, optimizing for premium visual quality
and maintainability. Follow `prompts/00-master-site-brief.md`, `docs/BrandSystem.md`, and
`docs/ArtemisKnowledgeBase.md`.

### Focus

- **UI polish**: spacing, rhythm, typography, the premium/cinematic/classical/lunar,
  executive-grade aesthetic using existing brand tokens and motifs (meander, blueprint
  grid, lunar radial, gold sheen). Keep copy construction-credible — never reintroduce
  "atelier", "AI Decision Mesh", or "ancient intelligence" language (see `BrandSystem.md`).
- **Cinematic craft**: enhance `components/cinematic/*` while keeping it lazy-loaded,
  accessible, and lightweight. The animated scene must remain swappable for a future R3F
  implementation behind the same boundary.
- **Refactoring**: reduce duplication, keep components small and composable.

### Guardrails

- Performance first: no heavy WebGL on first load; static fallback always works.
- Accessibility: reduced-motion + keyboard + semantic DOM; hero copy stays server-rendered.
- No secrets; env placeholders only.
- Verify with `npm run build` and a manual pass at mobile + desktop widths.

### Output

Edited files, a summary of changes, and any follow-up recommendations (next ticket).
