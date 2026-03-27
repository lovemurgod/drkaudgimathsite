grant insert on table public.complaints to authenticated;

drop policy if exists complaints_authenticated_insert on public.complaints;
create policy complaints_authenticated_insert
on public.complaints
for insert
to authenticated
with check (true);