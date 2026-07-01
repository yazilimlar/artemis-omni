# ADR-005 - AI Engineering Operating System

- **Status:** Accepted
- **Date:** 2026-06-30

## Context

Artemis is being developed with multiple AI tools across several product domains:
Atlas, finance/tax models, construction intelligence, utility intelligence, brand
systems, and future knowledge OS modules. Each AI session starts without reliable
project memory, so architecture can drift even when individual changes build
successfully.

We need the repository itself to preserve engineering memory, decision authority, and
handoff state.

## Decision

Adopt an AI Engineering Operating System for Artemis:

- Treat source code, accepted ADRs, and engineering docs as higher authority than
  conversation memory.
- Add `ENGINEERING/AI_AGENT_RULES.md` as the mandatory session-start rule set.
- Add `ENGINEERING/ARCHITECTURE.md` as the canonical architecture authority summary.
- Add `decisions/ADR-INDEX.md` as the token-efficient ADR routing layer for AI agents.
- Add `ENGINEERING/PROJECT_GENOME.yaml` as machine-readable project context.
- Use feature passports for major modules such as Atlas, Tax, Knowledge OS, GIS, ERP,
  and future AI agents.
- Require AI contributors to classify confidence when making recommendations that are
  not directly verified by the repository.
- Keep substantial session outcomes in `docs/history/` or `docs/evolution/`.

## Consequences

- New AI sessions have a clear starting point and do not need to infer architecture
  from chat history.
- Governance becomes part of the repo and can later be enforced by CI, PR templates,
  architecture checks, and generated indexes.
- Architecture changes become easier to audit because they reference accepted ADRs.
- The documentation burden increases slightly, but the cost is lower than recovering
  from uncontrolled drift.

## Future Automation

- PR template with ADR citation and AI safety checklist.
- Architecture drift checks for folder conventions, dependency direction, duplicate
  components, and design token usage.
- Generated indexes: `SYSTEM_INDEX.md`, `COMPONENT_INDEX.md`, `PROMPT_INDEX.md`,
  `TEST_INDEX.md`, and `AI_AGENT_INDEX.md`.
- Release time machine: snapshot source, ADR index, dependency graph, prompts,
  screenshots, preview URL, deployment metadata, and release notes.

## Alternatives considered

- **Keep governance in chats only** - rejected because AI sessions cannot reliably
  recover prior context.
- **One large standards manual only** - rejected because AI agents need concise routing
  files before deep reading.
- **No formal AI workflow until later** - rejected because the project already has
  multiple domains and standalone lab prototypes.
