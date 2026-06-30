# Artemis Omni Public Launch Handoff

Date: 2026-06-30

Current status note: a later 2026-06-30 verification confirmed
`https://artemis.agoraxai.com` returns `HTTP/2 200` from Vercel. Treat the custom
domain warning in this file as historical state, and use
`docs/history/ARTEMIS_VERCEL_MILESTONE_2026-06-30.md` for the current domain and
standalone Labs milestone record.

This handoff captures the verified state for making Artemis Omni publicly available on Vercel and evolving the website into a public-safe article, infographic, and social publishing system.

## Verified Local State

- Local checkout: `/Users/theoppositeofturtle/Documents/artemis-for-codex/artemis-omni-codex-local`
- Canonical GitHub repository: `yazilimlar/artemis-omni`
- GitHub repository visibility: private
- Local branch: `main`
- Local `main` status at handoff: ahead of `origin/main` by one commit
- Local HEAD before this handoff doc: `a43c7be chore: ignore local Vercel environment files`
- Remote URL at handoff: `git@github.com:yazilimlar/artemis-omni.git`
- Vercel project: `gokmen1313-3041s-projects/artemis-omni`
- Vercel project ID: `prj_qHFkwHePIlDCuHEDIbKIv0Sk9RN5`
- Vercel org/team ID from local link: `team_JzrJAUuKZ7Y31aU1d0VYdZTB`
- Vercel framework preset: Next.js
- Vercel root directory: `.`
- Vercel Node.js version: `24.x`

## Verified Build State

The transcript and current local checks confirmed the core validation path:

```bash
npm run typecheck
npm run lint
npm run build
```

Observed production build result:

- Next.js version during build: `15.5.19`
- Static pages generated: `54/54`
- Build result: passed
- Route inventory included `/`, `/academy`, `/case-studies`, `/for/[slug]`, `/insights`, `/labs`, `/labs/artemisix19`, `/library`, `/library/programs`, `/products/*`, `/solutions/*`, `/tools`, `/robots.txt`, and `/sitemap.xml`.

## Vercel Link State

The attached terminal transcript confirmed:

```bash
vercel link
```

linked the local checkout to:

```text
gokmen1313-3041s-projects/artemis-omni
```

The local `.vercel/project.json` exists after linking but is ignored by `.gitignore` because `.vercel` is ignored.

The transcript also confirmed:

```bash
vercel git connect
```

replaced the previous Vercel Git connection from:

```text
yazilimlar/artemis-htmls-upto-260628
```

to:

```text
yazilimlar/artemis-omni
```

## Post-Handoff Deployment Update

After this handoff was recreated in the repo, `main` was pushed to the canonical GitHub repository over HTTPS and Vercel created a new production deployment:

```text
https://artemis-omni-gqnr2irbq-gokmen1313-3041s-projects.vercel.app
```

Deployment status:

```text
Ready
```

Vercel deployment ID:

```text
dpl_6yCHW7GQz7nXz331MtQCwYZpKxmF
```

The public working URL verified by curl is:

```text
https://artemis-omni.vercel.app
```

Smoke-tested public routes on `https://artemis-omni.vercel.app`:

- `/`
- `/labs/artemisix19`
- `/library/programs`
- `/insights`
- `/sitemap.xml`

All returned `200`.

The raw deployment URLs and branch/team Vercel aliases returned Vercel SSO redirects. Use the public project alias above unless deployment protection is intentionally disabled for those aliases.

Custom domain status:

- `agoraxai.com` is attached in Vercel but currently resolves to Squarespace.
- `artemis.agoraxai.com` is attached in Vercel but does not currently resolve in DNS.
- Vercel recommends adding `A agoraxai.com 76.76.21.21` for the apex domain.
- Vercel recommends adding `A artemis.agoraxai.com 76.76.21.21` for the subdomain.

Do not tell users the custom domain is live until DNS is corrected and curl/browser checks return `200` on the intended domain.

## GitHub Launch Gate

Two GitHub issues must be handled before relying on Git-based production deployment:

1. `git push` failed over SSH with:

