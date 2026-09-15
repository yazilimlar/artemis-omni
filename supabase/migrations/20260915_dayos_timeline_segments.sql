-- Artemis DayOS Phase 3: normalized Google Timeline segments
-- Provider semantic visits/activities remain INFERRED evidence-derived state.

create table if not exists dayos.timeline_segments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  timeline_import_id uuid not null references dayos.timeline_imports(id) on delete cascade,
  source_ordinal integer not null check (source_ordinal > 0),
  segment_type text not null check (segment_type in ('VISIT', 'MOVEMENT', 'UNKNOWN')),
  starts_at timestamptz,
  ends_at timestamptz,
  place_id text,
  place_location text,
  semantic_type text,
  activity_type text,
  distance_meters numeric,
  provider_probability numeric,
  epistemic text not null default 'INFERRED' check (epistemic in ('OBSERVED', 'REPORTED', 'INFERRED')),
  temporal_role text not null default 'ACTUAL' check (temporal_role in ('ACTUAL', 'FORECAST', 'SCHEDULED', 'DERIVED')),
  confidence numeric(4,3) not null default 0.500 check (confidence >= 0 and confidence <= 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint timeline_segments_import_ordinal_unique unique (timeline_import_id, source_ordinal)
);

create index if not exists timeline_segments_user_time_idx
  on dayos.timeline_segments (user_id, starts_at);
create index if not exists timeline_segments_import_idx
  on dayos.timeline_segments (timeline_import_id, source_ordinal);
create index if not exists timeline_segments_place_idx
  on dayos.timeline_segments (user_id, place_id)
  where place_id is not null;

alter table dayos.timeline_segments enable row level security;
grant select, insert, update, delete on dayos.timeline_segments to authenticated, service_role;

drop policy if exists "dayos timeline segments owner all" on dayos.timeline_segments;
create policy "dayos timeline segments owner all"
on dayos.timeline_segments for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
