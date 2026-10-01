# ARTEMIS SOURCE OF TRUTH

Last updated: 2026-10-01
Owner: George (yazilimlar)
Status: ACTIVE — this file overrides all AI conversations and memory.

## Rule
No AI, chat, memory, or suggestion overrides this file.
Updates require: (1) an explicit decision, (2) a decision-log entry, (3) a commit.

## 1. Parent system
AgoraXAI (agoraxai.com, Squarespace DNS)

## 2. Artemis role
Engineering / construction / software / media / AI adoption agora.
Artemis is a department of AgoraXAI, not a competitor to it.

## 3. Canonical repo
- Local path: ~/Projects/artemis-omni
- Remote: git@github.com:yazilimlar/artemis-omni.git
- Branch: main
- This is the ONLY canonical Artemis repo.
- Desktop copies, Documents copies, worktrees, and Codex clones are NOT canonical.

## 4. Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MDX
- Vitest
- Deployed to Vercel (public site)
- Prime ERP backend on Render (services/prime-erp)

## 5. Public domain
artemis.agoraxai.com

## 6. Hosting map
| Layer | Tool | Purpose |
|---|---|---|
| DNS | Squarespace | Owns agoraxai.com and subdomains |
| Public site | Vercel | artemis.agoraxai.com |
| Source control | GitHub | yazilimlar/artemis-omni |
| Private backend | Render | services/prime-erp |
| Private tools | Render / Oracle / Tailscale | TBD per service |
| Registry | Repo file | data/artemis-registry.json |

## 7. Canonical public routes (v0.1)
- /
- /departments
- /labs
- /control
- /system-map

Notes:
- /departments and /labs already exist and are canonical.
- /control and /system-map do not exist yet and must be created in v0.1.
- All other existing routes are provisional. They will be classified as:
  canonical, restore, archive, private, or discard-candidate.
- No route is deleted without a decision-log entry.

## 8. Client and brand work living inside this repo
These are real deliverables and must be tracked as artifacts, not lost:

| Name | Where | Status |
|---|---|---|
| Anastasia | app/apps, demo/* branches | active demo |
| Pınar Evleri | app/pinarevleri, feat/pinar-* branches | active client |
| Dayos | public/dayos*, feature/dayos-* branches | active product |
| Rainbow Botanics | app/rainbowbotanics*, components/rainbow | active brand |
| CivicBid | lib/civicbid, public/civicbid | TBD |
| AtlasIQ | docs/atlasiq, schemas/atlasiq | TBD |
| Prime ERP | services/prime-erp, app/erp, app/labs/prime-erp | active |
| Verity | docs/verity | TBD |
| GEOMETRIC Workbench | artemis-workbench/, workbench-foundation/, archive/workbench/ | duplicated — needs classification |

## 9. Registry
- File: data/artemis-registry.json
- Required fields per artifact:
  id, slug, title, type, status, visibility, owner,
  source, current_path, public_route, deployment, version,
  risk, next_action, created_at, updated_at, tags
- Statuses: canonical, restore, archive, duplicate, discard-candidate, private

## 10. Source of truth order
1. This file
2. data/artemis-registry.json
3. Repo files on main branch
4. Deployment config (vercel.json, render.yaml, .github/workflows)
5. Terminal output
6. AI memory and conversation

## 11. AI collaboration
- Claude Code: coordinator and executor (local repo work)
- ChatGPT/GPT: strategic review and implementation backup
- Claude (web): architecture critique only
- Gemini: strategy challenge
- CodeRabbit: PR review
- Rule: one AI writes at a time. Others review.

## 12. Experience layer (3D / immersive)
- 3D is an experience layer, not a site-wide rewrite.
- Public brand site stays fast and 2D-first.
- 3D lives in: /labs/*, /departments/* showcases, and specific hero sections.
- Rendering stack: React Three Fiber (R3F) + drei — to be confirmed in decision log.
- 3D assets live in public/models/, public/textures/.
- Every 3D route must have a 2D fallback.
- Every 3D route must declare its asset budget in the registry.
- A "scene registry" (data/artemis-scenes.json) will mirror the artifact registry.
- No 3D work starts until Phase 2. Phase 1 is inventory only.

## 13. Current phase
Phase 1 — Inventory and Registry.
No homepage redesign. No new departments. No new client features. No 3D yet.

## 14. Phase 1 tasks (in order)
1. Classify all 70 app/ route directories into registry statuses.
2. Classify all client/brand work into registry entries.
3. Resolve the 4 duplicate workbench locations.
4. Create data/artemis-registry.json v0.1.
5. Create /control route and /system-map route.
6. Build registry-powered page for /labs.
7. Deploy preview to Vercel.

## 15. Phase 2 (later)
- Confirm 3D rendering stack.
- Create data/artemis-scenes.json.
- Build one immersive scene in /labs as proof of concept.
- Define performance budget and mobile fallback policy.

## 16. Do not
- Do not publish secrets, .env files, tokens, or client data.
- Do not delete branches without a decision-log entry.
- Do not rename routes without updating this file.
- Do not let AI memory override this file.
- Do not start Claude Code without reading CLAUDE.md.
- Do not rebuild the site from scratch.
- Do not add 3D libraries in Phase 1.

## 17. Change log
| Date | Change | By |
|---|---|---|
| 2026-10-01 | Initial source of truth created | George + ChatGPT |