# Codex / Claude Code Handoff

Updated: 2026-06-30 17:45 America/New_York
Workspace: /Users/theoppositeofturtle/Documents/artemis-for-codex/artemis-omni-codex-local
Current owner: Codex
Branch: feature/publish-standalone-labs

## Objective

Publish two reviewed standalone HTML prototypes into Artemis Labs, document the Vercel/custom-domain milestone, and preserve the root-domain DNS boundary.

## Current State

- Production domain verified with `curl -I -L --max-time 20 https://artemis.agoraxai.com`: `HTTP/2 200`, `server: Vercel`.
- Root domain remains out of scope. Do not change DNS, nameservers, or apex/root records.
- Standalone source files were copied from the Desktop into `public/standalone/`.

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
```

## Verification

Pending after implementation:

```bash
npm run typecheck
npm run lint
npm run build
grep -RInE 'sk-[A-Za-z0-9]|github_pat_|ghp_|AKIA|BEGIN .*PRIVATE KEY|mapbox.*sk\.' public/standalone app/labs app/library data docs || true
npm run dev -- --port 3001
```

## Blockers

- Mapbox public `pk.*` token exists in the Atlas artifact. This is expected for a browser app, but it should be URL-restricted before aggressive public promotion.
- Production deploy should happen only after local typecheck, lint, build, secret scan, and browser smoke checks pass.

## Next Commands

```bash
npm run typecheck
npm run lint
npm run build
npm run dev -- --port 3001
```
