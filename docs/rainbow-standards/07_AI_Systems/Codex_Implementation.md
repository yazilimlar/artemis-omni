# Codex Implementation Instructions

## Role

Codex is responsible for repository-grounded implementation: file edits, schemas,
types, tests, build validation, and handoff notes.

## Required Start

Before implementing Rainbow Botanics code, Codex must read:

1. `ENGINEERING/AI_AGENT_RULES.md`
2. `ENGINEERING/ARCHITECTURE.md`
3. `decisions/ADR-INDEX.md`
4. `docs/rainbow-standards/README.md`
5. `docs/rainbow-standards/05_Production_System/AI_Pipeline_Architecture.md`

## Rules

- Do not build public routes during M1.
- Do not commit raw private photos, GPS, EXIF, or personal address details.
- Do not add Google Photos automation in Phase 1.
- Do not add auth, database writes, or cloud media storage without an approved
  architecture decision.
- Preserve existing Artemis routes and content systems.
- Run validation commands when the repo supports them and report failures honestly.

## Implementation Sequence

1. Validate JSON schemas.
2. Add typed fixtures only after schemas stabilize.
3. Build ABTE token utility.
4. Build Hemerocallis reference page.
5. Add generator UI.
6. Add preview-publish workflow.

## Handoff Format

Every substantial change should report:

- branch,
- files changed,
- validation commands,
- remaining risks,
- next recommended milestone.
