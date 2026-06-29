# Artemis — Test Deployment Status

> **Status: BLOCKED at authentication** (not a code problem). The app is verified and
> deploy-ready locally, but no GitHub or Vercel credentials are available on this machine to
> push or deploy autonomously. One credential from the owner unblocks a live URL in minutes.

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
