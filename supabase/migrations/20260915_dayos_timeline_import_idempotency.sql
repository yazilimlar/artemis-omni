-- Artemis DayOS Phase 3 hardening: make Timeline ingestion idempotent by source fingerprint.
-- Keep the earliest copy of an identical export for each user/source and remove exact duplicates.

with ranked as (
  select id,
         row_number() over (
           partition by user_id, import_source, source_sha256
           order by imported_at asc, id asc
         ) as rn
  from dayos.timeline_imports
  where source_sha256 is not null
), duplicates as (
  select id from ranked where rn > 1
)
delete from dayos.timeline_segments s
using duplicates d
where s.timeline_import_id = d.id;

with ranked as (
  select id,
         row_number() over (
           partition by user_id, import_source, source_sha256
           order by imported_at asc, id asc
         ) as rn
  from dayos.timeline_imports
  where source_sha256 is not null
), duplicates as (
  select id from ranked where rn > 1
)
delete from dayos.evidence_records e
using duplicates d
where e.kind = 'TIMELINE'
  and e.source = 'google.timeline.export'
  and e.payload->>'timelineImportId' = d.id::text;

with ranked as (
  select id,
         row_number() over (
           partition by user_id, import_source, source_sha256
           order by imported_at asc, id asc
         ) as rn
  from dayos.timeline_imports
  where source_sha256 is not null
), duplicates as (
  select id from ranked where rn > 1
)
delete from dayos.timeline_imports i
using duplicates d
where i.id = d.id;

create unique index if not exists timeline_imports_user_source_sha_unique
  on dayos.timeline_imports (user_id, import_source, source_sha256)
  where source_sha256 is not null;
