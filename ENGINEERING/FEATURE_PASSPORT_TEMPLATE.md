# Feature Passport Template

Use this for major Artemis products, features, labs, engines, testbeds, or shared
capabilities.

## Identity

- ID:
- Name:
- Division:
- Product family:
- Product:
- Owner / review authority:
- Lifecycle status:
- Commercial maturity:
- Visibility class:
- Data mode:
- Version:
- Created:
- Modified:

## Canonical Implementation

- Canonical route:
- Canonical branch:
- Canonical commit or release tag:
- Product Registry entry:
- Division Registry entry:
- Source-of-truth data/system:

## Purpose

What problem this feature solves, who it serves, and which decision or outcome it enables.

## Scope

In scope:

- 

Out of scope:

- 

## Product and Division Boundaries

- Product-specific responsibilities:
- Shared Artemis Core capabilities consumed:
- Cross-division dependencies:
- Other products explicitly not owned by this feature:
- Allowed import directions:
- Forbidden import directions:

## Testbed and Donor Provenance

- Testbed ancestry:
- Donor branches:
- Donor commits:
- Selected source paths:
- Excluded donor concerns:
- Migration disposition:
- Migration record:
- Retirement/deprecation condition:

Use `None` when the feature has no testbed or donor ancestry. Do not leave provenance
ambiguous during rescue work.

## Dependencies

- Code:
- Data:
- Third-party services:
- Environment variables:
- External assets:
- Shared platform interfaces:

## Data Truth

- Declared data mode:
- Live source and retrieval method:
- Sample/synthetic source:
- Fallback behavior:
- Timestamp/freshness behavior:
- Human-review boundary:
- Official source-of-truth statement:

Sample or synthetic data must never silently impersonate live data.

## Architecture Links

- Related ADRs:
- Related docs:
- Related prompts:
- Related milestones:
- Related division/product registry entries:

## Security and Privacy

- Secrets involved:
- Public/private data boundary:
- User data handling:
- Internal operational information exposed:
- Authentication/authorization:
- Known risks:

## Validation

- Typecheck:
- Lint:
- Build:
- Unit tests:
- Integration tests:
- Browser QA:
- Accessibility:
- Performance:
- Security/secret scan:
- Data-mode claim verification:
- Function-parity verification:

## Lifecycle and Commercial Path

- Current lifecycle:
- Current maturity:
- Next maturity gate:
- Pilot requirements:
- Production requirements:
- Subscription/auth requirements:
- Deprecation condition:

## Roadmap

- Next:
- Later:
- Not planned:

## AI Notes

Required context before modifying this feature:

- Owning division and product
- Canonical implementation
- Applicable ADRs
- Visibility and data mode
- Testbed/donor migration state
- Protected paths and excluded concerns
