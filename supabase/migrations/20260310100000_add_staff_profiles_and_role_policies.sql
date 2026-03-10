create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('receptionist', 'doctor')),
  doctor_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint staff_profiles_role_doctor_check check (
    (role = 'doctor' and doctor_id is not null and length(trim(doctor_id)) > 0)
    or (role = 'receptionist' and doctor_id is null)
  )
);

alter table public.staff_profiles enable row level security;
alter table public.appointments enable row level security;

grant select on table public.staff_profiles to authenticated;
grant select, insert, update on table public.appointments to authenticated;
grant insert on table public.appointments to anon;

drop policy if exists staff_profiles_self_select on public.staff_profiles;
create policy staff_profiles_self_select
on public.staff_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists appointments_public_insert on public.appointments;
create policy appointments_public_insert
on public.appointments
for insert
to anon
with check (true);

drop policy if exists appointments_receptionist_select on public.appointments;
create policy appointments_receptionist_select
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'receptionist'
  )
);

drop policy if exists appointments_doctor_select_own on public.appointments;
create policy appointments_doctor_select_own
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'doctor'
      and sp.doctor_id = public.appointments.doctor_id::text
  )
);

drop policy if exists appointments_receptionist_insert on public.appointments;
create policy appointments_receptionist_insert
on public.appointments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'receptionist'
  )
);

drop policy if exists appointments_receptionist_update on public.appointments;
create policy appointments_receptionist_update
on public.appointments
for update
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'receptionist'
  )
)
with check (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'receptionist'
  )
);

drop policy if exists appointments_doctor_update_own on public.appointments;
create policy appointments_doctor_update_own
on public.appointments
for update
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'doctor'
      and sp.doctor_id = public.appointments.doctor_id::text
  )
)
with check (
  exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = auth.uid()
      and sp.role = 'doctor'
      and sp.doctor_id = public.appointments.doctor_id::text
  )
);
