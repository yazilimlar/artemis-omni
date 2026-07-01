# Handover: Session 2026-06-30 — Governance foundation + WIP reconciliation

Standardized, parse-friendly handover (AIEOS Level 8). Update this at the end of every
substantial session. Keep the newest handover at the top.

## Current State

- Repo: `yazilimlar/artemis-omni` (SSH remote; HTTPS push 400s on large packs)
- Vercel: `gokmen1313-3041s-projects/artemis-omni` — LIVE at https://artemis-omni.vercel.app
- Branch (this work): `governance/aieos-foundation`
- Build baseline: `main` @ `339a6af` — typecheck/lint/build green as of last check

## What this session did

Filled the AIEOS governance gaps on top of Codex's existing `ENGINEERING/` foundation:
- Added `CAPABILITY_REGISTRY.md`, `RECOVERY_MATRIX.md`, `BRANCH_LIFECYCLE.md`,
  `ENGINEERING_DNA.md`, `SYSTEM_INDEX.md` under `ENGINEERING/`.
- Added `.github/PULL_REQUEST_TEMPLATE.md` (AI safety checklist) and
  `.github/workflows/governance-check.yml` (typecheck/lint/build + advisory checks).
- Rescued Codex's previously-uncommitted `ENGINEERING/` files into version control.

## ⚠️ Uncommitted work still in the tree (do NOT lose)

The working tree currently holds three intermixed, previously-uncommitted concerns.
Governance was committed by explicit path; the rest remain and must each go to their own
branch (see BRANCH_LIFECYCLE.md):

1. **Atlas feature (Codex):** `app/labs/artemis-atlas-all-countries/`, and modified
   `app/labs/page.tsx`, `app/sitemap.ts`, `data/programCatalog.ts`, `docs/AIWorkflow.md`.
   → belongs on `feature/artemis-atlas-all-countries`.
2. **Monetization + social (Claude Code):** `app/pricing/`, `data/pricing.ts`,
   `app/insights/social/`, `components/social/SocialStudio.tsx`, `data/socialEngine.ts`.
   → belongs on `feature/monetization-social-engine`. Adds `/pricing` (tiers + training)
   and `/insights/social` (audience×pillar daily-post engine). Needs nav links +
   typecheck before PR.

## Active Objectives

- [ ] Reconcile the two WIP concerns above onto their branches, one PR each.
- [ ] Consolidate the divergent Desktop repo (`/studio`, `/artemisix`, `/artemisix/modules`)
      into this canonical repo, or formally retire it.
- [ ] Wire nav for `/pricing` and `/insights/social`; typecheck; verify; PR.

## Known Issues

- Branch list has drifted: several branches sit at the same commit `339a6af`.
- Mapbox atlas routes need `NEXT_PUBLIC_MAPBOX_TOKEN` (URL-restricted public token).

## Next Recommended Task

Check out `feature/monetization-social-engine`, `git add` only the monetization/social
paths, add nav links, run `npm run typecheck && npm run build`, open PR. Then repeat for
the atlas branch.
