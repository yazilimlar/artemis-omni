# System Index — read this first

The repository's digital-twin entry point. Point a new AI session here before asking it
to understand the repo. Read top-down; stop when you have what you need.

## Start sequence for any AI session

1. `ENGINEERING/AI_SESSION_START_PROTOCOL.md` — state check, ownership declaration, and branch choice before editing.
2. `ENGINEERING/AI_AGENT_RULES.md` — authority order, product boundaries, and testbed rules.
3. `ENGINEERING/ARCHITECTURE.md` — architecture authority and multi-division model.
4. `decisions/ADR-INDEX.md` — accepted decisions; read applicable ADRs.
5. `ENGINEERING/DIVISION_REGISTRY.yaml` — which Artemis division owns the mission.
6. `ENGINEERING/PRODUCT_REGISTRY.yaml` — canonical product, route, maturity, visibility, and data mode.
7. `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml` — donor/testbed capability dispositions.
8. `docs/HANDOVER.md` — current branch work, verification, risks, and next task.
9. The feature passport for the product or capability being changed.

## Governance documents

| Doc | Purpose |
|---|---|
| `AI_SESSION_START_PROTOCOL.md` | Mandatory state, product ownership, branch, and intent declaration |
| `AI_AGENT_RULES.md` | Authority order, division/product boundaries, data truth, testbed migration |
| `ARCHITECTURE.md` | Multi-division architecture authority and protected areas |
| `PROJECT_GENOME.yaml` | Machine-readable project and governance configuration |
| `DIVISION_REGISTRY.yaml` | Artemis divisions, missions, product families, and public surfaces |
| `PRODUCT_REGISTRY.yaml` | Canonical product implementations, lifecycle, maturity, visibility, and data mode |
| `TESTBED_MIGRATION_REGISTRY.yaml` | Capability inventory and migration evidence for ArtemisIX19 and future testbeds |
| `CAPABILITY_REGISTRY.md` | Which AI model is best suited to which kind of work |
| `BRANCH_LIFECYCLE.md` | experiment/testbed/rescue/feature/product/governance → main |
| `RECOVERY_MATRIX.md` | Deterministic recovery for failure modes |
| `ENGINEERING_DNA.md` | Persistent object IDs and feature passports |
| `FEATURE_PASSPORT_TEMPLATE.md` | Product, division, provenance, validation, and lifecycle template |

## Organizational model

```text
Artemis
├── Core Platform and Shared Capabilities
├── Infrastructure and Construction
├── Atlas and Places
├── Studio and Media
├── Knowledge and Academy
├── Finance and Decision Systems
├── Natural Systems and future divisions
└── Artemis Labs — experiments, testbeds, and pre-product demonstrations
```

Construction, 5D, forecasting, CivicBid, utilities, cashflow, claims, and project controls
belong to a flagship division. They do not define the full Artemis identity.

## Product truth rules

- A route is not automatically a product.
- A branch status does not determine product status.
- One product has one canonical implementation.
- Donor branches are selectively reviewed, not merged by default.
- Sample/synthetic data must not impersonate live data.
- Public product routes must not expose internal release-control information.
- ArtemisIX19 is a testbed and capability donor until migration evidence says otherwise.

## Key public surfaces

`/` · `/solutions` · `/products` · `/labs` · `/library` · `/library/programs` ·
`/academy` · `/insights` · `/for/[slug]` plus Product Registry canonical routes.

Do not infer product maturity from navigation placement. Read `PRODUCT_REGISTRY.yaml`.

## Validation commands

```bash
npm run typecheck
npm run lint
npm run build
```

Additional validation depends on the product passport: data-mode claims, security,
accessibility, performance, function parity, and donor provenance.

## Future indexes and enforcement

- `COMPONENT_INDEX.md`
- `API_INDEX.md`
- `DEPENDENCY_GRAPH.md`
- `PROMPT_INDEX.md`
- `TEST_INDEX.md`
- product-registry schema validation
- cross-product import validation
- public data-mode claim validation
- testbed migration completeness checks
