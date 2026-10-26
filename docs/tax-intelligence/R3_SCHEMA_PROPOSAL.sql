-- R3 proposal ONLY: do not apply to production until reviewed and tested.
-- Private schema intentionally not exposed through Supabase Data API.
create schema if not exists tax_private;
revoke all on schema tax_private from public, anon, authenticated;

create table if not exists tax_private.clients (
  id text primary key check (id in ('personal','great-order','artemis','agoraxai','apolloa')),
  display_name text not null,
  created_at timestamptz not null default now()
);
create table if not exists tax_private.memberships (
  client_id text not null references tax_private.clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','accountant','viewer')),
  granted_at timestamptz not null default now(),
  primary key (client_id,user_id)
);
create table if not exists tax_private.evidence_manifest (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references tax_private.clients(id),
  title text not null,
  status text not null default 'pending' check (status in ('pending','review','verified','rejected')),
  sha256 text check (sha256 is null or sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
alter table tax_private.clients enable row level security;
alter table tax_private.memberships enable row level security;
alter table tax_private.evidence_manifest enable row level security;
-- No access policies or grants: default deny to API users.
-- R4 must design separately audited, server-only access functions or controlled
-- security-invoker APIs and tests before any client data is inserted.
-- No membership bootstrap or real client data included in this migration.
