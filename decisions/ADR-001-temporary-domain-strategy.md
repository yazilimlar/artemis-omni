# ADR-001 — Temporary Domain Strategy

- **Status:** Accepted
- **Date:** 2026-06-28

## Context

Artemis needs a public home before the independent Artemis domain is purchased.
`agoraxai.com` already exists on Squarespace. We want to validate the product without
disrupting the existing site and without rebuilding inside Squarespace.

## Decision

- Keep `agoraxai.com` on **Squarespace** as the existing shell.
- Build Artemis as a **separate Next.js app** (this repo), deployed to **Vercel**.
- Expose the test app at **`artemis.agoraxai.com`** via a CNAME from Squarespace DNS to
  Vercel.
- Optionally add a lightweight `agoraxai.com/artemis` teaser page in Squarespace.
- When `ArtemisOmni.com` is purchased, attach it to the **same** Vercel project — no
  code migration.

DNS/Squarespace changes are performed **manually by the owner**; no credentials are
shared with any AI tool. Full steps in `docs/DeploymentPlan.md`.

## Consequences

- ✅ Zero disruption to the existing Squarespace site.
- ✅ Full power of Next.js/Vercel for the app; clean separation of concerns.
- ✅ Painless final-domain switch (add a domain, update `NEXT_PUBLIC_SITE_URL`).
- ⚠️ Two surfaces to keep coherent during the test phase (shell vs app).
- ⚠️ DNS propagation/SSL has a short lead time on first setup.

## Alternatives considered

- **Build inside Squarespace** — rejected: can't deliver the cinematic, MDX, and tooling
  requirements; poor maintainability.
- **Buy the domain now** — deferred: validate first, avoid premature commitment.
