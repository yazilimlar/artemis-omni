-- Communications Hub R2 (Issue #276) — run AFTER 20261031_artemis_communications.sql
-- in the project's authorized Supabase SQL editor. Idempotent where Postgres allows.
-- No policies are added anywhere: RLS stays enabled, service-role-only access.

alter table public.artemis_communications
  add column if not exists ip_hash text,
  add column if not exists idempotency_key text,
  add column if not exists provider_message_id text,
  add column if not exists notification_attempts int not null default 0,
  add column if not exists next_retry_at timestamptz,
  add column if not exists delivery_status text not null default 'unknown',
  add column if not exists source text not null default 'communications-page';

-- Client idempotency: one stored row per submission key.
create unique index if not exists artemis_communications_idempotency_key_uidx
  on public.artemis_communications (idempotency_key)
  where idempotency_key is not null;

-- Rate limiting counts recent rows per hashed IP (raw IPs are never stored).
create index if not exists artemis_communications_ip_hash_created_idx
  on public.artemis_communications (ip_hash, created_at desc);

-- Retry worker scans due rows.
create index if not exists artemis_communications_retry_idx
  on public.artemis_communications (notification_status, next_retry_at);

create index if not exists artemis_communications_provider_id_idx
  on public.artemis_communications (provider_message_id);

-- Two-way replies / thread.
create table if not exists public.artemis_communication_replies (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid not null references public.artemis_communications (id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  author_email text,
  body text not null check (length(body) between 1 and 8000),
  provider_message_id text,
  send_status text not null default 'provider_accepted',
  created_at timestamptz not null default now()
);
alter table public.artemis_communication_replies enable row level security;
-- No public policies. Server-only service role.
create index if not exists artemis_communication_replies_thread_idx
  on public.artemis_communication_replies (communication_id, created_at asc);

-- GitHub webhook event ledger; delivery_id is the dedupe key.
-- Stores only event/action/repo and a short summary — never full payloads.
create table if not exists public.artemis_github_events (
  delivery_id text primary key,
  event text,
  action text,
  repo text,
  summary text,
  created_at timestamptz not null default now()
);
alter table public.artemis_github_events enable row level security;
-- No public policies. Server-only service role.
