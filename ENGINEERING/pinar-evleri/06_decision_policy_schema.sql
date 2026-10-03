-- 06_decision_policy_schema.sql
-- Pınar Evleri Operations MVP
-- F2.5A: configurable, versioned hospitality decision-policy layer
--
-- Purpose:
--   Separate stable reservation constraints from changeable business policy.
--   Rules can evolve by configuration/version without rewriting the core engine.
--   This migration does NOT change reservation behavior yet.

create table public.decision_policy_profiles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_default_decision_policy_profile
  on public.decision_policy_profiles ((is_default))
  where is_default = true;

create table public.decision_policy_versions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.decision_policy_profiles(id) on delete cascade,
  version_no integer not null check (version_no >= 1),
  status text not null default 'draft' check (status in ('draft','active','retired')),
  effective_from timestamptz,
  effective_to timestamptz,
  change_note text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint decision_policy_version_window_valid check (effective_to is null or effective_from is null or effective_to > effective_from),
  constraint decision_policy_versions_unique unique (profile_id, version_no)
);

create unique index one_active_version_per_decision_profile
  on public.decision_policy_versions (profile_id)
  where status = 'active';

create table public.decision_rule_definitions (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  category text not null check (category in ('constraint','preference','scoring','pricing','exception','feature')),
  value_type text not null check (value_type in ('boolean','integer','numeric','text','json')),
  description text not null,
  is_hard_rule boolean not null default false,
  default_value jsonb,
  validation_spec jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.decision_policy_values (
  id uuid primary key default gen_random_uuid(),
  policy_version_id uuid not null references public.decision_policy_versions(id) on delete cascade,
  rule_id uuid not null references public.decision_rule_definitions(id) on delete restrict,
  value jsonb not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  constraint decision_policy_value_unique unique (policy_version_id, rule_id)
);

create index idx_decision_policy_values_version on public.decision_policy_values (policy_version_id);
create index idx_decision_policy_values_rule on public.decision_policy_values (rule_id);

create table public.environment_feature_flags (
  id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('demo','staging','production')),
  flag_key text not null,
  description text,
  is_enabled boolean not null default false,
  rollout_percent integer not null default 100 check (rollout_percent between 0 and 100),
  configuration jsonb,
  updated_at timestamptz not null default now(),
  constraint environment_feature_flag_unique unique (environment, flag_key)
);

comment on table public.decision_policy_profiles is 'Named decision profiles such as Guest First, Revenue Optimized, Inventory Optimized, or Peak Season.';
comment on table public.decision_policy_versions is 'Versioned decision-policy snapshots. Recommendations can reference the exact policy version used.';
comment on table public.decision_rule_definitions is 'Stable registry of configurable decision rules. is_hard_rule distinguishes non-negotiable constraints from business preferences.';
comment on table public.decision_policy_values is 'Rule values for a specific policy version. Live policy changes should create a new version rather than overwrite history.';
comment on table public.environment_feature_flags is 'Environment-scoped feature switches so demo, staging and production can enable capabilities independently.';

