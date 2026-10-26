# M2.8.1 Read-Only GitHub / Vercel Topology Audit R01

| Field | Value |
|---|---|
| Document ID | M281-AUDIT-01 |
| Status | READ-ONLY AUDIT — no changes made or proposed to production |
| Date | 2026-10-26 (live API checks ~18:55–19:00 EDT) |
| Method | GitHub API via the stored `custom.github` credential; Vercel API via the stored `custom.vercel` credential. Read-only calls only |

## GitHub — Verified

| Item | Finding | Evidence state |
|---|---|---|
| Canonical repo | `yazilimlar/artemis-omni` (public; default branch `main` @ `af391e4813ad`) | Verified (repo API) |
| Canonical base branch | `feature/tax-intelligence-m28-documentation-foundation-r1` | Verified (branch API) |
| HEAD at audit | `63864c8609f887b9fbb1fb6ece0533b38f1c72b9` — "docs(tax): M2.8.1 Apolloa formation intelligence and multi-AI builder handoff", 2026-10-26T22:54:07Z, author yazilimlar | Verified |
| Handoff minimum base | `c8c83a37d04d` (parent of HEAD) — the required base is satisfied; HEAD is exactly 1 commit ahead of it | Verified |
| Ancestry on this branch | `63864c86` ← `c8c83a37` (formation study) ← `a459fbdd` (pre-registration status) ← `74742c8a` (independent-agora clarification) ← `e11a1d39` (D-01) ← `ee4e3ea5` (GPT-6 foundation review) / `5da71991` (M2.8 Foundation v0.1) ← `30afa95c`/`57c306f3`/`9823d62f` (foundation drafts) ← `e5d28550` (M2.7.1 synthetic acceptance) | Verified (commits API) |
| Tax-intelligence branches (all) | `feature/tax-intelligence-client-app-r1` @ `e348e1f6`; `feature/tax-intelligence-m27-schema-r1` @ `c6d95d6d`; `feature/tax-intelligence-m27-kernel-r1` @ `d9a040c0`; `feature/tax-intelligence-m271-hardening-r1` @ `e5d28550`; `feature/tax-intelligence-m28-documentation-foundation-r1` @ `63864c86` | Verified |
| M2.8.1 child branch | Did **not** exist at audit time. Created by this package as `feature/tax-intelligence-m281-apolloa-formation-r1` from HEAD `63864c86`, per the handoff's suggested name. No work on `main`; no history rewritten | Verified at creation |
| Open PRs | No open PR for any tax-intelligence branch (open PRs at audit: #214, #213, #212, #211, #134, #53, #52, #42 — none tax) | Verified (pulls API) |
| Tax kernel location | `lib/tax-intelligence/` (`canonical.ts`, `access.ts`, `reconciliation.ts`, `settlement-batches.ts` + co-located vitest tests); test include: `lib/tax-intelligence/**/*.test.ts`; scripts: `test = vitest run`, `typecheck = tsc --noEmit` | Verified (tree + package.json at HEAD) |
| CI | `.github/workflows/tax-intelligence-m26.yml` triggers on push to `feature/tax-intelligence-client-app-r1` only (plus PR paths / manual dispatch). **It will not auto-run for the M2.8.1 branch.** Test results for this package are therefore reported as **local runs** — no CI claim is made | Verified (workflow file at HEAD) |
| Repo deploy config | No `.vercel/project.json` anywhere in the tree at HEAD | Verified (recursive tree, 1,099 entries) |

## Vercel — Partially verifiable; mapping UNKNOWN

| Item | Finding | Evidence state |
|---|---|---|
| API identity | User `georgeoktem` (gokmen1313@gmail.com), `defaultTeamId: team_JzrJAUuKZ7Y31aU1d0VYdZTB`, token flagged **`limited: true`** | Verified (GET /v2/user) |
| Project list | `GET /v9/projects` returned **zero projects** both without and with the teamId parameter | Observed |
| Teams | `GET /v2/teams` → **403 Forbidden** with this token | Observed |
| Project ↔ repo ↔ branch mapping | **UNKNOWN.** The available token cannot enumerate projects, so no Vercel project, production alias, or branch-mapping claim is made. Nothing was guessed from the site's public behaviour | Unknown — recorded, not filled in |
| Deployment controls | No deployment was created, changed, or inspected beyond the API surface above. **No Vercel change is proposed in this phase** (handoff rule). Any future preview requires separate owner authorisation after test + security gates, plus a token/route that can actually verify the mapping first | Gate standing |

## Parallel-production check

- The M2.8.1 work adds **one isolated branch** and, within it, new files only (`docs/tax-intelligence/M281_*`, `lib/tax-intelligence/ecosystem.*`). It modifies no existing file on any branch, creates no second version of the kernel or the registry schema, and touches no deployment.
- Existing production (the artemis.agoraxai.com line from `main` and its established pipeline) is untouched; the tax-intelligence branches remain unmerged, consistent with the standing rule that merge/deploy are owner-only, separately-gated steps.

## Recommendations (recorded, not acted on)

1. When a preview is eventually wanted, first obtain a Vercel read path that can enumerate the team/projects (the current token cannot), verify the project↔repo mapping from that evidence, and only then propose preview settings.
2. Consider extending the CI workflow's branch list to the M2.8.1 branch in a **separate, owner-approved** change if CI-green evidence is desired for GPT-6 acceptance; until then, local test reporting stands as the honest record.

---
*Read-only audit. Unknowns are recorded as UNKNOWN; nothing in this document was inferred from naming, public pages, or prior summaries.*
