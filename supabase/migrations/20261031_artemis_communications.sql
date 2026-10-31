-- Execute in the project's authorized Supabase SQL editor before enabling public intake.
create table if not exists public.artemis_communications (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 category text not null check (length(category) between 1 and 100),
 sender_name text not null check (length(sender_name) between 1 and 120),
 sender_email text not null check (length(sender_email) between 3 and 254),
 message text not null check (length(message) between 10 and 4000),
 notification_status text not null default 'pending',
 notification_error text,
 reply_status text not null default 'new'
);
alter table public.artemis_communications enable row level security;
-- No public SELECT, INSERT, UPDATE or DELETE policies. Server-only service role.
create index if not exists artemis_communications_created_at_idx on public.artemis_communications (created_at desc);
