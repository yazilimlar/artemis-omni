# ADR-014 - Sandboxed Artifact Execution

- **Status:** Accepted
- **Date:** 2026-10-01
- **Extends:** ADR-004, ADR-006, ADR-011, ADR-012, ADR-013

## Context

Artemis already serves standalone HTML labs. They live under `public/standalone/` and
`public/labs/`, and pages such as `/labs/tax-architecture-2026`, `/labs/turkiye-atlas`
and `/labs/troy-time-atlas` embed them in iframes. `ENGINEERING/PROJECT_GENOME.yaml`
allows "isolated standalone HTML labs when approved", but no ADR defines what "isolated"
means, and these labs are not registered or audited as executable artifacts.

Facts verified 2026-10-01 that shape this decision:

- **No existing iframe under `app/` sets a `sandbox` attribute.** The standalone labs run
  same-origin with the Artemis site.
- **Supabase session cookies are readable by JavaScript.** `@supabase/ssr` sets them with
  `httpOnly: false` by default, which its browser client requires. Since ADR-011, any
  script running on the Artemis origin can read a signed-in user's session.
- **Next.js serves every file under `public/` directly at its path.** No route handler
  runs, so no per-request headers can be enforced there.

Milestone M6 introduces a safe, registered and audited execution surface for HTML/JS
artifacts.

## Decision

Artemis may host sandboxed HTML/JS artifacts for demonstration and controlled execution.
**Every artifact is registered, execution is isolated from the Artemis origin, and every
session is audited.**

### Threat model

An artifact is treated as untrusted code, even though it was reviewed when registered.
It must not be able to:

- access the parent origin, its cookies, `localStorage`, `IndexedDB` or the parent
  session, or call Supabase or the Artemis API as the user;
- reach the network, unless the artifact has an explicit outbound allowlist (owner-only,
  see Access control);
- access the file system (the browser sandbox prevents this);
- register service workers, open popups, navigate the top-level page, or submit forms
  to the parent;
- receive credentials. No environment variables, `NEXT_PUBLIC_` or otherwise, are
  injected into artifact responses.

### Isolation mechanism (v1)

The protection holds even if someone opens the artifact URL directly:

1. **Embedding.** Artifacts are embedded with `<iframe sandbox="allow-scripts">`
   **without** `allow-same-origin`. The frame gets an opaque origin, so cookies, storage
   and same-origin APIs are unavailable. No `allow-popups`, `allow-top-navigation`,
   `allow-forms` or `allow-modals` flags are granted in v1.
2. **Response-level sandbox.** `/api/sandbox/[id]` serves the artifact with a strict
   `Content-Security-Policy` that **includes the `sandbox allow-scripts` directive**. A
   top-level visit to the artifact URL is then sandboxed into an opaque origin too; the
   iframe attribute alone would not cover that case.
3. **Baseline CSP:**
   - `default-src 'none'`;
   - `script-src` / `style-src` / `img-src` / `font-src`: `'self'` plus inline as the
     artifact requires;
   - `connect-src 'none'`, unless the artifact has `allow_outbound`, in which case
     exactly its allowlisted origins;
   - `frame-ancestors 'self'` and `form-action 'none'`.

   Responses also send `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: no-referrer` and `Cache-Control: private, no-store` for
   non-public artifacts.
4. **Source location.** Sources live under **`sandbox/<id>/` at the repository root,
   outside `public/`**, and are served only through the route handler. Anything in
   `public/` bypasses the headers above, so files there are never executable artifacts.
   Files outside `sandbox/<id>/` are not executable.
5. **No `postMessage` bridge in v1.** Adding one needs its own accepted ADR.
6. **Possible v2 hardening:** serve artifacts from a separate registrable domain, such as
   a sandbox subdomain on a different site. That adds process and site isolation on top
   of the opaque origin.

### Resource limits: what v1 can and cannot enforce

Browsers give the parent page no API to cap an iframe's CPU time or memory. In v1:

