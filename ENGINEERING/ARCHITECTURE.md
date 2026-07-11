# Artemis Architecture Authority

Artemis is a Next.js, TypeScript, Vercel-deployed, multi-division product system built
with an AI-native engineering process. The codebase must remain coherent across multiple
AI agents, divisions, products, standalone prototypes, testbeds, and future domains.

Artemis is the umbrella organization and platform. No single industry, product, route,
branch, or testbed defines the complete Artemis identity.

## Canonical Knowledge Pyramid

When sources disagree, resolve conflicts in this order:

1. Running source code, tests, and verified build output
2. Accepted ADRs in `decisions/`
3. This architecture file
4. Engineering standards, security rules, and deployment rules
5. Division/Product/Testbed registries and feature passports
6. Prompt templates and handover files
7. AI session logs and conversation notes

## Current System Shape

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS plus isolated standalone HTML labs where approved
- Deployment: Vercel
- Domain strategy: accepted in ADR-001
- Content model: MDX and typed content registry, accepted in ADR-003
- Secrets model: no secrets in source; accepted in ADR-004
- AI engineering governance: accepted in ADR-005
- Multi-division product architecture: accepted in ADR-006
- Standalone labs: isolated iframe wrappers when conversion risk is higher than value

## Organizational Model

```text
Artemis
├── Core Platform and Shared Capabilities
├── Divisions
│   ├── Infrastructure and Construction
│   ├── Atlas and Places
│   ├── Studio and Media
│   ├── Knowledge and Academy
│   ├── Finance and Decision Systems
│   └── Natural Systems and future approved divisions
└── Artemis Labs
    ├── experiments
    ├── testbeds
    └── pre-product demonstrations
```

Construction intelligence, CivicBid, utilities, project controls, 5D cost, forecasting,
cashflow, claims, and risk are flagship capabilities of the Infrastructure and
Construction division. They are not the boundary of Artemis.

Division names are architectural working categories until commercial naming is approved.

## Architectural Layers

Use these terms precisely:

1. **Organization** — Artemis.
2. **Division** — a durable mission and market grouping.
3. **Product family** — related products within a division.
4. **Product** — a governed user outcome with a canonical implementation.
5. **Shared capability** — reusable platform logic consumed through explicit interfaces.
6. **Lab** — an incubation or demonstration surface.
7. **Testbed** — a temporary integration surface used to evaluate capabilities.
8. **Route** — a delivery surface; a route is not automatically a product.
9. **Branch** — a version-control concern; branch status does not determine product status.

## Authoritative Registries

- `ENGINEERING/DIVISION_REGISTRY.yaml` — organizational division model
- `ENGINEERING/PRODUCT_REGISTRY.yaml` — canonical product, maturity, visibility, and data state
- `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml` — capability disposition and migration evidence
- `ENGINEERING/PROJECT_GENOME.yaml` — machine-readable project configuration

The registries route work but do not outrank source code, tests, or accepted ADRs.

## Product Boundaries

- Each major product must name one owning division and one canonical implementation.
- A product may use multiple donor branches, but donor branches must be selectively reviewed.
- Product code may import shared UI and approved Artemis Core interfaces.
- A product must not import another product's private data or implementation by convenience.
- Cross-division dependencies require explicit documentation in the feature passport.
- New major products require a Product Registry entry and feature passport before production.
- Product retirement requires product-level evidence; branch age, naming, or archival state is insufficient.

## Testbed Rule

Testbeds prove capabilities; they do not automatically become permanent products.

ArtemisIX19 is a testbed and cross-division capability donor. Verified capabilities may
move into Artemis Core, Studio, Knowledge, Infrastructure, or other approved products.
The ArtemisIX19 route and historical branch must not be retired until every verified
capability has a recorded disposition in the Testbed Migration Registry.

## Visibility and Data Truth

Every product surface must declare visibility and data mode.

Approved visibility classes:

- public
- public-safe demo
- noindex review
- authenticated
- private pilot
- internal operations

Approved data modes:

- live official
- live derived
- synthetic
- sample
- sample fallback
- private approved
- mixed explicit

Sample or synthetic data must never silently impersonate live data. Internal branch,
commit, deployment, rollback, and approval information must not appear on ordinary public
product routes.

## Protected Areas

Changes to these areas require extra care and usually an ADR:

- `decisions/`
- `ENGINEERING/`
- `docs/SecurityRules.md`
- `docs/DeploymentPlan.md`
- routing under `app/`
- shared UI primitives under `components/ui/`
- product boundaries and cross-product imports
- map/rendering engine strategy
- environment variables, auth, data storage, and deployment configuration

## Product and Division Direction

Current and emerging areas include:

- Infrastructure and Construction
- Atlas and Places
- Studio and Media
- Knowledge and Academy
- Finance and Decision Systems
- Natural Systems
- Future GIS, CAD/BIM, ERP, analytics, automation, and other approved divisions

Each major product must have a feature passport naming purpose, owner, division,
product family, dependencies, ADRs, risks, tests, maturity, visibility, data mode, and roadmap.

## AI Operating Principle

Treat every AI as a capable junior engineer with amnesia. The repository must carry
enough indexed, versioned knowledge that a new AI session can become useful without
guessing prior decisions.

Before editing, an AI must determine the owning division, product, lifecycle state,
visibility class, data mode, and whether the work is product-specific, shared platform
work, or testbed migration. Never assume Artemis means construction or any other single
division.
