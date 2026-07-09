# AI Session Start Protocol

## Branch Rules

1. **Always verify the current branch before making changes.**  
   The GitHub default branch (`feature/artemisix19-autonomous-generator`) is NOT canonical.  
   Do not start from it, merge it, or deploy it.

2. **Canonical branches:**
   - `main` — desired production source
   - `ops/release-control-dashboard` — control panel

3. **Active feature branch:**
   - `feature/civicbid-sourceledger-command-deck`

4. **Never:**
   - Run `vercel --prod`
   - Promote previews manually
   - Merge `test/*`, `claude/*`, `opencode/*`, `archive/*`, or `feature/artemisix19-autonomous-generator`

## Preflight

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
npm run lint
npm run typecheck
npm run build
```

## Ops Dashboard

The ops dashboard lives at `/ops/deck`. It is a static, client-state-free reference for release management.
