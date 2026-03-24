create table if not exists public.management_alerts (
  id bigint generated always as identity primary key,
  alert_type text not null default 'reception_ping',
  created_by uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint management_alerts_type_check check (alert_type in ('reception_ping'))
);

create table if not exists public.management_alert_receipts (
  id bigint generated always as identity primary key,
  alert_id bigint not null references public.management_alerts(id) on delete cascade,
  manager_user_id uuid not null,
  shown_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint management_alert_receipts_unique unique (alert_id, manager_user_id)
);

alter table public.management_alerts enable row level security;
alter table public.management_alert_receipts enable row level security;

grant select, insert on table public.management_alerts to authenticated;
grant select, insert, update on table public.management_alert_receipts to authenticated;

drop policy if exists management_alerts_reception_insert on public.management_alerts;
create policy management_alerts_reception_insert
on public.management_alerts
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'receptionist'
  )
);

drop policy if exists management_alerts_management_select on public.management_alerts;
create policy management_alerts_management_select
on public.management_alerts
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

drop policy if exists management_alerts_reception_select_own on public.management_alerts;
create policy management_alerts_reception_select_own
on public.management_alerts
for select
to authenticated
using (
  created_by = auth.uid()
  and exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'receptionist'
  )
);

drop policy if exists management_alert_receipts_management_select on public.management_alert_receipts;
create policy management_alert_receipts_management_select
on public.management_alert_receipts
for select
to authenticated
using (
  manager_user_id = auth.uid()
  and exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'management'
  )
);

drop policy if exists management_alert_receipts_management_insert on public.management_alert_receipts;
create policy management_alert_receipts_management_insert
on public.management_alert_receipts
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

drop policy if exists management_alert_receipts_management_update on public.management_alert_receipts;
create policy management_alert_receipts_management_update
on public.management_alert_receipts
for update
to authenticated
using (
  manager_user_id = auth.uid()
  and exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'management'
  )
)
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
      alter publication supabase_realtime add table public.management_alerts;
    exception
      when duplicate_object then
        null;
    end;
  end if;
end $$;