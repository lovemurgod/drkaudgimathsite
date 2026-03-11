alter table if exists public.staff_profiles
  drop constraint if exists staff_profiles_role_check;

alter table if exists public.staff_profiles
  drop constraint if exists staff_profiles_role_doctor_check;

alter table if exists public.staff_profiles
  drop constraint if exists staff_profiles_role_assignment_check;

alter table if exists public.staff_profiles
  add constraint staff_profiles_role_check
  check (role in ('receptionist', 'doctor', 'management'));

alter table if exists public.staff_profiles
  add constraint staff_profiles_role_assignment_check
  check (
    (role = 'doctor' and doctor_id is not null and length(trim(doctor_id)) > 0)
    or (role = 'receptionist' and doctor_id is null)
    or (role = 'management' and doctor_id is null)
  );

create table if not exists public.complaints (
  id bigint generated always as identity primary key,
  reporter_name text,
  reporter_phone text,
  reporter_email text,
  incident_date date not null,
  incident_time time without time zone not null,
  incident_nature text not null,
  incident_details text not null,
  status text not null default 'New',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint complaints_incident_nature_not_blank check (length(trim(incident_nature)) > 0),
  constraint complaints_incident_details_not_blank check (length(trim(incident_details)) > 0),
  constraint complaints_status_check check (status in ('New', 'Investigating', 'Resolved', 'Rejected'))
);

alter table public.complaints enable row level security;

grant insert on table public.complaints to anon;
grant select, update on table public.complaints to authenticated;

drop policy if exists complaints_public_insert on public.complaints;
create policy complaints_public_insert
on public.complaints
for insert
to anon
with check (true);

drop policy if exists complaints_management_select on public.complaints;
create policy complaints_management_select
on public.complaints
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

drop policy if exists complaints_management_update on public.complaints;
create policy complaints_management_update
on public.complaints
for update
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'management'
  )
)
with check (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'management'
  )
);