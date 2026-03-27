create table if not exists public.patient_feedback (
  id bigint generated always as identity primary key,
  respondent_type text not null,
  visit_timing text not null,
  visit_type text not null,
  service_area text not null,
  preferred_language text not null,
  doctor_care_rating smallint not null,
  staff_helpfulness_rating smallint not null,
  reception_rating smallint not null,
  waiting_time_rating smallint not null,
  cleanliness_rating smallint not null,
  overall_confidence_rating smallint not null,
  language_clarity_rating smallint not null,
  wayfinding_rating smallint not null,
  accessibility_support text not null default 'no',
  would_recommend text not null,
  what_went_well text,
  improvement_priority text,
  follow_up_requested boolean not null default false,
  respondent_name text,
  respondent_phone text,
  review_status text not null default 'New',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint patient_feedback_respondent_type_check check (respondent_type in ('patient', 'caregiver')),
  constraint patient_feedback_visit_timing_check check (visit_timing in ('today', 'this_week', 'this_month', 'earlier')),
  constraint patient_feedback_visit_type_check check (visit_type in ('outpatient', 'inpatient', 'lab', 'pharmacy', 'emergency', 'caregiver_support')),
  constraint patient_feedback_preferred_language_check check (preferred_language in ('en', 'hi', 'kn', 'other')),
  constraint patient_feedback_accessibility_support_check check (accessibility_support in ('no', 'some_help', 'major_help')),
  constraint patient_feedback_would_recommend_check check (would_recommend in ('yes', 'maybe', 'no')),
  constraint patient_feedback_review_status_check check (review_status in ('New', 'Reviewed', 'Follow-up Needed', 'Closed')),
  constraint patient_feedback_service_area_not_blank check (length(trim(service_area)) > 0),
  constraint patient_feedback_doctor_care_rating_check check (doctor_care_rating between 1 and 5),
  constraint patient_feedback_staff_helpfulness_rating_check check (staff_helpfulness_rating between 1 and 5),
  constraint patient_feedback_reception_rating_check check (reception_rating between 1 and 5),
  constraint patient_feedback_waiting_time_rating_check check (waiting_time_rating between 1 and 5),
  constraint patient_feedback_cleanliness_rating_check check (cleanliness_rating between 1 and 5),
  constraint patient_feedback_overall_confidence_rating_check check (overall_confidence_rating between 1 and 5),
  constraint patient_feedback_language_clarity_rating_check check (language_clarity_rating between 1 and 5),
  constraint patient_feedback_wayfinding_rating_check check (wayfinding_rating between 1 and 5)
);

alter table public.patient_feedback enable row level security;

grant insert on table public.patient_feedback to anon;
grant select, update on table public.patient_feedback to authenticated;

drop policy if exists patient_feedback_public_insert on public.patient_feedback;
create policy patient_feedback_public_insert
on public.patient_feedback
for insert
to anon
with check (true);

drop policy if exists patient_feedback_management_select on public.patient_feedback;
create policy patient_feedback_management_select
on public.patient_feedback
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

drop policy if exists patient_feedback_management_update on public.patient_feedback;
create policy patient_feedback_management_update
on public.patient_feedback
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

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    begin
      alter publication supabase_realtime add table public.patient_feedback;
    exception
      when duplicate_object then
        null;
    end;
  end if;
end $$;