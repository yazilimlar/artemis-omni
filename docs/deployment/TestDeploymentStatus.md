# Artemis — Test Deployment Status

> **Status: ✅ LIVE (test) — 2026-06-29.** Deployed to Vercel via a provided Vercel token.
> **Live URL: https://artemis-omni.vercel.app** (publicly accessible). Custom subdomain
> `artemis.agoraxai.com` is attached + ownership-verified, pending one owner DNS record.
> (History of the earlier auth-blocked state is retained below for the record.)

## ✅ Live deployment (2026-06-29)

| Field | Value |
| --- | --- |
| Live URL | **https://artemis-omni.vercel.app** |
| Vercel project | `artemis-omni` (`prj_qHFkwHePIlDCuHEDIbKIv0Sk9RN5`) |
| Team | `gokmen1313-3041s-projects` (`team_JzrJAUuKZ7Y31aU1d0VYdZTB`) |
| Deployment ID | `dpl_C8csPdZqNu8W7c4J7Eg4fW8J3tdC` |
| Target | production · readyState READY · build 42s |
| Commit deployed | `5343b6b` (local; not yet on a git remote) |
| Public access | Yes — all routes HTTP 200, not behind deployment protection |
| Env vars | None required (app default `NEXT_PUBLIC_SITE_URL=https://artemis.agoraxai.com`) |

**Live QA (all HTTP 200):** `/`, `/solutions`, `/products`, `/labs`,
`/labs/construction-intelligence-workbench`, `/demo`, `/portfolio`, `/contact`,
`/robots.txt`, `/sitemap.xml`. Workbench renders disclaimer + Project Alpha + KPIs +
forecast SVG + risk matrix + change register + pilot CTA; **0** sensitive identifiers.

### Custom test subdomain — owner DNS action required
`artemis.agoraxai.com` is attached to the project and ownership-verified. `agoraxai.com`
uses **Google nameservers** (`ns-cloud-*.googledomains.com`) — add this record where that
domain's DNS is managed (Google Cloud DNS / Google Domains):

```
Type: CNAME
Name/Host: artemis
Value: 1f6c6cecc5e2c917.vercel-dns-017.com.
```
Alternatives: `CNAME artemis → cname.vercel-dns.com`, or `A artemis → 76.76.21.21`.
Vercel auto-issues SSL once the record resolves. Until then, use the `*.vercel.app` URL.

### Secret handling
The provided Vercel token was used **only** in the shell environment for the deploy and was
**not** written to any file, commit, `.env`, or remote. Rotate it in Vercel when convenient.

---

## (Historical) Status: BLOCKED at authentication — before the token was provided

> The app was verified and deploy-ready locally, but no GitHub or Vercel credentials were
> available to push or deploy autonomously. Resolved 2026-06-29 by a provided Vercel token.

## Snapshot

| Field | Value |
| --- | --- |
| Date/time | 2026-06-28 (test deployment attempt) |
| Branch | `main` |
| Commit | `ed3d019` (accepted baseline) |
| Working tree | clean |
| Build | ✅ `next build` — 31 static pages |
| Typecheck | ✅ clean |
| Lint | ✅ (only `no-page-custom-font` warning, intentional) |
| Secret scan | ✅ no secrets in tracked files |
| Synthetic workbench | ✅ `/labs/construction-intelligence-workbench` — 0 sensitive identifiers |
| GitHub repo | ❌ not created (no auth) |
| Git remote | ❌ none configured |
| Vercel project | ❌ not created (CLI installed, not logged in) |
| Live URL | ❌ none yet |

## What blocks the live deployment

Probed on this machine:

- **GitHub CLI (`gh`)**: not installed; no Homebrew to install it.
- **SSH key**: none present; `ssh -T git@github.com` → `Permission denied (publickey)`.
- **Tokens**: `GH_TOKEN`, `GITHUB_TOKEN`, `VERCEL_TOKEN` all unset.
- **git credential.helper**: `osxkeychain` (may hold HTTPS creds, not used — tokens are not extracted).
- **Vercel CLI**: ✅ installed during this pass (`vercel` v54.18.2), but **not logged in**
  (no `~/.../com.vercel.cli/auth.json`).
- **Network / GitHub API**: reachable (HTTP 200).

There is **no anonymous deploy target** — Vercel (and equivalents) require authentication.
Without a token or an interactive login, a live URL cannot be produced autonomously.

## Fastest unblock (recommended) — Vercel token, no GitHub required

