# Release Workflow

## Branch Lifecycle

```
Feature Branch → Preview → Needs Review → Approved → Ready for Main → Main → Live
```

## Steps

1. Feature work happens on `feature/*` branches.
2. Create a preview deployment via Vercel for review.
3. Submit a pull request against `main`.
4. After review and approval, merge into `main`.
5. Deploy `main` to production.

## Governance

- All merges to `main` require passing CI (lint, typecheck, build).
- Production deployments must be initiated from `main` only.
- The ops dashboard (`/ops/deck`) provides a visual status board but does not perform deployments.
