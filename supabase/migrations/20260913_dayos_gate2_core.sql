-- Artemis DayOS Gate 2 persistence core
-- Shared Supabase project deployment: isolate all DayOS objects in the `dayos` schema.
-- Canonical contracts: OperatingEvent + append-oriented Evidence ledger.

create extension if not exists pgcrypto;
create schema if not exists dayos;

create or replace function dayos.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = dayos, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists dayos.operating_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_event_id text,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_all_day boolean not null default false,
  anchor_class text not null default 'ELASTIC'
    check (anchor_class in ('HARD', 'PROTECTED', 'ELASTIC', 'OPTIONAL')),
  location_label text,
  lat double precision,
  lng double precision,
  source text not null,
  epistemic text not null default 'REPORTED'
    check (epistemic in ('OBSERVED', 'REPORTED', 'INFERRED')),
  temporal_role text not null default 'SCHEDULED'
    check (temporal_role in ('ACTUAL', 'FORECAST', 'SCHEDULED', 'DERIVED')),
  confidence numeric(4,3) not null default 1.000
    check (confidence >= 0 and confidence <= 1),
  external_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint operating_events_provider_identity_unique
    unique (user_id, source, provider_event_id)
);

create table if not exists dayos.evidence_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null
    check (kind in ('CALENDAR', 'LOCATION', 'TIMELINE', 'PHOTO', 'VOICE', 'TEXT', 'TRANSACTION', 'USER_CONFIRMATION')),
  source text not null,
  epistemic text not null
    check (epistemic in ('OBSERVED', 'REPORTED', 'INFERRED')),
  temporal_role text not null default 'ACTUAL'
    check (temporal_role in ('ACTUAL', 'FORECAST', 'SCHEDULED', 'DERIVED')),
  confidence numeric(4,3) not null default 1.000
    check (confidence >= 0 and confidence <= 1),
  observed_at_utc timestamptz,
  content_time_utc timestamptz,
  payload jsonb not null default '{}'::jsonb,
  supersedes_id uuid references dayos.evidence_records(id) on delete set null,
  recorded_at timestamptz not null default now()
);

create table if not exists dayos.event_evidence_links (
  event_id uuid not null references dayos.operating_events(id) on delete cascade,
  evidence_id uuid not null references dayos.evidence_records(id) on delete cascade,
  relationship text not null default 'SUPPORTS'
    check (relationship in ('SUPPORTS', 'CONTRADICTS', 'DERIVES', 'CORRECTS')),
  created_at timestamptz not null default now(),
  primary key (event_id, evidence_id)
);

create table if not exists dayos.user_corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null
    check (target_type in ('OPERATING_EVENT', 'EVIDENCE_RECORD', 'NARRATIVE_SEGMENT')),
  target_id uuid not null,
  field_path text,
  correction_payload jsonb not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists dayos.timeline_imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  import_source text not null,
  source_filename text,
  source_sha256 text,
  record_count integer not null default 0 check (record_count >= 0),
  raw_payload jsonb not null,
  imported_at timestamptz not null default now()
);

