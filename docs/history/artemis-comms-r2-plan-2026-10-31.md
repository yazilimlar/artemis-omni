# ARTEMIS Communications Hub R2 — plan + handover (Issue #276)

Scope: complete inquiry persistence, authenticated inbox, Resend notifications, GitHub events, private mobile escalation. No phone number or credentials in source. Preview-first; production requires tests and approval.

Ownership declaration (per CLAUDE.md / AI_SESSION_START_PROTOCOL §3): division **UNREVIEWED** (Communications Hub has no PRODUCT_REGISTRY entry), product **Communications Hub R2**, lifecycle **noindex preview / pilot**, visibility **public form + authenticated operator inbox**, data mode **live intake with private data in Supabase only**, change type product-specific, branch `labs/artemis-homepage-r2-toggle`.

## Architecture

- Public intake: `app/communications/page.tsx` + `components/comms/CommunicationsConsole.tsx` (noindex preview) → `POST /api/communications`.
- Persistence: Supabase Postgres, table `artemis_communications` (RLS enabled, **no policies** — service-role-only, server-side REST via `lib/comms/server.ts`). Raw IP addresses are never stored; only the ADR-014 HMAC hash (`ip_hash`).
- Notification: Resend, text-only body, one attempt at intake; failures are retried by the gated retry route. Provider acceptance and delivery are separate states (below).
- Operator inbox: `/communications/inbox` (Server Component; `requireAuth()` — Supabase Auth + `ARTEMIS_INTERNAL_ALLOWLIST`, ADR-011 — runs before any data read; middleware matcher includes the route for session refresh + `Cache-Control: private, no-store`). Thread view via `?id=<uuid>`; replies via `components/comms/ReplyForm.tsx` → `POST /api/communications/reply`.
- Pilot durability: `POST /api/pilot-requests` persists the **full** payload to `artemis_communications` (category `Project pilot`, `notification_status='not_requested'`, `source='integrate-pilot-form'`) **before** the legacy Squarespace contact sync, which remains the secondary sync. If Squarespace fails after a successful persist, the response is `ok:true, status:'stored'` with the Supabase reference. If Supabase is not configured, legacy behaviour is unchanged. The pilot path never sends email.
- Pure helpers in `lib/comms/` (`validation.ts`, `status.ts`, `retry.ts`, `webhooks.ts`) — no DB/env/network, unit-tested in `tests/unit/comms-helpers.test.ts`.

## Status taxonomy

Notification (per message row):

```
stored -> notification_queued -> provider_accepted   (Resend API accepted; delivery NOT implied)
                              -> notification_failed   (retryable; notification_attempts + next_retry_at recorded)
         notification_not_requested                    (pilot-form rows; no email is ever sent)
```

Delivery (separate column `delivery_status`, moves **only** via the Resend webhook): `unknown -> delivered | bounced | complained`.

Legacy v1 values map cleanly in code (`lib/comms/status.ts`): `pending` / `queued` / `notification-pending` → `notification_queued`; `notification-sent` → `provider_accepted` (it only ever meant API acceptance).

Retry policy: max 5 attempts; backoff after a failed attempt is +5 min, +30 min, +2 h, +12 h; at the cap `next_retry_at` is null (terminal `notification_failed`). Retries reuse the **same** Resend `Idempotency-Key` (the message id), so a retry after an unrecorded acceptance does not double-send.

Outbox honesty (intake + reply): if the status PATCH after a send fails, the API response reports `notification_queued` — never `provider_accepted` — and a structured error is logged (`artemis_comms_status_update_failed` with the reference id). Replies are recorded **first** as `send_status='queued'`, then updated to `provider_accepted` / `failed`; the parent's `reply_status` becomes `replied` only on provider acceptance.

## Routes added / changed

| Route | Purpose | Gate |
|---|---|---|
| `POST /api/communications` | intake: origin check, 10 KB cap, honeypot, sanitization, ip-hash rate limit (5/hour, 20/day per hashed IP → 429 + `Retry-After`), client idempotency (`Idempotency-Key` header or `submissionId`), one Resend attempt with provider id captured | public form |
| `GET|POST /api/communications/retry` | retry worker, ≤20 due rows/run, counts only in response | `ARTEMIS_COMMS_CRON_SECRET` (`x-cron-secret` or Bearer); 503 unset, 401 mismatch |
| `POST /api/communications/webhook` | Resend/Svix delivery events; dedupe = `provider_message_id` + delivery-status transition guard | Svix signature via `RESEND_WEBHOOK_SECRET`; 503 unset, 401 bad signature |
| `POST /api/github/webhook` | GitHub event ledger into `artemis_github_events` (event/action/repo + ≤140-char summary only; never full payloads); dedupe = `delivery_id` PK (409 → `deduplicated`) | `X-Hub-Signature-256` via `GITHUB_WEBHOOK_SECRET`; 503 unset, 401 bad |
| `GET /communications/inbox` (+ `?id=`) | operator list (latest 50) + thread + reply form | `requireAuth()` (ADR-011) |
| `POST /api/communications/reply` | operator reply via Resend; records reply row first | Supabase session + allowlist (401/403 JSON, fail closed) |
| `POST /api/pilot-requests` | full-payload durable persist before Squarespace sync (see above) | public form (existing) |