```text
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

2. GitHub currently reports the repository default branch as:

```text
feature/artemisix19-autonomous-generator
```

while the current local launch branch is:

```text
main
```

Before production launch, choose one operating model:

- Make `main` the repository and Vercel production branch, then push `main`.
- Or explicitly keep the feature branch as production, then merge/cherry-pick launch changes there.

Do not assume a push to `main` will trigger the intended production deployment until the GitHub default branch and Vercel production branch are aligned.

## Secret And Environment Rules

- `.env.local` must stay private.
- `.env.local` is ignored.
- `.vercel/` is ignored.
- `node_modules/` is ignored.
- `.next/` is ignored.
- PEM/private key files are ignored by `*.pem`.
- Do not commit Vercel OIDC tokens, platform tokens, social API tokens, OAuth refresh tokens, raw protected HTML, private client data, private project files, private coordinates, or copied source artifacts.

Tracked `.env.local.example` may remain as a non-secret template only.

## Public Launch Sequence

Use a preview-first launch sequence.

1. Confirm branch policy.

```bash
gh repo view yazilimlar/artemis-omni --json defaultBranchRef,visibility,url
```

2. Fix Git push authentication.

Option A: configure SSH key access for GitHub.

Option B: use GitHub CLI credential management and HTTPS:

```bash
gh auth setup-git
git remote set-url origin https://github.com/yazilimlar/artemis-omni.git
git push origin main
```

3. Pull/confirm Vercel project settings.

```bash
vercel project inspect
vercel pull --yes
```

4. Deploy preview from a clean working tree.

```bash
vercel deploy --yes
```

5. Smoke-test preview.

Minimum checks:

```bash
curl -I <preview-url>
curl -I <preview-url>/labs/artemisix19
curl -I <preview-url>/library/programs
curl -I <preview-url>/insights
curl -I <preview-url>/sitemap.xml
```

Also run desktop and mobile browser checks for:

- Homepage
- Labs
- ArtemisIX19 generator
- Programs catalog
- Insights
- Academy
- Tools
- Audience pages
- Horizontal overflow
- Console errors

6. Promote or deploy production only after preview QA passes.

```bash
vercel deploy --prod --yes
```

or:

```bash
vercel promote <validated-preview-url>
```

7. Attach the public domain after production QA is clean.

## Publishing System Goal

Artemis should become a public-safe publishing system that generates and posts:

- Articles
- Infographics
- Social captions
- LinkedIn post drafts
- Instagram carousel/reel captions
- Facebook post drafts
- YouTube short scripts
- YouTube long-form outlines
- Newsletter-ready summaries
- Subscriber-library packages

The first implementation should generate approved content packages for the website and export social-ready drafts. Direct auto-posting should come later after official account/API authorization and review.

## Recommended Content Package Schema

Start with static TypeScript data and MDX before adding a database.

Core content package fields:

```ts
type ArtemisPublicationPackage = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "needs_review" | "approved" | "published" | "archived";
  visibility: "public" | "subscriber" | "private_reference";
  audience:
    | "ceos"
    | "project-managers"
    | "superintendents"
    | "mechanical-engineers"
    | "engineers"
    | "students"
    | "contractors"
    | "operations"
    | "general";
  category:
    | "ai-implementation"
    | "construction-intelligence"
    | "mechanical-systems"
    | "software-reviews"
    | "field-operations"
    | "3d-visualization"
    | "archaeology-technology"
    | "business-systems";
  sourceFamily: string[];
  publicSafetyNotes: string[];
  article: {
    summary: string;
    outline: string[];
    mdxPath?: string;
  };
  infographic: {
    format: "og-image" | "carousel" | "diagram" | "render-brief";
    promptOrSpec: string;
    altText: string;
  };
  social: {
    linkedIn: string;
    instagram: string;
    facebook: string;
    youtubeShortScript: string;
    youtubeLongOutline?: string[];
  };
  review: {
    reviewer?: string;
    reviewedAt?: string;
    caveats: string[];
  };
};
```

## Later Database / CMS Tables

When Artemis is ready for persistence, use tables or CMS collections shaped around review and provenance:

- `content_sources`
- `publication_packages`
- `article_drafts`
- `infographic_assets`
- `social_post_drafts`
- `review_events`
- `distribution_targets`
- `publish_events`
- `subscriber_assets`

Important fields:

- `visibility`
- `status`
- `audience`
- `category`
- `source_family`
- `generated_by`
- `reviewed_by`
- `approved_at`
- `published_at`
- `platform`
- `external_post_id`
- `public_safety_notes`

Do not introduce a production database until the static package workflow is working and the publication review rules are stable.

## Social Posting Architecture

Phase 1: Generate packages on the website.

- Public article draft
- Infographic spec or generated OG image
- Copy-ready LinkedIn, Instagram, Facebook, and YouTube drafts
- Review checklist

Phase 2: Publish to Artemis website.

- Approved articles become MDX under `/insights` or `/academy`.
- Infographics are generated as safe static assets or route-based OG images.
- Subscriber-only packages remain metadata-only until auth/subscription is approved.

Phase 3: Manual social queue.

- Export captions and scripts for manual posting.
- Keep every post human-reviewed.
- Include source/date notes for current events or software comparisons.

Phase 4: Official API posting.

Only after app/account setup:

- LinkedIn Posts API
- Meta Graph API for Facebook Pages
- Instagram Content Publishing API
- YouTube Data API

All platform tokens must live in Vercel environment variables or a secure secret store, never in the repo.

## Daily Editorial Lanes

- Monday: Mechanical systems, drones, jet planes, automation, manufacturing
- Tuesday: CEO software reviews, business systems, TurboTax/QuickBooks-style comparisons
- Wednesday: Superintendents, fast delivery, procurement, shipping, field operations
- Thursday: PMs, AI advancements, project controls, implementation updates
- Friday: 3D renders, architectural design, visual systems
- Saturday: Archaeology and cutting-edge technology
- Sunday: Artemis weekly recap, free asset, subscriber teaser, training preview

Every topic that depends on current facts must be source-checked and dated before publication.

## Immediate Next Build Recommendation

Build `Artemis Publishing Studio` as a static/client-safe website feature first:

- `data/artemisPublishing.ts`
- `/insights/daily`
- `/library/apps`
- `/training`
- `/membership`

The first release should not add auth, payments, external APIs, database requirements, or social tokens. It should generate and display public-safe packages that humans can approve and publish.

## Open Risks

- GitHub default branch does not match local launch branch.
- SSH push failed; Git push path needs authentication repair.
- Vercel Git connection was corrected in the transcript, but production branch policy still needs dashboard confirmation.
- Direct social posting requires platform app setup, permissions, OAuth, and policy review.
- Public content generation must not expose protected HTML, private artifacts, raw source data, private coordinates, or secret values.
