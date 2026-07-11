# Artemis AI Agent Rules

This repository is governed by the Artemis AI Engineering Operating System.
Every AI session starts from repo truth, not conversation memory.

Artemis is a multi-division organization and platform. Never assume Artemis means
construction, 5D, forecasting, Atlas, media, finance, or any other single division.
Determine ownership from the registries before editing.

## Mandatory Start

Before proposing or changing code, read:

1. `ENGINEERING/AI_SESSION_START_PROTOCOL.md`
2. `ENGINEERING/ARCHITECTURE.md`
3. `decisions/ADR-INDEX.md`
4. Any ADR listed by the index for the touched area
5. `ENGINEERING/DIVISION_REGISTRY.yaml`
6. `ENGINEERING/PRODUCT_REGISTRY.yaml`
7. `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml` when testbed or donor code is involved
8. The feature passport if the touched area has one
9. `docs/HANDOVER.md`

If those documents conflict with a chat message, use the highest-authority source and
state the conflict.

## Authority Order

1. Source code and tests
2. Accepted ADRs in `decisions/`
3. `ENGINEERING/ARCHITECTURE.md`
4. Engineering standards, security rules, and deployment rules
5. Division/Product/Testbed registries and feature passports
6. Prompt templates and handovers
7. AI session notes
8. Conversation context

Conversations are useful direction, but they are not architectural authority.

## Required Ownership Declaration

Before the first edit, declare:

- **Division:** which Artemis division owns the work
- **Product:** which product or product family owns the work
- **Lifecycle:** concept, prototype, testbed, rescue, active lab, active product, draft, or pilot
- **Visibility:** public, public-safe demo, noindex review, authenticated, private pilot, or internal operations
- **Data mode:** live official, live derived, synthetic, sample, sample fallback, private approved, or mixed explicit
- **Change type:** product-specific, shared capability, governance, or testbed migration
- **Canonical implementation:** branch, commit, route, and registry entry being changed
- **Cross-division effect:** any other product or division touched

No product code edit should proceed when ownership or canonical implementation is unknown.
Use `UNREVIEWED` or propose registry correction rather than guessing.

## Required Behavior

- Preserve existing architecture unless an ADR explicitly changes it.
- Keep experiments isolated on experiment, testbed, feature, labs, rescue, or governance branches.
- Do not move or rewrite stable systems without naming the governing ADR.
- Cite touched ADRs in summaries for architecture-relevant changes.
- Keep secrets out of source and chat. Follow `decisions/ADR-004-security-and-secrets.md`.
- Use preview-first deployment flow unless the human explicitly authorizes production.
- Separate product status from branch status.
- Do not declare a product superseded, retired, or replaced without product-level evidence.
- Do not merge donor or rescue branches wholesale when they contain unrelated concerns.
- Do not place branch, commit, deployment, rollback, or approval controls on ordinary public product routes.
- Never let sample or synthetic data silently impersonate live data.
- Mark recommendation confidence:
  - A: verified by repository
  - B: consistent with repository
  - C: inference from available context
  - D: speculation

## Testbed and Donor Rules

A testbed is a capability proving surface, not automatically a permanent product.

When working with ArtemisIX19 or another testbed:

1. Read `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml`.
2. Inventory the exact capability and source paths.
3. Assign or propose a disposition:
   - migrate
   - repair then migrate
   - retain as test fixture
   - reject
   - archive after evidence
4. Create the target work from current `main` on a fresh product-specific branch.
5. Extract only the approved capability.
6. Record target paths, validation, and provenance.
7. Do not retire the testbed until all verified capabilities have dispositions.

## Product Boundary Rules

- Each major product has one canonical implementation.
- A product may have multiple donor branches, but donor branches are evidence sources only.
- Product code may consume shared UI and approved Artemis Core interfaces.
- Product code must not import another product's private data or implementation by convenience.
- Cross-division dependencies must appear in the feature passport.
- A route is a delivery surface; it is not automatically a supported product.
- Labs status does not imply production, commercial support, or live data.

## Change Classes

Architecture-related changes require an ADR or ADR update:

- Organizational division or product hierarchy
- Folder structure
- Routing model
- Product boundaries or cross-product imports
- Map/rendering engine strategy
- Design system tokens or component boundaries
- Auth, database, payments, or secrets
- Deployment/domain strategy
- AI workflow and governance rules

Routine feature work can proceed without a new ADR when it stays inside accepted
boundaries.

## Handoff Requirement

Every substantial AI session should leave a durable note in one of:

- `docs/HANDOVER.md`
- `docs/history/`
- `docs/evolution/`
- a feature-specific passport or milestone file

The note should include branch, owning division, product, files changed, verification,
known risks, migration or donor provenance, and the next recommended task.
