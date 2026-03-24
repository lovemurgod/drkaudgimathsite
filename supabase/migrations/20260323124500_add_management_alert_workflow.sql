alter table public.management_alert_receipts
  add column if not exists status text not null default 'New',
  add column if not exists status_updated_at timestamptz not null default timezone('utc', now()),
  add column if not exists last_viewed_at timestamptz;

alter table public.management_alert_receipts
  drop constraint if exists management_alert_receipts_status_check;

alter table public.management_alert_receipts
  add constraint management_alert_receipts_status_check
  check (status in ('New', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'));

update public.management_alert_receipts
set
  status = case
    when dismissed_at is not null then 'Acknowledged'
    else coalesce(nullif(trim(status), ''), 'New')
  end,
  status_updated_at = coalesce(status_updated_at, updated_at, created_at, timezone('utc', now())),
  last_viewed_at = coalesce(last_viewed_at, shown_at)
where status is distinct from case
  when dismissed_at is not null then 'Acknowledged'
  else coalesce(nullif(trim(status), ''), 'New')
end
or status_updated_at is null
or last_viewed_at is null;

create table if not exists public.management_alert_comments (
  id bigint generated always as identity primary key,
  alert_id bigint not null references public.management_alerts(id) on delete cascade,
  manager_user_id uuid not null,
  note text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint management_alert_comments_note_not_blank check (length(trim(note)) > 0)
);

alter table public.management_alert_comments enable row level security;

grant select, insert on table public.management_alert_comments to authenticated;

drop policy if exists management_alert_comments_management_select on public.management_alert_comments;
create policy management_alert_comments_management_select
on public.management_alert_comments
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'management'
  )
);

drop policy if exists management_alert_comments_management_insert on public.management_alert_comments;
create policy management_alert_comments_management_insert
on public.management_alert_comments
for insert
to authenticated
with check (
  manager_user_id = auth.uid()
  and exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'management'
  )
);

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    begin
      alter publication supabase_realtime add table public.management_alert_receipts;
    exception
      when duplicate_object then
        null;
    end;

    begin
      alter publication supabase_realtime add table public.management_alert_comments;
    exception
      when duplicate_object then
        null;
    end;
  end if;
end $$;