# Branch Lifecycle

One concern per branch. The path from idea to production is explicit so no AI or human
has to guess where work belongs.

Branch lifecycle and product lifecycle are separate. A merged or archived branch does not
prove that its product is retired, and an active branch does not prove production status.

## Flow

```text
experiment/* ─┐
testbed/* ─────┼→ feature/* or product/* → main → tag/release record
rescue/* ──────┘

governance/* → main
```

## Branch Classes

- **`experiment/*`** — short-lived technical spike. Owned by `Any (sandboxed)`. Never production.
- **`testbed/*`** — reusable capability experiment or integration surface. May feed several products.
- **`feature/*`** — one product feature or one tightly bounded concern.
- **`product/*`** — product-level integration after individual capabilities have been reviewed.
- **`labs/*`** — Labs integration or standalone public-safe prototype work.
- **`rescue/*`** — selective extraction from contaminated, obsolete, or mixed ancestry.
- **`governance/*`** — AIEOS, architecture, ADRs, registries, and governance-only changes.
- **`brand/*`, `docs/*`, `strategy/*`** — non-product concerns kept separate from implementation.
- **`release/*`** — optional short-lived stabilization branch when explicitly approved.
- **`archive/*`** — preserved historical state; no active development and no automatic product-retirement claim.
- **`main`** — stable, deployable, protected, PR-only canonical branch.

Division-wide branches should be rare. Coordinated division changes still require explicit
product boundaries and must not become a catch-all workspace.

## Testbed Lifecycle

A testbed must have an entry in `ENGINEERING/TESTBED_MIGRATION_REGISTRY.yaml` when its
capabilities may migrate into products.

A testbed may be retired only after:

1. verified capabilities are inventoried;
2. each capability has a recorded disposition;
3. migrated capabilities have target paths and validation evidence;
4. rejected capabilities have reasons;
5. retained test fixtures have an owner and continuing purpose.

ArtemisIX19 is governed by this rule.

## Rescue Lifecycle

A rescue branch always starts from current `main`.

```text
main
  → rescue/<product-or-capability>
  → selectively copy/cherry-pick approved paths or commits
  → verify provenance and parity
  → PR to main
```

Never merge a contaminated donor branch wholesale merely because it contains valuable
work. Record donor branch, donor commit, selected paths, excluded concerns, and validation.

## Rules

1. **Never mix concerns on one branch.** Governance, CivicBid, Atlas, and Studio are separate concerns.
2. **Declare ownership.** Every branch names division, product, lifecycle, visibility, and data mode in its PR.
3. **Verify before PR:** `npm run typecheck && npm run lint && npm run build`.
4. **PR into `main`** unless an accepted ADR establishes another integration branch.
5. **Use explicit-path staging.** Never `git add -A`, `git add .`, or `git commit -a`.
6. **Tag or record releases** under `docs/history/` with exact commit and deployment identity.
7. **Do not delete on assumption.** Delete only after merge/recovery evidence and the observation window.
8. **Do not equate archive with retirement.** Branch disposition and product disposition are separate records.
9. **Do not work from the repository default branch unless it is verified as `main`.**
10. **Use a separate worktree per active concern** whenever multiple AI agents or products are involved.

## Recommended Protection for `main`

- Make `main` the GitHub default branch.
- Require PRs into `main`.
- Block deletion and force pushes.
- Require typecheck, lint, and build checks.
- Require conversation resolution.
- Require the governance checklist.
- Add approval requirements only when a reliable reviewer is available.

Changing GitHub's default branch and changing Vercel's production branch are separate
operations. Neither should be inferred from the other.

## Reconciliation Rule

When branch drift exists:

1. preserve every branch head and local-only work;
2. determine exact production commit/deployment;
3. classify branches provisionally without deleting;
4. identify canonical product implementations;
5. rescue approved capabilities from fresh `main`-based branches;
6. retain donor branches through an observation period;
7. prune only after evidence and owner approval.

Record reconciliation in `docs/HANDOVER.md` and the appropriate Product/Testbed registry.
