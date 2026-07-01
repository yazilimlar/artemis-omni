# Engineering DNA

Every important object — a component, document, model, engine, or dataset — gets a
persistent identity and metadata, so AI agents read relationships instead of inferring
them.

## ID scheme

```
ART-<TYPE>-<NNNNNN>
```

| TYPE | Meaning |
|---|---|
| `COMP` | UI component |
| `MOD`  | Feature/module or engine |
| `DOC`  | Governance or architecture document |
| `DATA` | Typed dataset / registry |
| `LAB`  | Standalone lab or demonstrator |
| `ADR`  | Architecture decision (mirrors `decisions/ADR-###`) |
| `PMT`  | Prompt template |

IDs are permanent. Names and versions may change; the ID does not.

## Object record (front-matter or sidecar)

```yaml
id: ART-MOD-000042
name: ArtemisIX Studio
domain: labs
owner: Claude Code
status: Production        # Draft | Test | Production | Deprecated
version: 1.2.0
depends_on:
  - Next.js
  - simulation-engine
related_adrs:
  - ADR-005
related_tests:
  - studio.spec.ts
related_docs:
  - docs/showcases/ArtemisIX19GeneratorLibrary.md
created: 2026-06-30
modified: 2026-06-30
```

## Feature Passport

Major features carry a passport (see `FEATURE_PASSPORT_TEMPLATE.md`) that records
purpose, scope, owner, dependencies, APIs, data, ADRs, tests, security, known risks,
performance targets, and roadmap. An AI asked to modify a feature reads its passport
before touching code.

## Registry

Maintain an object registry (a table or generated index) so the whole engineering graph
is traceable: object → ADR → spec → implementation → tests → release. This is the
"living knowledge graph" layer of the AIEOS.
