# Codex / Claude Code Handoff

Updated: 2026-06-30 18:01 America/New_York
Workspace: /Users/theoppositeofturtle/Documents/artemis-for-codex/artemis-omni-codex-local
Current owner: Human / next agent
Branch: feature/publish-standalone-labs

## Objective

Publish two reviewed standalone HTML prototypes into Artemis Labs, document the Vercel/custom-domain milestone, and preserve the root-domain DNS boundary.

## Current State

- Production domain verified with `curl -I -L --max-time 20 https://artemis.agoraxai.com`: `HTTP/2 200`, `server: Vercel`.
- Root domain remains out of scope. Do not change DNS, nameservers, or apex/root records.
- Standalone source files were copied from the Desktop into `public/standalone/`.
- Commits created: `27d18ee feat: publish standalone Artemis labs`, `68910de fix: keep atlas external graph fallback quiet`.
- Branch pushed: `origin/feature/publish-standalone-labs`.
- Preview deployment built successfully but its `*.vercel.app` URL is protected by Vercel SSO.
- Production deployment `dpl_BW4GNZrcx2a9XF1fV2yFKq3TUeLL` is live and aliased to `https://artemis.agoraxai.com`.

## Files Changed

- `public/standalone/tax-architecture-2026.html`
- `public/standalone/turkiye-atlas.html`
- `app/labs/tax-architecture-2026/page.tsx`
- `app/labs/turkiye-atlas/page.tsx`
- `app/labs/page.tsx`
- `app/library/programs/page.tsx`
- `data/programCatalog.ts`
- `app/sitemap.ts`
- `lib/site.ts`
- `docs/history/ARTEMIS_VERCEL_MILESTONE_2026-06-30.md`
- `work/coordination/CODEX_CLAUDE_HANDOFF.md`

## Commands Run

```bash
git switch -c feature/publish-standalone-labs
curl -I -L --max-time 20 https://artemis.agoraxai.com
cp /Users/theoppositeofturtle/Desktop/individual_tax_true_3d_finance_architecture_2026\ \(1\).html public/standalone/tax-architecture-2026.html
cp /Users/theoppositeofturtle/Desktop/artemis_turkiye_atlas_v0_26_polished_interactive_atlas.html public/standalone/turkiye-atlas.html
npm run typecheck
npm run lint
npm run build
npx vercel@latest --yes
npx vercel@latest --prod --yes
git push -u origin feature/publish-standalone-labs
npx vercel@latest --prod --yes
```

## Verification

Passed:

```bash
npm run typecheck
npm run lint
npm run build
grep -RInE 'sk-[A-Za-z0-9]|github_pat_|ghp_|AKIA|BEGIN .*PRIVATE KEY|mapbox.*sk\.' public/standalone app/labs app/library data docs || true
rg -n --pcre2 '(github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9_]+|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|mapbox[^\n]{0,120}sk\.[A-Za-z0-9._-]+|(?<![A-Za-z0-9_-])sk-[A-Za-z0-9]{20,})' public/standalone app/labs app/library data docs || true
curl -I -L --max-time 20 https://artemis.agoraxai.com
curl -I -L --max-time 20 https://artemis.agoraxai.com/labs
curl -I -L --max-time 20 https://artemis.agoraxai.com/labs/tax-architecture-2026
curl -I -L --max-time 20 https://artemis.agoraxai.com/labs/turkiye-atlas
```

Production routes returned `HTTP/2 200`. The stricter token-shape scan found no private tokens.
The simple grep produced expected false positives from CSS/text such as `mask-image`,
`task-lane`, and Atlas warning copy that mentions `sk.`.

## Blockers

- Mapbox public `pk.*` token exists in the Atlas artifact. This is expected for a browser app, but it should be URL-restricted before aggressive public promotion.
- The GitHub default branch is still `feature/artemisix19-autonomous-generator`; branch policy should be cleaned up before relying on Git-triggered production deploys.
- The final docs-only handoff update was pushed after the production app deployment; runtime code is deployed from `68910de`.

## Next Commands

```bash
gh pr create --base feature/artemisix19-autonomous-generator --head feature/publish-standalone-labs --draft
npx vercel@latest inspect artemis-omni-f2wqmpzco-gokmen1313-3041s-projects.vercel.app
```
