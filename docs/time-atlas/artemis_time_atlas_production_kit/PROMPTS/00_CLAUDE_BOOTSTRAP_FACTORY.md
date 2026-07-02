# Prompt 00 — Claude Code Fable: Bootstrap the Production Factory

You are the primary implementation agent for Artemis Time Atlas V1.

## Goal

Create the permanent production foundation for a vertical mobile-first interactive historical reconstruction of Troy / Ilion c. 600 BC.

## Hard Constraints

- Work only on a dedicated branch: `feature/time-atlas-troy-v1`.
- Do not modify unrelated routes.
- Do not add Supabase yet.
- Do not build a full globe.
- Do not add free camera navigation.
- Do not expose secrets.
- Keep all V1 data local.
- Keep the route isolated at `/time-atlas/troy`.

## First Task

Create the project documentation and production factory structure inside the existing repo:

```txt
docs/time-atlas/
  README_PRODUCTION_START.md
  00_COMMAND_CENTER.md
  ENGINEERING/
    AI_AGENT_RULES.md
    ADR/
    STANDARDS/
  PROMPTS/
  RESEARCH/TROY/
  ASSETS/
```

If similar governance folders already exist, extend them rather than duplicating conflicting systems.

## Deliverables

- Production docs committed or staged
- Clear summary of created files
- No app implementation yet
- Run `git status`
