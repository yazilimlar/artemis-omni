# ADR-012 - User Profiles, Roles, and the Dashboard

- **Status:** Accepted
- **Date:** 2026-10-01
- **Amends:** ADR-011 (non-goal "create database tables, store user data beyond Supabase
  Auth's own records")
- **Extends:** ADR-004, ADR-006

## Context

ADR-011 gated `/control` and `/system-map` with Supabase Auth magic link and a
server-side email allowlist. It explicitly excluded database tables and stored user data.

Milestone M4 adds the first personalized surface, `/dashboard`. Its content depends on the
signed-in user's role, which needs a per-user profile stored in the Supabase project.
`ENGINEERING/AI_AGENT_RULES.md` requires an ADR for any database or auth change, and
ADR-INDEX requires a new ADR before an implementation that contradicts an accepted one.

## Decision

### Profiles table

- `public.user_profiles` holds one row per Supabase Auth user:
  - `id` (references `auth.users`, cascade delete)
  - `email`
  - `role`
  - `display_name`
  - `created_at`, `updated_at`
- The migration lives in `supabase/migrations/` and is the source of truth. The owner
  applies it (SQL editor or `supabase db push`). AI tools do not hold database credentials
  (ADR-004).
- A `security definer` trigger on `auth.users` creates the profile row with role `viewer`.
  It runs with an empty `search_path` and fully qualified names. The migration also
  backfills rows for users that already exist.

### Roles

- Roles: `owner`, `admin`, `client`, `viewer`. New users default to `viewer`.
- **Only the owner assigns roles**, through the Supabase SQL editor or the service role.
  The application never writes `role`.

### Row-level security

- RLS is enabled.
- Authenticated users can read only their own row.
- Authenticated users can update only their own row, and only the `display_name` column.
  This is enforced with column privileges, because RLS policies cannot restrict columns.
  `role`, `email` and `id` are not user-writable, which prevents self-promotion to `owner`.
- `anon` has no access.
- The service-role key is still not used by the application (ADR-011).

### Access model

- Roles add to the ADR-011 allowlist; they do not replace it. Every authenticated route,
  including `/dashboard`, still requires an allowlisted email.
- `/dashboard` is `authenticated` and `noindex`. Its content:
  - `owner` and `admin` see every registered product;
  - `client`, `viewer` and missing profiles see only products whose visibility is
    `public` or `public_safe_demo`.
- A missing profile renders a neutral "not yet provisioned" state. It is never an error and
  never grants extra access.

### Data held

- Stored: email (mirrors the auth record), an optional display name, and the role.
- No other personal data is stored. Client-specific data stays out of this table; client
  work follows ADR-008.

## Consequences

- The application now depends on a database migration the owner must apply manually.
  Until it is applied, `/dashboard` shows the fallback state for every user.
- `/dashboard` joins the session-refresh middleware matcher.
- Role checks run in server code on the user's own RLS-scoped row. A user who tampers with
  their client cannot change what the server reads.
- Future features that use roles must cite this ADR. Using roles to grant access to
  client data needs its own ADR under ADR-008.

## Non-goals

This ADR does not:

- change `/control` or `/system-map` access (they stay allowlist-only);
- add role management UI;
- remove the allowlist;
- store client or project data;
- add new environment variables or dependencies.