- **Enforced:**
  - no service workers (impossible from an opaque origin);
  - no popups and no top-level navigation (sandbox flags);
  - no network (CSP);
  - a session time limit: the run page unloads the frame after
    `resource_limits.max_session_seconds`.
- **Declared, not enforced:** `resource_limits.cpu` and `resource_limits.memory` record
  the reviewed expectation. They are checked at review time, when an artifact is
  registered. A runaway artifact can still slow down the viewer's own tab, but it cannot
  reach Artemis data.

### Registry

- **File:** `data/artifact-registry.json`, changed only through reviewed PRs (the
  ADR-013 pattern).
- **Fields per artifact:**
  - `id`, `title`;
  - `source_path` (must be `sandbox/<id>/`) and `entry`;
  - `visibility`, `data_mode` (Product Registry vocabulary);
  - `allow_outbound` (`false`, or a list of origins);
  - `resource_limits` (`max_session_seconds`, plus declared `cpu` and `memory`);
  - `owner` (role or team, **not a personal email**: the repository is public);
  - `created_at`, `updated_at`, `notes`.
- **Unregistered means not served.** The route handler serves only registered ids, and
  only files inside that artifact's directory. Path traversal is rejected.

### Access control

- `visibility: public_safe_demo`: runs without authentication.
- Any other visibility requires an authenticated session, of any ADR-012 role, behind the
  ADR-011 allowlist.
- Artifacts with `allow_outbound` enabled run **only for the `owner` role**, so an
  outbound-enabled artifact can never be `public_safe_demo`.

### Audit

- Every execution is logged with:
  - user id, or `anonymous`;
  - artifact id;
  - UTC start timestamp;
  - bytes served;
  - session duration;
  - exit reason.
- **Without a bridge, duration and exit reason come from the run page, not the
  artifact.** The parent records load, unload, timeout and load-error events and reports
  them with `navigator.sendBeacon`. Possible exit reasons: `closed`, `navigated_away`,
  `timeout`, `load_error`, `denied`.
- **Storage:** the Supabase table `execution_logs`, following the ADR-012 pattern.
  - RLS is on, and API roles get no direct table grants.
  - Inserts go through a validated `security definer` function, such as
    `log_execution(...)`, with an empty `search_path`. Anonymous runs are logged that
    way **without the service-role key**, which stays unused (ADR-011).
  - Owner and admin can read logs through a role-checked policy.
- **IP handling:** IP addresses are stored only as a salted hash, used for rate limiting.
  The salt is a server-only secret (ADR-004). Rows are kept for 30 days.

### Rate limits

- Anonymous: 5 executions per hour per IP hash.
- Authenticated: 60 executions per hour per user.
- The check runs in the same database function before a log row is written. Requests
  over the limit get HTTP 429 and are logged as `denied`.

## Consequences

- New route `/labs/run/[id]`, auth-aware. It must be added to the session-refresh
  middleware matcher (ADR-011).
- New route handler `/api/sandbox/[id]`, which serves registered artifact files with the
  headers above.
- New Supabase objects: the `execution_logs` table, the logging and rate-limit function,
  and RLS policies. They arrive as a migration file the owner applies (ADR-012 pattern).
- New server-only secret: the IP-hash salt.
- `/control` gains a read-only list of registered artifacts.
- **Existing standalone labs are not migrated by this ADR.** They stay same-origin
  without a sandbox, and therefore can read the Supabase session cookie. Each needs a
  disposition: migrate into `sandbox/`, add iframe sandboxing, or accept the risk with a
  recorded reason. This is tracked as a follow-up.

## Non-goals

This ADR does not:

- accept arbitrary user-submitted code; only registered, reviewed artifacts run;
- execute anything on the server; execution is the browser sandbox only;
- let artifact code write to any database;
- let code inside the sandbox reach Supabase or the Artemis API;
- add a `postMessage` bridge;
- migrate or change existing standalone labs, registries, code or routes.

## References

ADR-004, ADR-006, ADR-011, ADR-012, ADR-013, and `ENGINEERING/PROJECT_GENOME.yaml`
(`frontend.styling`: "isolated standalone HTML labs when approved").
