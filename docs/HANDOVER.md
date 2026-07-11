# Handover: Session 2026-07-10 — Multi-Division AIEOS v2

Standardized, parse-friendly handover. Keep the newest handover at the top or replace this
file when the previous state is no longer operationally current. Historical versions remain
available through Git.

## Current State

- Repo: `yazilimlar/artemis-omni`
- Canonical target branch: `main`
- Governance branch: `governance/aieos-multidivision-v2`
- Current GitHub default branch at session start: `feature/artemisix19-autonomous-generator`
- Default-branch correction required: set GitHub default to `main` through repository Settings
- Deployment: not changed during this session
- Product code: not changed during this session

## Division and Product Ownership

- Division: Artemis Core Platform / governance
- Product family: AIEOS
- Change class: governance and architecture
- Visibility: internal repository governance
- Data mode: repository evidence
- Governing ADRs: ADR-005 and ADR-006

## What This Session Did

Created a governance-only branch from `main` and extended the existing AIEOS rather than
adopting the parallel OpenCode operations model.

Added:

- `decisions/ADR-006-artemis-multidivision-product-architecture.md`
- `ENGINEERING/DIVISION_REGISTRY.yaml`
- `ENGINEERING/PRODUCT_REGISTRY.yaml`
- `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml`

Updated:

- `ENGINEERING/ARCHITECTURE.md`
- `ENGINEERING/PROJECT_GENOME.yaml`
- `ENGINEERING/AI_AGENT_RULES.md`
- `ENGINEERING/AI_SESSION_START_PROTOCOL.md`
- `ENGINEERING/BRANCH_LIFECYCLE.md`
- `ENGINEERING/FEATURE_PASSPORT_TEMPLATE.md`
- `ENGINEERING/SYSTEM_INDEX.md`
- `decisions/ADR-INDEX.md`
- `docs/HANDOVER.md`

## Decisions Established

1. Artemis is the umbrella organization and multi-division platform.
2. Infrastructure, construction, CivicBid, 5D, forecasting, utilities, cashflow, claims,
   and project controls are flagship work within one major division, not the full Artemis boundary.
3. Artemis Labs is an incubator, not automatic production or commercial status.
4. ArtemisIX19 is a testbed and cross-division capability donor.
5. Working ArtemisIX19 capabilities may migrate into appropriate products; broken,
   duplicate, or misleading behavior must not migrate merely for preservation.
6. Branch status and product status are separate.
7. Products require canonical implementations, visibility classes, and explicit data modes.
8. Sample or synthetic data must never silently impersonate live data.
9. Donor and contaminated branches require selective rescue from fresh `main`-based branches.
10. Internal branch, deployment, rollback, and approval information does not belong on ordinary public product routes.

## Verification

- Branch was created directly from `main`.
- Only governance, ADR, registry, and handover files were changed.
- No application routes, components, data engines, environment variables, deployment settings,
  or product implementations were changed.
- GitHub-connected edit session cannot independently run local `npm run typecheck`, `npm run lint`,
  or `npm run build`; the draft PR must run repository CI before merge.
- YAML and Markdown require clean-checkout validation through CI or a local worktree.

## Known Risks and Review Points

- Division names are architectural working categories, not final public brand commitments.
- Product Registry entries are evidence-based but provisional and require product-owner review.
- The GitHub default branch remains incorrect until changed manually to `main`.
- Vercel Production Branch is a separate setting and was not changed.
- No branch should be deleted during the current recovery phase.
- ArtemisIX19 migration dispositions remain `review_required` except the legacy route retained as a test fixture.

## Next Recommended Task

1. Review and merge this governance PR after CI passes.
2. Change the GitHub default branch to `main`.
3. Verify Vercel Production Branch separately; do not infer it from GitHub.
4. Create `rescue/civicbid-live-cockpit-v1` from current `main`.
5. Extract CivicBid-only API, normalization, registry, and scoring code.
6. Reconcile the visible CivicBid scoring explanation with the implemented formula.
7. Connect the cockpit to explicit live/sample/source-unavailable states.
8. Begin the ArtemisIX19 capability inventory only after the registries are accepted.
