# System Index — read this first

The repository's "digital twin" entry point. Point a new AI session here before asking
it to understand the repo. Read top-down; stop when you have what you need.

## Start sequence for any AI session

1. `ENGINEERING/AI_AGENT_RULES.md` — the operating rules (amnesia rule, authority order, confidence grades).
2. `ENGINEERING/ARCHITECTURE.md` — the architecture authority and Knowledge Pyramid.
3. `decisions/ADR-INDEX.md` — accepted decisions; read any ADR for the area you touch.
4. `docs/HANDOVER.md` — the current live state and what is uncommitted right now.
5. The feature passport for the domain you are changing (if one exists).

## Governance documents

| Doc | Purpose |
|---|---|
| `AI_AGENT_RULES.md` | Golden rule, authority order, change classes, handoff requirement |
| `ARCHITECTURE.md` | Architecture authority, protected areas, product domains |
| `PROJECT_GENOME.yaml` | Machine-readable project configuration |
| `CAPABILITY_REGISTRY.md` | Which AI model owns which kind of work |
| `BRANCH_LIFECYCLE.md` | experiment → feature/labs → main → tag |
| `RECOVERY_MATRIX.md` | Deterministic recovery for every failure mode |
| `ENGINEERING_DNA.md` | Persistent object IDs + feature passports |
| `FEATURE_PASSPORT_TEMPLATE.md` | Template for per-feature passports |

## Product domains (see ARCHITECTURE.md)

Labs · Atlas · Tax/Finance · Construction Intelligence · Utility Intelligence ·
Brand/Visual · Future Knowledge OS / GIS / CAD-BIM / ERP / Analytics / Automation.

## Key routes (public app)

`/` · `/solutions` · `/products` · `/labs` · `/library` · `/library/programs` ·
`/insights` · `/for/[slug]` (17 audiences) · `/pricing` (proposed) ·
`/insights/social` (proposed content engine).

## Validation commands

```
npm run typecheck
npm run lint
npm run build
```

## Future indexes to generate

`COMPONENT_INDEX.md`, `API_INDEX.md`, `DEPENDENCY_GRAPH.md`, `PROMPT_INDEX.md`,
`TEST_INDEX.md` — auto-generated so agents read indexes instead of scanning the tree.
