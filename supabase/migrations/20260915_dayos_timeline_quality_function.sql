-- Artemis DayOS Phase 3: deterministic Timeline quality assessment.
-- Security-invoker; only the authenticated owner may assess an import.

create or replace function dayos.assess_timeline_quality(p_import_id uuid)
returns table (
  total integer,
  pass_count integer,
  review_count integer,
  reject_count integer
)
language plpgsql
security invoker
set search_path = dayos, public
as $$
begin
  if not exists (
    select 1
    from dayos.timeline_imports ti
    where ti.id = p_import_id
      and ti.user_id = (select auth.uid())
  ) then
    raise exception 'timeline import not found or not owned by current user';
  end if;

  with ordered as (
    select
      s.id,
      s.segment_type,
      s.starts_at,
      s.ends_at,
      s.confidence,
      s.place_id,
      s.activity_type,
      lag(s.ends_at) over (
        partition by s.timeline_import_id
        order by s.source_ordinal
      ) as previous_end
    from dayos.timeline_segments s
    where s.timeline_import_id = p_import_id
      and s.user_id = (select auth.uid())
  ), assessed as (
    select
      o.id,
      case
        when o.starts_at is not null and o.ends_at is not null
          then greatest(0, extract(epoch from (o.ends_at - o.starts_at))::integer)
        else null
      end as duration_seconds,
      case
        when o.starts_at is not null and o.previous_end is not null
          then extract(epoch from (o.starts_at - o.previous_end))::integer
        else null
      end as continuity_gap_seconds,
      array_remove(array[
        case when o.starts_at is null then 'MISSING_START' end,
        case when o.ends_at is null then 'MISSING_END' end,
        case when o.starts_at is not null and o.ends_at is not null and o.ends_at < o.starts_at then 'NEGATIVE_DURATION' end,
        case when o.confidence < 0.35 then 'LOW_CONFIDENCE' end,
        case when o.segment_type = 'UNKNOWN' then 'UNKNOWN_SEGMENT' end,
        case when o.segment_type = 'VISIT' and o.place_id is null then 'VISIT_WITHOUT_PLACE_ID' end,
        case when o.segment_type = 'MOVEMENT' and o.activity_type is null then 'MOVEMENT_WITHOUT_ACTIVITY' end,
        case when o.starts_at is not null and o.previous_end is not null and o.starts_at < o.previous_end - interval '5 minutes' then 'TEMPORAL_OVERLAP' end,
        case when o.starts_at is not null and o.previous_end is not null and o.starts_at > o.previous_end + interval '6 hours' then 'LARGE_GAP' end
      ], null) as flags
    from ordered o
  ), scored as (
    select
      a.*,
      greatest(0.0, least(1.0,
        1.0
        - case when 'MISSING_START' = any(a.flags) then 0.35 else 0 end
        - case when 'MISSING_END' = any(a.flags) then 0.35 else 0 end
        - case when 'NEGATIVE_DURATION' = any(a.flags) then 0.60 else 0 end
        - case when 'LOW_CONFIDENCE' = any(a.flags) then 0.25 else 0 end
        - case when 'UNKNOWN_SEGMENT' = any(a.flags) then 0.35 else 0 end
        - case when 'VISIT_WITHOUT_PLACE_ID' = any(a.flags) then 0.15 else 0 end
        - case when 'MOVEMENT_WITHOUT_ACTIVITY' = any(a.flags) then 0.15 else 0 end
        - case when 'TEMPORAL_OVERLAP' = any(a.flags) then 0.30 else 0 end
        - case when 'LARGE_GAP' = any(a.flags) then 0.10 else 0 end
      ))::numeric(4,3) as quality_score
    from assessed a
  )
  update dayos.timeline_segments s
  set
    duration_seconds = sc.duration_seconds,
    continuity_gap_seconds = sc.continuity_gap_seconds,
    quality_flags = sc.flags,
    quality_score = sc.quality_score,
    quality_status = case
      when 'NEGATIVE_DURATION' = any(sc.flags)
        or ('MISSING_START' = any(sc.flags) and 'MISSING_END' = any(sc.flags))
        then 'REJECT'
      when sc.quality_score >= 0.75 then 'PASS'
      when sc.quality_score >= 0.35 then 'REVIEW'
      else 'REJECT'
    end
  from scored sc
  where s.id = sc.id;

  return query
  select
    count(*)::integer,
    count(*) filter (where s.quality_status = 'PASS')::integer,
    count(*) filter (where s.quality_status = 'REVIEW')::integer,
    count(*) filter (where s.quality_status = 'REJECT')::integer
  from dayos.timeline_segments s
  where s.timeline_import_id = p_import_id
    and s.user_id = (select auth.uid());
end;
$$;

grant execute on function dayos.assess_timeline_quality(uuid) to authenticated, service_role;
