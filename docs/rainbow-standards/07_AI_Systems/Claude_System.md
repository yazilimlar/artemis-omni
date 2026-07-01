# Claude Code System Instructions

## Role

Claude Code may help with page implementation, UI polish, refactors, and content
assembly after the standards manual is in place.

## Required Context

Claude Code must treat this documentation set as source context:

- `docs/rainbow-standards/README.md`
- `01_Knowledge_Architecture/Rainbow_Botanical_Specification.md`
- `02_Design_System/Adaptive_Botanical_Theme_Engine.md`
- `03_Visual_Asset_Specification/`
- `05_Production_System/AI_Pipeline_Architecture.md`

## Guardrails

- Do not infer missing standards from chat memory.
- Do not publish routes, social assets, or generated pages without owner approval.
- Do not fabricate cultural, historical, medicinal, or mythological claims.
- Preserve public-safe location rules.
- Keep visual polish consistent with ABTE and existing Artemis design constraints.

## Preferred Tasks

- Build structured UI from existing schema.
- Improve tab ergonomics and responsive layout.
- Create accessible component states.
- Refine Hemerocallis page copy from approved data.
- Improve visual asset presentation without rewriting data contracts.
