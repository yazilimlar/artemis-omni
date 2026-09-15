-- Artemis DayOS Phase 3: Timeline quality / continuity layer

alter table dayos.timeline_segments
  add column if not exists duration_seconds integer,
  add column if not exists continuity_gap_seconds integer,
  add column if not exists quality_status text not null default 'UNASSESSED'
    check (quality_status in ('UNASSESSED', 'PASS', 'REVIEW', 'REJECT')),
  add column if not exists quality_score numeric(4,3)
    check (quality_score is null or (quality_score >= 0 and quality_score <= 1)),
  add column if not exists quality_flags text[] not null default '{}'::text[];

create index if not exists timeline_segments_user_quality_idx
  on dayos.timeline_segments (user_id, quality_status, starts_at);

create index if not exists timeline_segments_import_ordinal_idx
  on dayos.timeline_segments (timeline_import_id, source_ordinal);
