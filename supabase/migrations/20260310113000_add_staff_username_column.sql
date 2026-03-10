alter table public.staff_profiles
  add column if not exists username text;

create unique index if not exists staff_profiles_username_unique_idx
  on public.staff_profiles (lower(username))
  where username is not null;

alter table public.staff_profiles
  drop constraint if exists staff_profiles_username_format_check;

alter table public.staff_profiles
  add constraint staff_profiles_username_format_check
  check (
    username is null
    or username ~ '^[a-z0-9]{3,30}$'
  );
