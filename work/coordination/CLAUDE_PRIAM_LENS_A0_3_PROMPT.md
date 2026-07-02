# Claude Resume Prompt: Priam Lens A0.3

Use this after Claude Code is logged in.

From the repo root:

```bash
claude
```

Then run Claude Code's `/login` flow if prompted. After login succeeds, exit the interactive session and run:

```bash
claude -p --model fable --permission-mode acceptEdits --allowedTools Read Edit MultiEdit Write Bash Glob Grep LS --max-budget-usd 8 "Read work/coordination/CODEX_CLAUDE_HANDOFF.md first, then read docs/time-atlas/artemis_time_atlas_production_kit/README_PRODUCTION_START.md, docs/time-atlas/artemis_time_atlas_production_kit/00_COMMAND_CENTER.md, docs/time-atlas/artemis_time_atlas_production_kit/ENGINEERING/AI_AGENT_RULES.md, docs/time-atlas/artemis_time_atlas_production_kit/PROMPTS/00_CLAUDE_BOOTSTRAP_FACTORY.md, and docs/time-atlas/artemis_time_atlas_production_kit/PROMPTS/01_CLAUDE_APP_SCAFFOLD.md.

You are Claude Code Fable, acting as the primary implementation agent for the first bounded pass only.

Authoritative run identity:
- Workstream name: Artemis Time Atlas: Priam Lens
- Implementation version: A0.3
- Branch: feature/priam-lens-a0-3
- Route: /time-atlas/troy
- Treat V1 references inside the kit as source-plan labels only; do not rename this implementation back to V1.

Before editing, verify you are on branch feature/priam-lens-a0-3. If not, stop and report.

Execute only these phases:
1. Factory setup: ensure the production kit docs are present under docs/time-atlas/artemis_time_atlas_production_kit and add any small run-specific note needed for Priam Lens A0.3.
2. App scaffold: create a working shell route at /time-atlas/troy with the component/data/hook/type structure requested by PROMPTS/01_CLAUDE_APP_SCAFFOLD.md.

Use npm because this repo has package-lock.json. Install only the dependencies requested by the scaffold prompt if they are not already present: three, @types/three, @react-three/fiber, @react-three/drei, gsap, zustand, framer-motion. Do not install leva unless you actually use it, and avoid using it in this pass.

Hard boundaries:
- Do not build the full 3D scene yet. A lightweight placeholder shell/canvas is okay only as needed to prove the route loads.
- Do not add Supabase, auth, Cesium, full globe, free camera navigation, secrets, deploy config, commits, or staging.
- Do not modify unrelated routes.
- Do not edit, stage, revert, or include these pre-existing unrelated files: public/standalone/george-aegean-quest.html, app/labs/page.tsx, data/programCatalog.ts.
- Keep all Troy data local and provisional.

Validation before claiming completion:
- Run npm run lint.
- Run npm run build.
- Run npm run typecheck because this repo has that script.
- If validation fails, make targeted fixes and rerun the failing command once.

Return a concise implementation summary, changed files, commands run, validation results, and any blockers. Do not commit."
```
