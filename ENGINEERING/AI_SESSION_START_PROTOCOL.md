# AI Session Start Protocol

Mandatory. Every AI agent runs this **before editing any file**. It exists because
multiple agents share this repository and each session starts with amnesia. Skipping it
is how uncommitted work, unrelated products, testbeds, and governance changes get swept
into the wrong branch or commit.

## 1. Report state before touching anything

Run and report:

```bash
git branch --show-current
git status --short
git log --oneline -5
git diff --stat
git remote -v
find . -maxdepth 2 -name ".env*" -not -path './node_modules/*' -print
```

Also verify the repository's current GitHub default branch and do not assume it is
canonical. The canonical target is recorded in `ENGINEERING/PROJECT_GENOME.yaml`.

## 2. Read the authority chain

Before editing, read:

1. `ENGINEERING/SYSTEM_INDEX.md`
2. `ENGINEERING/AI_AGENT_RULES.md`
3. `ENGINEERING/ARCHITECTURE.md`
4. `decisions/ADR-INDEX.md` and applicable ADRs
5. `ENGINEERING/DIVISION_REGISTRY.yaml`
6. `ENGINEERING/PRODUCT_REGISTRY.yaml`
7. `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml` when donor/testbed code is involved
8. the applicable feature passport
9. `docs/HANDOVER.md`

## 3. Declare intent before the first edit

The agent must state all of the following:

### Repository state

- Current branch and whether it is correct for this concern
- Working-tree state and ownership of modified/untracked files
- Exact files intended to change
- Exact files and product areas that will not be touched

### Product ownership

- Owning Artemis division
- Owning product or product family
- Lifecycle state
- Commercial maturity
- Visibility class
- Data mode
- Whether the work is product-specific, shared capability, governance, or testbed migration
- Canonical route/branch/commit being changed
- Cross-division or cross-product effects

No edits until these declarations are made. When ownership or canonical implementation is
unknown, classify the item as `UNREVIEWED` and stop implementation until evidence resolves it.

## 4. Select the correct branch class

Use:

- `experiment/*` for short-lived spikes
- `testbed/*` for reusable capability experiments
- `feature/*` for one feature
- `product/*` for reviewed product integration
- `labs/*` for isolated Labs work
- `rescue/*` for selective extraction from mixed ancestry
- `governance/*` for AIEOS/ADR/registry changes

Never continue product work from a mixed donor branch merely because it contains the
desired files. Start rescue work from current `main` and extract selectively.

## 5. Staging rules — never `git add -A`

- Stage explicit paths only.
- Never use `git add -A`, `git add .`, or `git commit -a` in this repo.
- Never stage `.env*`, `.next`, `node_modules`, build output, or unrelated WIP.
- One concern per branch and one bounded PR at a time.

Example:

```bash
git add ENGINEERING/PRODUCT_REGISTRY.yaml decisions/ADR-006-artemis-multidivision-product-architecture.md
```

## 6. Testbed and donor rule

Before copying from ArtemisIX19 or another donor/testbed:

1. identify the capability in `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml`;
2. record donor branch, commit, and exact paths;
3. choose a provisional disposition;
4. create a fresh target branch from `main`;
5. copy only approved capability paths;
6. validate parity and public/data boundaries;
7. update the migration record.

Do not retire the testbed until every verified capability has a final disposition.

## 7. Verify before PR

Clean stale build cache first when branch switching has left invalid route types:

```bash
rm -rf .next
npm run typecheck
npm run lint
npm run build
```

Also verify, as applicable:

- product registry and passport agree;
- visible data mode matches implementation;
- sample data cannot be mistaken for live data;
- no internal deployment/branch controls appear on public product routes;
- donor provenance and excluded concerns are documented;
- no unrelated product paths changed.

## 8. Push and PR rules

- Push branches only. Never push directly to `main`.
- Never force-push a shared branch.
- Open Draft PRs for human review.
- Base PRs on `main` unless an accepted ADR says otherwise.
- Do not deploy to production.
- Production requires explicit human authorization after review and checks.

## 9. Close the session

Update `docs/HANDOVER.md` or a durable product/history record with:

- branch;
- division and product;
- files changed;
- verification;
- donor/testbed provenance;
- known risks;
- next recommended task.

Leave the tree in a state another agent can resume without guessing.

## Recommended: one worktree per concern

```bash
git worktree add ../artemis-governance governance/aieos-multidivision-v2
git worktree add ../artemis-civicbid rescue/civicbid-live-cockpit-v1
git worktree add ../artemis-atlas product/atlas-next
git worktree add ../artemis-studio product/studio-next
```

Each worktree owns one concern. Do not reuse build caches or untracked files across active
products when avoidable.
