# Management Account Setup

This project now supports a `management` role for complaint workflow in `/admin`.

## What is already in code

- Role support and complaint workflow:
  - `js/admin.js`
  - `admin.html`
- Complaint schema and policies:
  - `supabase/migrations/20260310143000_add_complaints_management_workflow.sql`
- Management profile auto-seed (when auth user exists):
  - `supabase/migrations/20260311090000_seed_management_staff_profile.sql`

## Important

The file `staff_credentials_simple_20260310.csv` is ignored by git (`*credentials*.csv` in `.gitignore`).
Treat it as local operational data, not source-controlled config.

## Provisioning steps

1. Create Auth user in Supabase:
   - Email: `management@staff.local`
   - Password: `98021473`

2. Apply migrations (or re-run the management seed migration if migrations were already applied before creating the auth user):

```sql
-- Re-run seed manually if needed
-- (safe/idempotent)
\i supabase/migrations/20260311090000_seed_management_staff_profile.sql
```

3. Verify profile row exists:

```sql
select user_id, role, doctor_id, username
from public.staff_profiles
where role = 'management';
```

4. Login at `/admin` with either:
   - Username: `management`
   - or Email: `management@staff.local`

## Expected behavior

- Management sees complaint list/workflow in admin.
- Management can update complaint status.
- Receptionist and doctor do not get complaint status update workflow.
