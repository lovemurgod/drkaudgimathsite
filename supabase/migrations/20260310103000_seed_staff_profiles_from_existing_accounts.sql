do $$
declare
  doctor_email_col text;
  doctor_id_col text;
  admin_email_col text;
  inserted_doctors integer := 0;
  inserted_receptionists integer := 0;
begin
  if to_regclass('public.staff_profiles') is null then
    raise exception 'Table public.staff_profiles does not exist. Apply role migration first.';
  end if;

  select c.column_name
  into doctor_email_col
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'doctors'
    and c.column_name in ('email', 'doctor_email')
  order by case c.column_name
    when 'email' then 1
    when 'doctor_email' then 2
    else 99
  end
  limit 1;

  select c.column_name
  into doctor_id_col
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'doctors'
    and c.column_name in ('id', 'doctor_id')
  order by case c.column_name
    when 'id' then 1
    when 'doctor_id' then 2
    else 99
  end
  limit 1;

  if doctor_email_col is not null and doctor_id_col is not null then
    execute format($sql$
      with src as (
        select au.id as user_id, d.%1$I::text as doctor_id
        from auth.users au
        join public.doctors d
          on lower(coalesce(au.email, '')) = lower(coalesce(d.%2$I::text, ''))
        where coalesce(au.email, '') <> ''
      ), ins as (
        insert into public.staff_profiles (user_id, role, doctor_id)
        select src.user_id, 'doctor', src.doctor_id
        from src
        on conflict (user_id) do update
          set role = excluded.role,
              doctor_id = excluded.doctor_id,
              updated_at = timezone('utc', now())
        returning 1
      )
      select count(*)::int from ins
    $sql$, doctor_id_col, doctor_email_col)
    into inserted_doctors;
  else
    raise notice 'Skipping doctor auto-map: doctors table does not expose email + id columns expected by migration.';
  end if;

  select c.column_name
  into admin_email_col
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'admins'
    and c.column_name in ('email', 'admin_email')
  order by case c.column_name
    when 'email' then 1
    when 'admin_email' then 2
    else 99
  end
  limit 1;

  if admin_email_col is not null then
    execute format($sql$
      with src as (
        select au.id as user_id
        from auth.users au
        join public.admins a
          on lower(coalesce(au.email, '')) = lower(coalesce(a.%1$I::text, ''))
        where coalesce(au.email, '') <> ''
      ), filtered as (
        select src.user_id
        from src
        where not exists (
          select 1
          from public.staff_profiles sp
          where sp.user_id = src.user_id
            and sp.role = 'doctor'
        )
      ), ins as (
        insert into public.staff_profiles (user_id, role, doctor_id)
        select filtered.user_id, 'receptionist', null
        from filtered
        on conflict (user_id) do update
          set role = excluded.role,
              doctor_id = null,
              updated_at = timezone('utc', now())
        returning 1
      )
      select count(*)::int from ins
    $sql$, admin_email_col)
    into inserted_receptionists;
  else
    raise notice 'Skipping receptionist auto-map: admins table does not expose email/admin_email column.';
  end if;

  raise notice 'staff_profiles upsert completed. doctors=% receptionists=%', inserted_doctors, inserted_receptionists;
end
$$;