Known limiter choice: if `ARTEMIS_IP_SALT` is missing, the ip-hash rate limiter cannot run; intake logs a structured warning (`artemis_comms_ip_salt_missing`) and skips the limiter instead of crashing — honeypot, origin and size checks still apply.

## Environment prerequisites (NAMES ONLY — set in Vercel Preview for this project)

Required for persistence: `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) and `SUPABASE_SERVICE_ROLE_KEY`.
Required for notification + replies: `RESEND_API_KEY`, `ARTEMIS_COMMS_FROM`, `ARTEMIS_COMMS_TO`.
Required for rate limiting: `ARTEMIS_IP_SALT`. Required for the inbox: `ARTEMIS_INTERNAL_ALLOWLIST` (+ existing Supabase Auth config).
New optional: `ARTEMIS_COMMS_CRON_SECRET` (retry worker), `RESEND_WEBHOOK_SECRET` (delivery webhook), `GITHUB_WEBHOOK_SECRET` (GitHub ledger).

**Current state (verified 2026-10-31):** `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `RESEND_API_KEY`, `ARTEMIS_COMMS_FROM`, `ARTEMIS_COMMS_TO` are **absent** from the Vercel project, so `POST /api/communications` correctly returns **503 "not configured"** today. No credentials were invented; nothing was executed in Supabase.

## Migrations (run order, Supabase SQL editor — owner/authorized operator only)

1. `supabase/migrations/20261031_artemis_communications.sql` (v1 — already in the branch; run first if not yet applied).
2. `supabase/migrations/20261031_artemis_communications_v2.sql` (v2 — adds `ip_hash`, unique `idempotency_key`, `provider_message_id`, `notification_attempts`, `next_retry_at`, `delivery_status`, `source`, retry/rate-limit indexes, `artemis_communication_replies`, `artemis_github_events`; RLS enabled, no policies, idempotent where Postgres allows).

## Webhook registration (after env is set)

- Resend: register `https://<deployment-host>/api/communications/webhook` for `email.delivered`, `email.bounced`, `email.complained`; put its signing secret in `RESEND_WEBHOOK_SECRET`.
- GitHub: repo Settings → Webhooks → `https://<deployment-host>/api/github/webhook`, content type JSON, secret = `GITHUB_WEBHOOK_SECRET`, events as needed (issues / pull requests / push).
- Retry: schedule any external cron to call `/api/communications/retry` with the cron secret header.

## Owner test instructions

1. Set the env names above (Preview scope), run migrations v1 → v2.
2. Submit the form at `/communications`: expect a reference id and "Notification accepted by the email provider — delivery confirmation pending."
3. Submit twice with the same browser form retry: expect the same reference with `deduplicated` — one row, one email.
4. Open `/communications/inbox` signed out: expect redirect to `/login`. Signed in as an allowlisted operator: expect the message listed; open the thread and reply; the reply row shows `provider_accepted` and the sender receives the reply.
5. Trigger the retry route without the secret: expect 401; with the secret after a forced failure: expect counts only.
6. Send a test Resend webhook event (or a real delivery): expect `delivery_status` to move to `delivered`.

## NOT verified (pending owner env setup)

Live email delivery, operator replies end-to-end, Resend webhook delivery updates, GitHub webhook recording, and the retry worker against a real database are **not verified** — they cannot be until the env names above are set and the migrations are run. WhatsApp / SMS is **deferred**: no provider or consent exists; the public page still says "not activated in this preview".

## Remaining risks

- Rate limiting is DB-count based (per hashed IP, trailing windows) — adequate for a preview inbox, not a substitute for edge/WAF limits at production scale.
- The retry worker has no scheduler in-repo; it does nothing until an external cron calls it.
- Inbox lists the latest 50 messages with no pagination or search yet.
- Inbound email replies are modelled (`direction='inbound'`) but no inbound provider is wired; only outbound operator replies are implemented.
