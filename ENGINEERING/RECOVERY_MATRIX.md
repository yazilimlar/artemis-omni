# Recovery Matrix

Fast, deterministic recovery paths. When something breaks, find the row and run the
recovery — do not improvise on a live branch.

| Problem | Recovery |
|---|---|
| One file broken | `git restore <file>` |
| Uncommitted changes need saving before a risky op | `git stash` (or commit on a WIP branch) |
| Last commit broken | `git revert HEAD` (preserves history) |
| Branch broken | Delete and recreate from `main`/`develop` |
| Experiment failed | Delete the `experiment/*` branch |
| Production broken | Redeploy the last tagged release on Vercel |
| AI damaged architecture | Revert to last milestone tag, re-run with ADR guidance |
| ADR lost or overwritten | Restore from git history (`git log -- decisions/`) or daily backup |
| AI went off-road / hallucinated | Roll back to the last `docs/HANDOVER.md` checkpoint |
| Two agents' work intermixed uncommitted | Commit each concern on its own branch by explicit path (`git add <paths>`); never `git add -A` when concerns are mixed |
| Wrong branch has your changes | Untracked files carry across checkouts; `git switch <branch>` then commit them there |

## Milestone tags

Tag every releasable state so recovery has an anchor:

```
git tag -a v0.x.0-<domain> -m "..."   # e.g. v0.3.0-atlas
```

Store a matching changelog under `docs/history/` (already the convention). A tag +
changelog + preview URL together form a recovery checkpoint.

## Backups

Beyond git, keep periodic ZIP snapshots (30 daily / monthly archive) with a
`BACKUP_LOG.md` of timestamps and hashes. Git is history; the ZIP is insurance against
repository-level loss.
