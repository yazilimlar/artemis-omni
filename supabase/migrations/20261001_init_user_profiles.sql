-- ---------------------------------------------------------------------------
-- 20261001_init_user_profiles.sql  (ADR-012)
--
-- Creates public.user_profiles: one row per Supabase Auth user, holding the
-- role used by /dashboard. This file is the source of truth for reproducibility.
--
-- APPLY MANUALLY (AI tools hold no database credentials, ADR-004). Either:
--   (a) paste this file into the Supabase dashboard SQL Editor and Run, or
--   (b) Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`.
--
-- Security model:
--   * RLS on; authenticated users can SELECT their own row only.
--   * Authenticated users can UPDATE their own row, and only `display_name`
--     (column privileges). `role` is never user-writable, so nobody can promote
--     themselves; the owner assigns roles via the SQL Editor or service role.
--   * anon has no access. service_role bypasses RLS (Supabase default).
--
-- Make yourself owner after applying (replace the placeholder):
--   update public.user_profiles set role = 'owner' where email = '<your-email>';
-- ---------------------------------------------------------------------------

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'viewer'
    check (role in ('owner', 'admin', 'client', 'viewer')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Privileges: no anon access; authenticated may read, and may update display_name only.
revoke all on table public.user_profiles from anon, authenticated;
grant select on table public.user_profiles to authenticated;
grant update (display_name) on table public.user_profiles to authenticated;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
  on public.user_profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
  on public.user_profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- New auth user -> profile row with the default role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at current.
create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_updated_at on public.user_profiles;
create trigger update_updated_at
  before update on public.user_profiles
  for each row execute function public.update_updated_at();

-- Backfill users created before this migration (the trigger only sees new inserts).
insert into public.user_profiles (id, email, role)
select u.id, coalesce(u.email, ''), 'viewer'
from auth.users as u
on conflict (id) do nothing;
