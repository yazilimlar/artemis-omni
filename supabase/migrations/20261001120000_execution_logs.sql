-- ---------------------------------------------------------------------------
-- 20261001120000_execution_logs.sql  (ADR-014)
--
-- Audit log and rate limiter for sandboxed artifact execution.
--
-- APPLY MANUALLY (AI tools hold no database credentials, ADR-004). Either:
--   (a) paste this file into the Supabase dashboard SQL Editor and Run, or
--   (b) Supabase CLI: `supabase db push` after `supabase link`.
-- Requires 20261001_init_user_profiles.sql (ADR-012) to be applied first,
-- because the read policy checks public.user_profiles.role.
--
-- Security model:
--   * RLS on. anon/authenticated get NO table grants; rows are written only
--     through log_execution() (security definer, empty search_path).
--   * The caller's identity comes from auth.uid() inside the function; it is
--     never a parameter, so it cannot be spoofed.
--   * Owner/admin may read logs (role checked against user_profiles).
--   * Raw IPs are never stored: ip_hash is an HMAC computed server-side.
--   * Rows older than 30 days should be purged (ADR-014 retention); see the
--     purge statement at the end (run on a schedule, e.g. pg_cron).
--
-- Residual risk: log_execution is callable with the public anon key, so a
-- caller can insert syntactically valid rows directly. Inputs are validated
-- and rate-limited per IP hash / user; rows cannot be attributed to another
-- user, and HMAC'd IP hashes of real visitors cannot be guessed.
-- ---------------------------------------------------------------------------

create table if not exists public.execution_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  artifact_id text not null check (artifact_id ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
  event text not null check (event in ('serve', 'session', 'denied')),
  duration_ms integer check (duration_ms is null or (duration_ms >= 0 and duration_ms <= 86400000)),
  exit_reason text check (
    exit_reason is null
    or exit_reason in ('served', 'closed', 'navigated_away', 'timeout', 'load_error', 'denied')
  ),
  bytes_served integer check (bytes_served is null or bytes_served >= 0),
  ip_hash text check (ip_hash is null or ip_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

create index if not exists execution_logs_user_artifact_created_idx
  on public.execution_logs (user_id, artifact_id, created_at);
create index if not exists execution_logs_ip_created_idx
  on public.execution_logs (ip_hash, created_at);

alter table public.execution_logs enable row level security;

revoke all on table public.execution_logs from anon, authenticated;
grant select on table public.execution_logs to authenticated;

drop policy if exists "execution_logs_select_owner_admin" on public.execution_logs;
create policy "execution_logs_select_owner_admin"
  on public.execution_logs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles p
      where p.id = (select auth.uid()) and p.role in ('owner', 'admin')
    )
  );

-- Rate-limited logger. Returns true when the event was recorded, false when
-- the caller is over the limit (anonymous: 5/hour per ip_hash; signed-in:
-- 60/hour per user). 'serve' events gate execution; 'session' telemetry uses
-- the same budget so beacons cannot flood the table.
create or replace function public.log_execution(
  p_artifact_id text,
  p_event text,
  p_duration_ms integer,
  p_exit_reason text,
  p_bytes_served integer,
  p_ip_hash text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limit integer := case when v_user is null then 5 else 60 end;
  v_used integer;
  v_denied integer;
begin
  if p_artifact_id is null or p_artifact_id !~ '^[a-z0-9][a-z0-9-]{0,63}$' then
    raise exception 'invalid artifact id';
  end if;
  if p_event is null or p_event not in ('serve', 'session') then
    raise exception 'invalid event';
  end if;
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid ip hash';
  end if;

  select count(*) into v_used
  from public.execution_logs l
  where l.event = p_event
    and l.created_at > now() - interval '1 hour'
    and (
      (v_user is null and l.user_id is null and l.ip_hash = p_ip_hash)
      or (v_user is not null and l.user_id = v_user)
    );

  if v_used >= v_limit then
    -- Record one 'denied' row per window, not one per attempt.
    select count(*) into v_denied
    from public.execution_logs l
    where l.event = 'denied'
      and l.created_at > now() - interval '1 hour'
      and (
        (v_user is null and l.user_id is null and l.ip_hash = p_ip_hash)
        or (v_user is not null and l.user_id = v_user)
      );
    if v_denied = 0 then
      insert into public.execution_logs (user_id, artifact_id, event, exit_reason, ip_hash)
      values (v_user, p_artifact_id, 'denied', 'denied', p_ip_hash);
    end if;
    return false;
  end if;

  insert into public.execution_logs (user_id, artifact_id, event, duration_ms, exit_reason, bytes_served, ip_hash)
  values (
    v_user,
    p_artifact_id,
    p_event,
    p_duration_ms,
    case when p_event = 'serve' then 'served' else p_exit_reason end,
    p_bytes_served,
    p_ip_hash
  );
  return true;
end;
$$;

revoke execute on function public.log_execution(text, text, integer, text, integer, text) from public;
grant execute on function public.log_execution(text, text, integer, text, integer, text) to anon, authenticated;

-- Retention (ADR-014: 30 days). Schedule this, e.g. with pg_cron:
--   delete from public.execution_logs where created_at < now() - interval '30 days';
