# Artemis AI Agent Rules

This repository is governed by the Artemis AI Engineering Operating System.
Every AI session starts from repo truth, not conversation memory.

## Mandatory Start

Before proposing or changing code, read:

1. `ENGINEERING/ARCHITECTURE.md`
2. `decisions/ADR-INDEX.md`
3. Any ADR listed by the index for the touched area
4. The feature passport if the touched area has one

If those documents conflict with a chat message, use the highest-authority source and
state the conflict.

## Authority Order

1. Source code and tests
2. Accepted ADRs in `decisions/`
3. `ENGINEERING/ARCHITECTURE.md`
4. Engineering standards and security rules
5. Component specifications and feature passports
6. Prompt templates and handovers
7. AI session notes
8. Conversation context

Conversations are useful direction, but they are not architectural authority.

## Required Behavior

- Preserve existing architecture unless an ADR explicitly changes it.
- Keep experiments isolated on feature, labs, or experiment branches.
- Do not move or rewrite stable systems without naming the governing ADR.
- Cite touched ADRs in summaries for architecture-relevant changes.
- Keep secrets out of source and chat. Follow `decisions/ADR-004-security-and-secrets.md`.
- Use preview-first deployment flow unless the human explicitly authorizes production.
- Mark recommendation confidence:
  - A: verified by repository
  - B: consistent with repository
  - C: inference from available context
  - D: speculation

## Change Classes

Architecture-related changes require an ADR or ADR update:

- Folder structure
- Routing model
- Map/rendering engine strategy
- Design system tokens or component boundaries
- Auth, database, payments, or secrets
- Deployment/domain strategy
- AI workflow and governance rules

Routine feature work can proceed without a new ADR when it stays inside accepted
boundaries.

## Handoff Requirement

Every substantial AI session should leave a durable note in one of:

- `docs/history/`
- `docs/evolution/`
- a feature-specific passport or milestone file

The note should include branch, files changed, verification, known risks, and the next
recommended task.
