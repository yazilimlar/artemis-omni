# ADR-011 - Authentication for Internal Registry Routes

- **Status:** Accepted
- **Date:** 2026-10-01
- **Amends:** ADR-004 (for the routes named here only)
- **Extends:** ADR-006

## Context

PR #71 (M2) added `/control`, a read-only registry dashboard, and `/system-map`, a
division → product → route map. Both read `ENGINEERING/PRODUCT_REGISTRY.yaml` and
`ENGINEERING/DIVISION_REGISTRY.yaml`. `/control` shows internal planning language such as
`next_gate` ids and blocker counts. Both routes are `noindex, nofollow`, but anyone who
knows the URL can open them. M2 recorded authentication as milestone M3.

ADR-004 states that Phase 1 ships no backend, auth or database, and that enabling Supabase
needs deliberate environment setup. `ENGINEERING/AI_AGENT_RULES.md` requires an ADR before
any auth, database or secrets change. The owner has provisioned a Supabase project and set
its environment variables locally and in Vercel. The owner chose email magic-link sign-in
with an allowlist.

## Decision

`/control` and `/system-map` are moved to the `internal_operations` visibility class and
gated by Supabase Auth.

### Sign-in

- Supabase Auth email magic link (OTP).
- `signInWithOtp` is called with `shouldCreateUser: false`, so signing in never creates an
  account. The owner invites users from the Supabase dashboard.
- Access also requires the signed-in email to appear on a server-side allowlist. Holding a
  Supabase account alone is not enough.

### Enforcement

- The gate is enforced **server-side** in the protected routes, through a shared layout or
  equivalent server check. Unauthorized requests are redirected to sign-in before any
  registry data is read or rendered.
- `middleware.ts` refreshes the session cookie only. It is not the only access check.
- The routes **fail closed**: if Supabase configuration or the allowlist is missing or
  invalid, they do not render registry data.
- The existing `noindex, nofollow` metadata stays as defense in depth.

### Libraries and configuration

- Dependencies, added in the implementation PR: `@supabase/ssr` and `@supabase/supabase-js`.
- Environment variable names, values per ADR-004 (never in source or chat):

| Variable | Exposure | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser-safe | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser-safe | public anon (or publishable) key |
| `ARTEMIS_INTERNAL_ALLOWLIST` | **server-only** | comma-separated allowed emails; kept out of source so personal addresses are not committed |

- `SUPABASE_SERVICE_ROLE_KEY` is **not used** by this feature and must not be added for it.
- The owner manages the Supabase dashboard: email provider, user invitations, Site URL,
  and redirect URLs for the production domain and Vercel preview deployments. AI tools do
  not own these accounts (ADR-004).

## Consequences

- `/control` and `/system-map` become dynamic, per-request routes instead of static ones.
- Preview deployments need their redirect URLs allowed in Supabase, or sign-in fails there.
- ADR-004's "no auth" statement no longer holds for these two routes. Every other ADR-004
  rule still applies, and every other route stays unauthenticated.
- Future authenticated surfaces can reuse the same gate, but each needs its own registry
  visibility change and review.

## Non-goals

This ADR does not:

- add authentication to any public, Labs or product route;
- create database tables, store user data beyond Supabase Auth's own records, or enable
  other Supabase features;
- use the service-role key;
- implement anything. The implementation is a separate feature PR.

## Implementation sequence

1. Merge this ADR.
2. Feature PR (`feature/*`):
   - add dependencies;
   - add Supabase server/browser clients and the session-refresh middleware;
   - add a sign-in page and auth callback;
   - add the server-side gate and allowlist check;
   - add tests for the allowlist and fail-closed behavior;
   - add the variable names to `.env.local.example` as placeholders.
3. Owner: add `ARTEMIS_INTERNAL_ALLOWLIST` locally and in Vercel, configure redirect URLs,
   and invite users.
4. Verify on a Vercel preview:
   - signed out → redirected;
   - signed in but not allowlisted → denied;
   - allowlisted → renders.
