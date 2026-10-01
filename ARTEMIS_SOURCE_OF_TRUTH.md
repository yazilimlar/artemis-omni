# ARTEMIS SOURCE OF TRUTH

Last updated: 2026-10-01
Status: ACTIVE — this file is a top-level INDEX.
It points to existing governance. It does not duplicate it.

## Rule
Do not restate rules here. Point to where they live.
If a rule is needed, read the file it points to.
If two sources disagree, the one higher in the Source of Truth Order wins.

## Canonical location
- Repo: ~/Projects/artemis-omni
- Remote: git@github.com:yazilimlar/artemis-omni.git
- Branch: main
- All other clones (Desktop, Documents, Codex, worktrees) are NOT canonical.

## Where the rules actually live
| Topic | File |
|---|---|
| AI behavior | ENGINEERING/AI_AGENT_RULES.md |
| AI session start | ENGINEERING/AI_SESSION_START_PROTOCOL.md |
| Architecture | ENGINEERING/ARCHITECTURE.md |
| Engineering DNA | ENGINEERING/ENGINEERING_DNA.md |
| Branch lifecycle | ENGINEERING/BRANCH_LIFECYCLE.md |
| Recovery matrix | ENGINEERING/RECOVERY_MATRIX.md |
| System index | ENGINEERING/SYSTEM_INDEX.md |
| Divisions | ENGINEERING/DIVISION_REGISTRY.yaml |
| Products | ENGINEERING/PRODUCT_REGISTRY.yaml |
| Capabilities | ENGINEERING/CAPABILITY_REGISTRY.md |
| Project genome | ENGINEERING/PROJECT_GENOME.yaml |
| Testbed migration | ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml |
| Feature passports | ENGINEERING/FEATURE_PASSPORT_TEMPLATE.md |
| Security | docs/SecurityRules.md |
| Handover | docs/HANDOVER.md |
| Brand | docs/BrandArchitecture.md |
| Decisions (ADRs) | decisions/ADR-INDEX.md |

## Source of truth order
1. decisions/ADRs — locked decisions
2. ENGINEERING/ governance files
3. data/artemis-registry.json — to be created in Phase 1
4. Repo files on main
5. Deployment config (vercel.json, render.yaml, .github/workflows)
6. Terminal output
7. AI memory and conversation

## Current phase
Phase 1 — Inventory and Registry.
No homepage redesign. No new departments. No new client features. No 3D yet.

## Phase 1 tasks (in order)
1. Read the existing ENGINEERING/ files fully. Do not modify them yet.
2. Classify all 70 app/ route directories into registry statuses.
3. Classify client/brand work into registry entries.
4. Resolve the 4 duplicate workbench locations.
5. Create data/artemis-registry.json v0.1 — extending, not replacing, DIVISION_REGISTRY.yaml and PRODUCT_REGISTRY.yaml.
6. Create /control and /system-map routes.
7. Build registry-powered /labs page.

## Hosting map
| Layer | Tool |
|---|---|
| DNS | Squarespace |
| Public site | Vercel |
| Source control | GitHub |
| Private backend | Render |
| Registry | data/artemis-registry.json |

## What this file is NOT
- Not a replacement for ENGINEERING/AI_AGENT_RULES.md
- Not a replacement for decisions/ADR-INDEX.md
- Not a replacement for docs/SecurityRules.md
- Not a place to invent new rules

## Change log
| Date | Change |
|---|---|
| 2026-10-01 | v1 created (superseded) |
| 2026-10-01 | v2 — converted to index to avoid duplication with ENGINEERING/ |