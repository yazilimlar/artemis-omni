# M2.8.2 Topology Audit R01 — GitHub / Vercel Mapping (Read-Only)

| Field | Value |
|---|---|
| Date | 2026-10-26 |
| Method | GitHub API (repo, branches, trees) + Vercel via the official MCP connector (`list_teams`, `list_projects`, `get_project`, `list_deployments`). No setting was changed; no deployment was triggered by this audit |
| Supersedes | The M2.8.1 topology audit's Vercel UNKNOWN (which was a limitation of a scope-limited REST token, **not** an absence of deployments — corrected here on better evidence) |

## 1. Verified mapping

- **Team:** `team_JzrJAUuKZ7Y31aU1d0VYdZTB` — "gokmen1313-3041's projects" (slug `gokmen1313-3041s-projects`).
- **Project:** `artemis-omni` — `prj_qHFkwHePIlDCuHEDIbKIv0Sk9RN5`, framework `nextjs`, Node `24.x`.
- **Domains on the project:** `artemis.agoraxai.com`, `artemis-omni.vercel.app`, plus the `main`-branch domain. Production is served from `main`; **nothing in the M2.8.x work touches `main`**.
- **Git linkage — VERIFIED by deployment metadata:** deployments carry `githubRepo: artemis-omni`, `githubCommitRef` (branch) and `githubCommitSha`. Every push to the tax-intelligence branches produced a READY preview deployment, including:
  - `feature/tax-intelligence-m281-apolloa-formation-r1` @ `1b241309` → READY; @ `2f0fd30a` → READY; @ `05aa3755` → READY (deployment `dpl_DwsBwLzQPN1BDRyVc6oqALtPoa1e`).
  - `feature/tax-intelligence-m28-documentation-foundation-r1` @ `63864c86`, `c8c83a37`, `a459fbdd` → READY.
- **Consequence for M2.8.2:** pushing the child branch `feature/tax-intelligence-m282-ecosystem-console-r1` will, by the project's established configuration, produce a branch preview deployment automatically. That is the pipeline's behaviour, not a deployment action taken by this milestone. A preview URL is reported only after the deployment is observed READY and the console route is fetched and verified.

## 2. Protection state (material for the preview proposal)

- Project `ssoProtection`: **disabled**. `passwordProtection`: **disabled**. `trustedIps`: **disabled**.
- Therefore branch preview URLs are currently reachable by anyone holding the URL. The console itself is fail-closed at the app layer (signed-in profile required; otherwise it renders an access shell with no manifest data), and its data is synthetic — but the M2.8.3 proposal recommends enabling Vercel Deployment Protection (SSO) on preview deployments before any wider sharing. Enabling it is an owner action; this milestone changes no project setting.

## 3. Console placement (no competing application)

- The console lives **inside the canonical app**: route `app/apps/ecosystem-console/`, components `components/ecosystem/`, data `lib/tax-intelligence/ecosystem-console-manifest.ts`. It reuses the existing design system (`components/ui` Card/Badge, Tailwind theme tokens, the sibling tax page's auth + metadata pattern). No new Vercel project, no new subdomain, no parallel app.

## 4. Finding — legacy client page carries unreconciled ownership text

- `app/apps/tax-intelligence/page.tsx` (client-app MVP, predating M2.8) hard-codes ownership strings (e.g. percentage interests for several ventures) that the M2.8/M2.8.1 record does **not** support: the verified record keeps ownership in the U-register as UNKNOWN and forbids inferring it. The M2.8.2 console deliberately does **not** reuse that data. Reconciling or retiring that page is a separate owner/GPT-6 decision — flagged here, not changed by this milestone (existing work preserved).

## 5. What remains UNKNOWN

- Whether Vercel's production branch setting differs from the observed `main` domain behaviour (the MCP project read does not expose the production-branch field; observed deployments for `main` would confirm — not needed for a branch preview).
- Nothing else material: repo, branch, project, team, domains and per-branch preview behaviour are now Verified.

---
*Read-only audit. No deployment, setting, or production change was made.*
