# ADR-004 — Security & Secrets

- **Status:** Accepted
- **Date:** 2026-06-28

## Context

The project integrates (now or later) with Vercel, Squarespace/DNS, Supabase, email, and
AI providers. AI tools participate in development. We must prevent secret leakage and keep
account control with humans.

## Decision

- **No secrets in source.** All configuration comes from `process.env.*`. The repo ships
  `.env.local.example` with **placeholder names only**.
- `.env`, `.env.local`, and `.env.*.local` are **git-ignored** and never committed.
- **Only** browser-safe values use the `NEXT_PUBLIC_` prefix. Server-only secrets
  (service-role keys, AI keys, email keys) never use it.
- Secret storage by context: local → `.env.local`; Vercel → Environment Variables;
  Supabase → its dashboard; Squarespace/DNS → owner-managed manually.
- **AI tools do not own accounts or hold credentials.** They operate via local edits +
  GitHub commits; deployment and DNS are human-gated. No secrets are pasted into chats.
- Phase 1 ships **no backend/auth/db**; the pilot form does not transmit data.

Full rules: `docs/SecurityRules.md`. Workflow guardrails: `docs/AIWorkflow.md`.

## Consequences

- ✅ Low leakage risk; clean separation of public vs server config.
- ✅ Humans retain control of accounts and deploys.
- ⚠️ Enabling features later (contact backend, Supabase) requires deliberate env setup in
  each environment.

## Alternatives considered

- **Commit a real `.env` for convenience** — rejected outright (security).
- **Let an AI tool manage the Vercel/Squarespace accounts** — rejected: violates the
  human-in-control guardrail.
