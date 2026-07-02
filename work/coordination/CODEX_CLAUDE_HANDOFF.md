# Codex / Claude Code Handoff

Updated: 2026-07-02 19:15 America/New_York
Workspace: /Users/theoppositeofturtle/Documents/artemis-for-codex/artemis-omni-codex-local
Current owner: Codex through deploy verification

## Objective

Start Artemis Time Atlas as an isolated Troy vertical slice using the attached production kit as source material, but track this implementation under a unique workstream and alternative version:

- Workstream name: Artemis Time Atlas: Priam Lens
- Implementation version: A0.3
- Branch: feature/priam-lens-a0-3
- Route: /time-atlas/troy
- Public development route: /development-env001/troy-priam-a03-x7q9z2

## Current State

- The repository is a Next.js app named `artemis-omni`.
- `main` matched `origin/main` before this branch was created.
- Earlier unrelated George Quest local modifications were treated as out of scope. They are not part of this branch's Time Atlas commit.
- The attached production kit was extracted under `docs/time-atlas/artemis_time_atlas_production_kit`.
- The attached master start document was copied to `docs/time-atlas/ARTEMIS_TIME_ATLAS_V1_MASTER_START.md`.
- Treat `V1` references inside the kit as source-plan labels only. This run is `Priam Lens A0.3`.
- Claude Code is installed and reachable, but the first non-interactive implementation attempt stopped before edits because Claude Code is not logged in.
- Per user instruction to publish a working Vercel path, Codex implemented a dependency-light A0.3 development route without waiting on Claude login.

## Scope Rules

- Keep implementation isolated to `/time-atlas/troy` and Time Atlas-specific components, hooks, data, docs, and types.
- Do not add Supabase, auth, a full globe, Cesium streaming, free camera navigation, generated build artifacts, or secrets.
- Keep all Troy data local and provisional unless source notes are verified.
- Do not modify unrelated routes.

## Files Changed

- `docs/time-atlas/artemis_time_atlas_production_kit/**`
- `docs/time-atlas/ARTEMIS_TIME_ATLAS_V1_MASTER_START.md`
- `work/coordination/CODEX_CLAUDE_HANDOFF.md`
- `work/coordination/CLAUDE_PRIAM_LENS_A0_3_PROMPT.md`
- `app/time-atlas/troy/page.tsx`
- `app/development-env001/troy-priam-a03-x7q9z2/page.tsx`
- `components/time-atlas/troy/TimeAtlasTroyExperience.tsx`
- `data/troy/**`
- `types/time-atlas/index.ts`

## Commands Run

- `claude --version` -> `2.1.195 (Claude Code)`
- `claude plugin list`
- `git switch -c feature/priam-lens-a0-3`
- `mkdir -p docs/time-atlas`
- `mkdir -p work/coordination`
- `unzip -q /Users/theoppositeofturtle/Desktop/artemis_time_atlas_production_kit.zip -d docs/time-atlas`
- `cp /Users/theoppositeofturtle/Desktop/ARTEMIS_TIME_ATLAS_V1_MASTER_START.md docs/time-atlas/ARTEMIS_TIME_ATLAS_V1_MASTER_START.md`
- `claude -p --model fable ...` -> failed immediately with `Not logged in · Please run /login`
- `claude config list` -> failed with `Not logged in · Please run /login`
- `vercel --version` -> `54.18.6`
- `vercel whoami` -> `gokmen1313-3041`
- `gh auth status` -> logged in as `yazilimlar`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run start -- -p 3031`
- `curl -I http://localhost:3031/development-env001/troy-priam-a03-x7q9z2`
- `curl -I http://localhost:3031/time-atlas/troy`

## Verification

- `npm run typecheck` passed.
- `npm run lint` passed with no warnings or errors.
- `npm run build` passed and generated 63 static pages, including:
  - `/development-env001/troy-priam-a03-x7q9z2`
  - `/time-atlas/troy`
- Local production smoke checks returned `200 OK` for both new routes.

## Blockers

Claude Code still requires interactive login before `claude -p` can execute. This did not block the Codex-built development route.

## Next Commands

Commit, push `feature/priam-lens-a0-3`, deploy to Vercel, and verify:

- `https://artemis.agoraxai.com/development-env001/troy-priam-a03-x7q9z2`
- `https://artemis.agoraxai.com/time-atlas/troy`
