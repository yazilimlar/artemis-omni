# AI Session Start Protocol

Mandatory. Every AI agent runs this **before editing any file**. It exists because
multiple agents share this repository and each session starts with amnesia (see
`AI_AGENT_RULES.md`). Skipping it is how uncommitted work from different concerns gets
swept into the wrong commit.

## 1. Report state before touching anything

Run and report the output of:

```bash
git branch --show-current
git status --short
git log --oneline -5
git diff --stat
find . -maxdepth 2 -name ".env*" -not -path './node_modules/*' -print
```

## 2. Declare intent (required, before the first edit)

The agent must state, in the session, all four:

- **Current branch** and whether it is the right branch for this concern
- **Working tree state** (clean, or which untracked/modified files exist and who owns them)
- **Files it intends to modify** (explicit list)
- **Files it promises NOT to touch** (other concerns' WIP, `.env*`, protected areas)

No edits until those four are reported.

## 3. Staging rules — never `git add -A`

- **Explicit paths only.** e.g.
  `git add ENGINEERING/CAPABILITY_REGISTRY.md docs/HANDOVER.md`
- **Never** `git add -A`, `git add .`, or `git commit -a` in this repo. Those sweep
  unrelated untracked files (governance, atlas, pricing, `.env*`) into one commit.
- One concern per branch, one PR at a time (see `BRANCH_LIFECYCLE.md`).
- Never stage `.env*` files.

## 4. Verify before PR

Clean stale build cache first (branch switching leaves `.next/types` referencing
routes that don't exist on this branch):

```bash
rm -rf .next
npm run typecheck && npm run lint && npm run build
```

## 5. Push and PR rules

- Push **branches only**. Never push `main`. Never force-push shared branches.
- Open **Draft PRs** for human review. Do not merge. Do not deploy to production.
- Preview-first: production deploy requires explicit human authorization.

## 6. Close the session

Update `docs/HANDOVER.md` with branch, files changed, verification, known risks, and the
next recommended task. Leave the tree in a state the next agent can safely resume.

## Recommended: one worktree per concern

With multiple agents, prefer separate folders/worktrees so `.next`, untracked files, and
branch switching cannot contaminate each other:

```bash
git worktree add ../artemis-governance   governance/aieos-foundation
git worktree add ../artemis-monetization feature/monetization-social-engine
git worktree add ../artemis-atlas        feature/artemis-atlas-all-countries
```

| Folder | Branch | Scope |
|---|---|---|
| `artemis-governance` | `governance/aieos-foundation` | rules & docs only |
| `artemis-monetization` | `feature/monetization-social-engine` | pricing & social only |
| `artemis-atlas` | `feature/artemis-atlas-all-countries` | atlas only |
