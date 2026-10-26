-- R4: restricted membership lookup; private schema stays outside PostgREST exposed schemas.
grant usage on schema tax_private to authenticated;
grant select on tax_private.clients, tax_private.memberships, tax_private.evidence_manifest to authenticated;
revoke all on all tables in schema tax_private from anon;
create policy tax_memberships_self_read on tax_private.memberships
  for select to authenticated using (user_id = (select auth.uid()));
create policy tax_clients_member_read on tax_private.clients
  for select to authenticated using (
    exists (select 1 from tax_private.memberships m
            where m.client_id = id and m.user_id = (select auth.uid()))
  );
create policy tax_evidence_member_read on tax_private.evidence_manifest
  for select to authenticated using (
    exists (select 1 from tax_private.memberships m
            where m.client_id = evidence_manifest.client_id and m.user_id = (select auth.uid()))
  );
-- A narrow, invoker-rights RPC is the only exposed membership read surface.
create or replace function public.tax_my_client_ids()
returns table(client_id text)
language sql stable security invoker set search_path = ''
as $$
  select m.client_id from tax_private.memberships m
  where m.user_id = (select auth.uid())
  order by m.client_id
$$;
revoke all on function public.tax_my_client_ids() from public, anon;
grant execute on function public.tax_my_client_ids() to authenticated;