create table if not exists dayos.media_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  external_media_id text,
  original_filename text,
  content_type text,
  taken_at timestamptz,
  lat double precision,
  lng double precision,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists dayos.narrative_segments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz,
  ends_at timestamptz,
  title text not null,
  summary text not null,
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'PROPOSED', 'VERIFIED')),
  confidence numeric(4,3) not null default 0.500
    check (confidence >= 0 and confidence <= 1),
  evidence_ids uuid[] not null default '{}'::uuid[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists operating_events_user_starts_idx
  on dayos.operating_events (user_id, starts_at);
create index if not exists operating_events_user_anchor_idx
  on dayos.operating_events (user_id, anchor_class, starts_at);
create index if not exists evidence_records_user_recorded_idx
  on dayos.evidence_records (user_id, recorded_at desc);
create index if not exists evidence_records_source_time_idx
  on dayos.evidence_records (source, content_time_utc);
create index if not exists evidence_records_supersedes_idx
  on dayos.evidence_records (supersedes_id);
create index if not exists event_evidence_links_event_idx
  on dayos.event_evidence_links (event_id);
create index if not exists event_evidence_links_evidence_idx
  on dayos.event_evidence_links (evidence_id);
create index if not exists user_corrections_user_created_idx
  on dayos.user_corrections (user_id, created_at desc);
create index if not exists timeline_imports_user_imported_idx
  on dayos.timeline_imports (user_id, imported_at desc);
create index if not exists media_selections_user_taken_idx
  on dayos.media_selections (user_id, taken_at);
create index if not exists narrative_segments_user_starts_idx
  on dayos.narrative_segments (user_id, starts_at);

drop trigger if exists operating_events_set_updated_at on dayos.operating_events;
create trigger operating_events_set_updated_at
before update on dayos.operating_events
for each row execute function dayos.set_updated_at();

drop trigger if exists narrative_segments_set_updated_at on dayos.narrative_segments;
create trigger narrative_segments_set_updated_at
before update on dayos.narrative_segments
for each row execute function dayos.set_updated_at();

alter table dayos.operating_events enable row level security;
alter table dayos.evidence_records enable row level security;
alter table dayos.event_evidence_links enable row level security;
alter table dayos.user_corrections enable row level security;
alter table dayos.timeline_imports enable row level security;
alter table dayos.media_selections enable row level security;
alter table dayos.narrative_segments enable row level security;

-- Custom schema access. Do not expose to anon.
grant usage on schema dayos to authenticated, service_role;
grant select, insert, update, delete on dayos.operating_events to authenticated, service_role;
grant select, insert, delete on dayos.evidence_records to authenticated;
grant select, insert, update, delete on dayos.evidence_records to service_role;
grant select, insert, delete on dayos.event_evidence_links to authenticated;
grant select, insert, update, delete on dayos.event_evidence_links to service_role;
grant select, insert, update, delete on dayos.user_corrections to authenticated, service_role;
grant select, insert, update, delete on dayos.timeline_imports to authenticated, service_role;
grant select, insert, update, delete on dayos.media_selections to authenticated, service_role;
grant select, insert, update, delete on dayos.narrative_segments to authenticated, service_role;
grant execute on function dayos.set_updated_at() to service_role;

-- Mutable derived state: owner can select/insert/update/delete.
drop policy if exists "dayos operating events owner select" on dayos.operating_events;
create policy "dayos operating events owner select"
on dayos.operating_events for select
using ((select auth.uid()) = user_id);

drop policy if exists "dayos operating events owner insert" on dayos.operating_events;
create policy "dayos operating events owner insert"
on dayos.operating_events for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "dayos operating events owner update" on dayos.operating_events;
create policy "dayos operating events owner update"
on dayos.operating_events for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "dayos operating events owner delete" on dayos.operating_events;
create policy "dayos operating events owner delete"
on dayos.operating_events for delete
using ((select auth.uid()) = user_id);

-- Evidence is append-oriented: owner may select, insert, and delete for privacy,
-- but there is intentionally no UPDATE policy. Corrections append new evidence.
drop policy if exists "dayos evidence owner select" on dayos.evidence_records;
create policy "dayos evidence owner select"
on dayos.evidence_records for select
using ((select auth.uid()) = user_id);

drop policy if exists "dayos evidence owner insert" on dayos.evidence_records;
create policy "dayos evidence owner insert"
on dayos.evidence_records for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "dayos evidence owner delete" on dayos.evidence_records;
create policy "dayos evidence owner delete"
on dayos.evidence_records for delete
using ((select auth.uid()) = user_id);

drop policy if exists "dayos event evidence owner select" on dayos.event_evidence_links;
create policy "dayos event evidence owner select"
on dayos.event_evidence_links for select
using (
  exists (
    select 1 from dayos.operating_events e
    where e.id = event_id and e.user_id = (select auth.uid())
  )
  and exists (
    select 1 from dayos.evidence_records r
    where r.id = evidence_id and r.user_id = (select auth.uid())
  )
);

drop policy if exists "dayos event evidence owner insert" on dayos.event_evidence_links;
create policy "dayos event evidence owner insert"
on dayos.event_evidence_links for insert
with check (
  exists (
    select 1 from dayos.operating_events e
    where e.id = event_id and e.user_id = (select auth.uid())
  )
  and exists (
    select 1 from dayos.evidence_records r
    where r.id = evidence_id and r.user_id = (select auth.uid())
  )
);

drop policy if exists "dayos event evidence owner delete" on dayos.event_evidence_links;
create policy "dayos event evidence owner delete"
on dayos.event_evidence_links for delete
using (
  exists (
    select 1 from dayos.operating_events e
    where e.id = event_id and e.user_id = (select auth.uid())
  )
  and exists (
    select 1 from dayos.evidence_records r
    where r.id = evidence_id and r.user_id = (select auth.uid())
  )
);

drop policy if exists "dayos corrections owner all" on dayos.user_corrections;
create policy "dayos corrections owner all"
on dayos.user_corrections for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "dayos timeline imports owner all" on dayos.timeline_imports;
create policy "dayos timeline imports owner all"
on dayos.timeline_imports for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "dayos media selections owner all" on dayos.media_selections;
create policy "dayos media selections owner all"
on dayos.media_selections for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "dayos narrative owner all" on dayos.narrative_segments;
create policy "dayos narrative owner all"
on dayos.narrative_segments for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
