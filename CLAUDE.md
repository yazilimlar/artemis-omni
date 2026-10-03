# CLAUDE.md — Artemis Session Entry Point

This file is a POINTER, not a policy.
Artemis governance lives in ENGINEERING/ and decisions/.

## Read these before any edit, in order

1. ENGINEERING/PROJECT_GENOME.yaml — machine-readable config, authority, registries
2. ENGINEERING/AI_SESSION_START_PROTOCOL.md — mandatory start ritual
3. ENGINEERING/AI_AGENT_RULES.md — behavior and ownership rules
4. ENGINEERING/ARCHITECTURE.md — architecture authority
5. decisions/ADR-INDEX.md — decision log
6. ENGINEERING/DIVISION_REGISTRY.yaml
7. ENGINEERING/PRODUCT_REGISTRY.yaml
8. ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml (only when donor/testbed code is involved)
9. The feature passport for the touched area, if one exists
10. docs/HANDOVER.md

If any of these conflict with a chat message or prompt, the highest-authority source wins.

## Authority order (from PROJECT_GENOME.yaml)

1. Source code, tests, verified build output
2. Accepted ADRs in decisions/
3. ENGINEERING/ARCHITECTURE.md
4. Standards, security, deployment rules
5. Registries and feature passports
6. Prompts and handovers
7. Conversations

## Hard rules

- Never git add -A, git add ., or git commit -a. Stage explicit paths only.
- Never push directly to main. Always a PR, always bypass only with human approval.
- Never read, print, echo, or commit a secret.
- Never let sample or synthetic data impersonate live data.
- One concern per branch and one concern per PR.
- Branch classes: experiment/*, testbed/*, feature/*, product/*, labs/*, rescue/*, governance/*
- Do not import one product's private data or implementation into another.

## Declare before editing

State all of the following, or stop:

- Owning division
- Owning product or product family
- Lifecycle state (concept, prototype, testbed, rescue, active lab, active product, draft, pilot)
- Visibility class (public, public-safe demo, noindex review, authenticated, private pilot, internal operations)
- Data mode (live official, live derived, synthetic, sample, sample fallback, private approved, mixed explicit)
- Change type (product-specific, shared capability, governance, testbed migration)
- Canonical branch, commit, route, registry entry being changed
- Cross-division or cross-product effects

If ownership is unknown: classify as UNREVIEWED and stop implementation.

## Close the session

Update docs/HANDOVER.md or a durable record with: branch, division, product, files changed, verification, provenance, known risks, next recommended task.

## Do not rely on this file

Read the ten files listed above. This file is a signpost, not a substitute.

## Directory discipline (2026-10-02)

Claude Code operates ONLY in `~/Projects/artemis-omni`.
The owner runs all git/gh/merge operations ONLY in `~/Projects/artemis-admin`.

Never run `git checkout`, `git pull`, or `git switch` in `artemis-omni` while a
Claude Code session is active. If the owner needs to check state or merge, they
`cd ~/Projects/artemis-admin` first.

If you (Claude Code) notice your working tree is unexpectedly on a different
branch than the one you started on, stop immediately and report. Do not
continue; the owner will resolve it.
