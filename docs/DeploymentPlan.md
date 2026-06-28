# Artemis Omni — Deployment Plan

Temporary strategy: test Artemis under the existing **aGOraXai** ecosystem before
buying/connecting the independent Artemis domain.

## Principles

1. **Keep `agoraxai.com` on Squarespace.** Squarespace remains the existing domain/site
   shell only. Do **not** build the Artemis app inside Squarespace code blocks.
2. **Build Artemis as a separate Next.js app** (this repo).
3. **Deploy the app to Vercel.**
4. **Add `artemis.agoraxai.com` as a Vercel domain.**
5. **In Squarespace DNS, add the CNAME record Vercel provides.**
6. Optionally create `agoraxai.com/artemis` as a Squarespace teaser/doorway page.
7. Later, connect `ArtemisOmni.com` to the **same** Vercel project.
8. **Do not migrate or duplicate the codebase** when the final domain is purchased — just
   add the new domain to the same project.

> ⚠️ Never expose or request Squarespace login, API keys, passwords, tokens, or DNS
> credentials. DNS changes are performed **manually by the site owner** using the steps
> below.

## Step 1 — Push to GitHub

GitHub is the source of truth. Create a repo and push the `artemis-omni/` app.

```bash
cd artemis-omni
git init
git add .
git commit -m "Artemis Omni website prototype — phase 1"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2 — Import into Vercel

1. In Vercel, **Add New → Project** and import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Root directory: `artemis-omni`
   (set this if the repo root contains other projects).
3. Build command `next build` and output are auto-configured.
4. **Environment variables** (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL=https://artemis.agoraxai.com`
   - Add others later from `.env.local.example` as features are enabled.
5. Deploy. You'll get a `*.vercel.app` preview URL — verify it works.

## Step 3 — Add the subdomain in Vercel

1. Project → **Settings → Domains → Add** → `artemis.agoraxai.com`.
2. Vercel shows the DNS record to create. For a subdomain this is a **CNAME**:
   - **Type:** CNAME
   - **Host/Name:** `artemis`
   - **Value/Target:** `cname.vercel-dns.com` (use the exact value Vercel shows)

## Step 4 — Owner adds the CNAME in Squarespace DNS (manual)

> Performed by the site owner — no credentials are shared with any AI tool.

1. Squarespace → **Settings → Domains** → select `agoraxai.com`.
2. Open **DNS Settings** (Advanced / Custom Records).
3. **Add Record** with the values Vercel provided:
   - Type: `CNAME` · Host: `artemis` · Data/Target: `cname.vercel-dns.com`
4. Save. Propagation can take minutes to a few hours.
5. Back in Vercel, the domain shows **Valid Configuration** once DNS resolves. Vercel
   issues the SSL certificate automatically.

## Step 5 — (Optional) Squarespace teaser page

Create `agoraxai.com/artemis` as a simple Squarespace page that links to
`https://artemis.agoraxai.com`. Keep it lightweight — it is only a doorway.

## Step 6 — Later: the independent domain

When `ArtemisOmni.com` is purchased, add it as another domain on the **same** Vercel
project and update `NEXT_PUBLIC_SITE_URL`. No code migration.

## Verifying a deploy

- Preview URL renders the homepage hero and all routes.
- `/_next` assets load; no console errors.
- `https://<domain>/sitemap.xml` and `/robots.txt` resolve.
- Lighthouse: good performance on mobile (cinematic layer is lazy-loaded).