Vercel can deploy this local repo directly (no GitHub needed):

1. Owner: Vercel → **Account Settings → Tokens → Create** a scoped token (test/preview).
2. Provide it as `VERCEL_TOKEN` (stored only in the shell env / Vercel, never written to source).
3. Then (one command set):
   ```bash
   cd artemis-omni
   vercel deploy --prod --yes --token "$VERCEL_TOKEN"   # uploads local source, returns a *.vercel.app URL
   vercel domains add artemis.agoraxai.com --token "$VERCEL_TOKEN"   # or test.agoraxai.com / agorax.ai
   ```
   Vercel then prints the exact CNAME to add in the agoraxai DNS (typically
   `CNAME artemis → cname.vercel-dns.com`). DNS is owner-managed.

## Alternative unblock — GitHub path

1. Owner installs + logs in `gh` (`brew install gh && gh auth login`) **or** provides a GitHub PAT.
2. Then:
   ```bash
   gh repo create yazilimlar/artemis-omni --private --source=. --remote=origin
   git push -u origin main
   ```
3. Import the private repo into Vercel (dashboard) → framework Next.js → root dir `artemis-omni` → deploy.

## Environment variables (names only — values live in Vercel, never in source)

The app reads only:

- `NEXT_PUBLIC_SITE_URL` — optional; canonical URL (e.g. the chosen test domain). App falls
  back to a default if unset, so it is **not required** for a first preview deploy.

No other env vars are required for the current synthetic/test build (no backend, Supabase,
auth, analytics, or external API integrations are wired). Placeholder-disabled mode is the
default. Any future test keys go in Vercel env (Preview/Test scope) only.

## Routes ready for QA (verified to build; QA pending a live URL)

`/` · `/solutions` · `/products` · `/labs` · `/labs/construction-intelligence-workbench` ·
`/demo` · `/portfolio` · `/contact` · `/robots.txt` · `/sitemap.xml`

## Known issues / notes

- The exposed API key previously mentioned was treated as compromised: **not** written to any
  file, commit, env, or remote. Rotate/revoke it in its provider dashboard.
- The repo tracks ~17 MB of brand reference imagery under `docs/brand/reference/` (some
  flagged not-for-public-release) → the GitHub repo **must be private**.

## Next steps

1. Owner provides a Vercel token (fastest) or a GitHub auth path.
2. Re-run the unblock commands above → obtain `*.vercel.app` URL → attach test subdomain.
3. Run live QA (Milestone 6) and update this file with the URLs and results.

---

## Update — 2026-06-29 (Vercel MCP available; auth still required to upload)

A **Vercel MCP integration is connected and authenticated** (team
`gokmen1313-3041's projects`, `team_JzrJAUuKZ7Y31aU1d0VYdZTB`). However, the MCP tools are
**read/advisory** — `deploy_to_vercel` only returns guidance ("run `vercel deploy`" / "push
to git"); there is no MCP tool that uploads local build artifacts. So a live deploy still
needs one of: a **Vercel CLI token**, an interactive `vercel login`, or a GitHub repo wired
to Vercel's git integration.

Findings:
- Existing Vercel project `project-kmdyz` (`prj_wGLpsmxXO3AHSnTx3XlTwrAq8bmm`) is **empty**
  (no framework, no deployments, no domains, not live).
- **GitHub App device flow is DISABLED** for the provided app
  (`device_flow_disabled`) — Client ID `Iv23liSZ3gsaq51Ox8fu`, App ID `4171060`. A Client ID
  alone (no secret/private key) cannot push without device flow enabled.
- Domain `agorax.ai` is **not available for purchase** → fallback domains #3/#4 are out.
  Viable test hosts: **`artemis.agoraxai.com`** or **`test.agoraxai.com`** (CNAME on the
  owner's Squarespace DNS), or the Vercel preview URL.

### One-action unblocks (pick one)
- **A — Vercel token (fastest, no GitHub):** Vercel → Account Settings → Tokens → Create →
  share it. Then: `cd artemis-omni && vercel deploy --prod --yes --token "$T" --name artemis-omni`
  → live `*.vercel.app` URL; then `vercel domains add artemis.agoraxai.com --token "$T"`.
- **B — Enable Device Flow** on the GitHub App (App settings → "Enable Device Flow" → Save),
  then I re-run device auth → create private repo → push → connect Vercel.
- **C — GitHub PAT or the App's private key (.pem)** → create repo + push → import to Vercel.