insert into public.decision_rule_definitions (rule_key,category,value_type,description,is_hard_rule,default_value,validation_spec)
values
('capacity.hard_max_must_not_be_exceeded','constraint','boolean','Never recommend or create occupancy above the unit hard maximum capacity.',true,'true'::jsonb,'{"allowed":[true]}'::jsonb),
('inventory.double_booking_forbidden','constraint','boolean','Never assign overlapping blocking reservations to the same unit.',true,'true'::jsonb,'{"allowed":[true]}'::jsonb),
('recommendation.allow_split_stay','preference','boolean','Allow the recommender to consider moving guests between units during one booking group.',false,'true'::jsonb,null),
('recommendation.allow_date_shift_days','preference','integer','Maximum number of days earlier/later that the engine may search when inquiry dates are flexible.',false,'1'::jsonb,'{"min":0,"max":7}'::jsonb),
('recommendation.max_house_moves','preference','integer','Maximum house changes allowed in a generated itinerary.',false,'1'::jsonb,'{"min":0,"max":5}'::jsonb),
('recommendation.allow_capacity_exception','exception','boolean','Allow controlled occupancy above base capacity when unit configuration permits it and approvals are satisfied.',false,'false'::jsonb,null),
('recommendation.manager_approval_for_capacity_exception','exception','boolean','Require manager approval before confirming a capacity-exception itinerary.',false,'true'::jsonb,null),
('recommendation.guest_acceptance_for_capacity_exception','exception','boolean','Require explicit guest acceptance of extra-bed/capacity-exception conditions.',false,'true'::jsonb,null),
('score.exact_date_match','scoring','numeric','Score contribution for matching requested dates exactly.',false,'20'::jsonb,'{"min":-100,"max":100}'::jsonb),
('score.single_unit','scoring','numeric','Score contribution for satisfying the full stay in one unit.',false,'25'::jsonb,'{"min":-100,"max":100}'::jsonb),
('score.house_move','scoring','numeric','Score contribution per required house move; normally negative.',false,'-15'::jsonb,'{"min":-100,"max":100}'::jsonb),
('score.extra_bed','scoring','numeric','Score contribution when an extra sleeping arrangement is required; normally negative.',false,'-5'::jsonb,'{"min":-100,"max":100}'::jsonb),
('score.split_same_night','scoring','numeric','Score contribution when one night must be split across multiple houses; normally negative.',false,'-20'::jsonb,'{"min":-100,"max":100}'::jsonb),
('score.fills_inventory_gap','scoring','numeric','Score contribution when a candidate efficiently fills a difficult inventory gap.',false,'10'::jsonb,'{"min":-100,"max":100}'::jsonb),
('score.creates_inventory_gap','scoring','numeric','Score contribution when a candidate creates a difficult stranded gap; normally negative.',false,'-10'::jsonb,'{"min":-100,"max":100}'::jsonb)
on conflict (rule_key) do nothing;

insert into public.decision_policy_profiles (code,name,description,is_active,is_default)
values ('guest_first','Guest First','Initial explainable profile prioritizing guest convenience while preserving hard safety and inventory constraints.',true,true)
on conflict (code) do nothing;

with p as (select id from public.decision_policy_profiles where code='guest_first')
insert into public.decision_policy_versions (profile_id,version_no,status,effective_from,change_note)
select p.id,1,'active',now(),'Initial Pınar Evleri Demo decision-policy baseline.' from p
where not exists (select 1 from public.decision_policy_versions v where v.profile_id=p.id and v.version_no=1);

with pv as (
  select v.id from public.decision_policy_versions v join public.decision_policy_profiles p on p.id=v.profile_id
  where p.code='guest_first' and v.version_no=1
), rules as (
  select id,default_value from public.decision_rule_definitions where default_value is not null
)
insert into public.decision_policy_values (policy_version_id,rule_id,value,is_enabled)
select pv.id,rules.id,rules.default_value,true from pv cross join rules
on conflict (policy_version_id,rule_id) do nothing;

insert into public.environment_feature_flags (environment,flag_key,description,is_enabled,rollout_percent,configuration)
values
('demo','decision_engine_v1','Enable development of the configurable recommendation engine in the synthetic demo environment.',true,100,'{"mode":"recommendation_only"}'::jsonb),
('demo','capacity_exception_recommendations','Allow the demo recommender to show capacity-exception candidates after unit-specific rules are implemented.',false,100,'{"requires_manager_approval":true,"requires_guest_acceptance":true}'::jsonb),
('demo','split_stay_recommendations','Allow generation of linked multi-unit itinerary recommendations.',false,100,'{"auto_create":false}'::jsonb),
('staging','decision_engine_v1','Client-review decision engine.',false,0,null),
('production','decision_engine_v1','Production decision engine; remains disabled until explicit human/client approval.',false,0,null)
on conflict (environment,flag_key) do nothing;
