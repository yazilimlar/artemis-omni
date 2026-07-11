# ADR-006 - Artemis Multi-Division Product Architecture

- **Status:** Accepted
- **Date:** 2026-07-10
- **Extends:** ADR-005

## Context

Artemis began with strong construction, project-controls, 5D cost, forecasting, and
utility intelligence work. The repository now also contains or incubates Atlas, historical
reconstruction, finance and tax architecture, media generation, botanical knowledge,
education, mapping, and other product directions.

The Artemis name must not be treated as a synonym for any one industry, product, route,
or experiment. The existing repository also contains testbeds such as ArtemisIX19 whose
working capabilities may belong in several future products rather than in one permanent
public product.

Without an explicit organizational model, AI agents can:

- describe all Artemis work as construction technology;
- mix unrelated products on one branch;
- mistake a testbed for a permanent product;
- declare a product superseded because an old branch was replaced;
- put shared capabilities inside the first product that happened to use them;
- expose internal operational information on public product routes.

## Decision

Artemis is an umbrella organization and AI-native platform composed of divisions,
products, shared capabilities, and an incubation layer.

### Organizational hierarchy

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

Division names are architectural working categories. Final commercial branding may be
changed through a later accepted ADR.

### Construction is a flagship division, not the Artemis boundary

Construction intelligence, CivicBid, utilities, project controls, 5D cost, forecasting,
cashflow, claims, and risk belong to the Infrastructure and Construction division unless
a later product decision assigns them elsewhere.

They are major Artemis capabilities, but they do not define all of Artemis.

### Labs is an incubator

Artemis Labs is not automatically a commercial division and does not grant production
status. A Labs route may be a public-safe demo, prototype, testbed, comparison, or
capability trial.

### Testbeds and capability donors

A testbed is a temporary integration surface used to prove or compare capabilities.
A testbed may contribute working capabilities to more than one product.

ArtemisIX19 is classified as a **testbed and capability donor**. Its route may remain
available during migration, but it is not presumed to be a permanent standalone product.
Each capability must be inventoried and assigned one of these dispositions:

- `migrate`
- `repair_then_migrate`
- `retain_as_test_fixture`
- `reject`
- `archive_after_evidence`

A testbed branch or route must not be deleted until its working capabilities are migrated,
explicitly rejected, or recorded as intentionally retained test fixtures.

### Product and branch status are separate

Branch lifecycle does not determine product lifecycle.

A branch may be merged, superseded, quarantined, or archived while its product remains
active. A product may be retired only with product-level evidence recorded in the Product
Registry or a dedicated ADR.

### Required product identity

Every major product must declare:

- owning division;
- product family;
- owner or review authority;
- lifecycle status;
- commercial maturity;
- canonical route;
- canonical source branch or commit;
- visibility class;
- data mode;
- dependencies and shared capabilities;
- testbed ancestry and migration state, when applicable.

### Visibility classes

Public visibility and product maturity are independent.

Approved visibility classes are:

- `public`
- `public_safe_demo`
- `noindex_review`
- `authenticated`
- `private_pilot`
- `internal_operations`

Internal branch, deployment, rollback, approval, and production-lineage information must
not appear on ordinary public product routes.

### Data modes

Every product surface that displays operational data must declare one of:

- `live_official`
- `live_derived`
- `synthetic`
- `sample`
- `sample_fallback`
- `private_approved`
- `mixed_explicit`

Sample or synthetic data must never silently impersonate live data.

### Shared capabilities

Cross-division capabilities belong to Artemis Core when they are reusable beyond one
product. Examples include provenance, normalization, scenario simulation, forecasting,
mapping, visualization, AI orchestration, export, identity, audit trails, and human-review
gates.

A product may consume shared capabilities through explicit interfaces. It must not import
another product's private data or implementation merely because both live in one repo.

### Authoritative registries

The following machine-readable registries are adopted:

- `ENGINEERING/DIVISION_REGISTRY.yaml`
- `ENGINEERING/PRODUCT_REGISTRY.yaml`
- `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml`

The registries route work; they do not replace source code, tests, ADRs, or feature
passports in the authority order.

## Consequences

- Artemis can expand into new departments and divisions without rewriting its identity.
- Construction and 5D products retain a clear home without constraining the platform.
- AI agents must identify division, product, maturity, visibility, and data mode before
  changing a product.
- ArtemisIX19 and future testbeds can be dismantled safely through capability migration.
- Product retirement requires evidence beyond branch age or naming.
- Cross-product contamination becomes easier to detect in review and CI.
- The registries require maintenance as products evolve.

## Non-goals

This ADR does not:

- rename public divisions immediately;
- move existing routes;
- merge or delete branches;
- declare every Labs route a supported product;
- establish billing, authentication, or corporate legal entities;
- authorize production deployment.

## Migration sequence

1. Establish division, product, and testbed registries.
2. Classify current products without deleting or moving code.
3. Inventory ArtemisIX19 capabilities.
4. Migrate verified capabilities product by product from fresh `main`-based branches.
5. Add import-boundary and registry checks after the registries stabilize.
6. Deprecate testbed routes only after migration evidence is complete.
