# Branch Lifecycle

One concern per branch. The path from idea to production is explicit so no AI (or human)
has to guess where work belongs.

## Flow

```
experiment/*   →   labs/* (or feature/*)   →   main   →   tag (release)
  ephemeral         integration/feature        stable      checkpoint
```

- **`experiment/*`** — truly ephemeral spikes. Owned by `Any (sandboxed)`. Auto-delete
  after merge or failure. Never deployed to production.
- **`feature/*`** — one feature or concern. Verified (typecheck + lint + build) before PR.
- **`labs/*`** — integration branches where several features are tested together, or
  standalone HTML labs.
- **`docs/*`, `governance/*`, `brand/*`, `product/*`, `strategy/*`** — non-code concerns
  kept off feature branches so history stays legible.
- **`main`** — stable, deployable, protected. PRs only.

## Rules

1. **Never mix concerns on one branch.** Monetization, atlas, and governance are three
   branches, not one commit. (See the Recovery Matrix row for intermixed WIP.)
2. **Verify before PR:** `npm run typecheck && npm run lint && npm run build`.
3. **PR into `main`** (or `develop` if adopted) with the safety checklist filled.
4. **Tag on release** and record a changelog under `docs/history/`.
5. **Delete merged branches** to keep the branch list honest.

## Recommended protection (GitHub)

- Require PRs into `main`.
- Require the governance check workflow to pass (advisory steps may be non-blocking).
- Require at least the author's completed PR checklist.

## Current branch inventory note

If the branch list has drifted (many branches at the same commit, uncommitted work
spread across the tree), do a reconciliation pass: commit each concern to its own branch
by explicit path, then prune. Record the reconciliation in `docs/HANDOVER.md`.
