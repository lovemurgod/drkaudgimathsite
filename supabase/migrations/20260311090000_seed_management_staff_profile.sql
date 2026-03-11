do $$
declare
  management_email constant text := 'management@staff.local';
  management_username constant text := 'management';
  management_user_id uuid;
  has_username_column boolean := false;
begin
  if to_regclass('public.staff_profiles') is null then
    raise exception 'Table public.staff_profiles does not exist. Apply role migration first.';
  end if;

  select exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'staff_profiles'
      and c.column_name = 'username'
  )
  into has_username_column;

  select au.id
  into management_user_id
  from auth.users au
  where lower(coalesce(au.email, '')) = lower(management_email)
  order by au.created_at asc
  limit 1;

  if management_user_id is null then
    raise notice 'No auth user found for %, skipping management profile seed.', management_email;
    return;
  end if;

  if has_username_column then
    insert into public.staff_profiles (user_id, role, doctor_id, username)
    values (management_user_id, 'management', null, management_username)
    on conflict (user_id) do update
      set role = 'management',
          doctor_id = null,
          username = excluded.username,
          updated_at = timezone('utc', now());
  else
    insert into public.staff_profiles (user_id, role, doctor_id)
    values (management_user_id, 'management', null)
    on conflict (user_id) do update
      set role = 'management',
          doctor_id = null,
          updated_at = timezone('utc', now());
  end if;

  raise notice 'Management staff profile upsert completed for %.', management_email;
end
$$;
