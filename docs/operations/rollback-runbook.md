# Rollback Runbook

## If production is broken

1. Identify the last known good commit on `main`.
2. Revert the bad merge or deploy the last good commit.
3. Verify the fix on a preview deployment before promoting.
4. Document the incident.

## Rollback via Vercel

```bash
vercel rollback --scope artemis-omni
```

## Rollback via Git

```bash
git checkout main
git revert HEAD
git push origin main
```

## Prevention

- Never deploy unreviewed code.
- Never deploy from non-`main` branches.
- Always run preflight checks before merging.
