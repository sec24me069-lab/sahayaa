create type public.app_role as enum ('admin','official','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','official'))
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  applicant_email text,
  scheme_slug text not null,
  status text not null default 'planning' check (status in ('planning','submitted','under_review','approved','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "owner or staff read" on public.applications for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "owner insert" on public.applications for insert to authenticated with check (user_id = auth.uid());
create policy "owner or staff update" on public.applications for update to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "owner delete" on public.applications for delete to authenticated using (user_id = auth.uid());

create table public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  name text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.application_documents to authenticated;
grant all on public.application_documents to service_role;
alter table public.application_documents enable row level security;
create policy "docs read" on public.application_documents for select to authenticated using (exists (select 1 from public.applications a where a.id = application_id and (a.user_id = auth.uid() or public.is_staff(auth.uid()))));
create policy "docs write owner" on public.application_documents for all to authenticated using (exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())) with check (exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid()));

create table public.application_messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  sender_id uuid not null default auth.uid(),
  from_official boolean not null default false,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
grant select, insert on public.application_messages to authenticated;
grant all on public.application_messages to service_role;
alter table public.application_messages enable row level security;
create policy "msg read" on public.application_messages for select to authenticated using (exists (select 1 from public.applications a where a.id = application_id and (a.user_id = auth.uid() or public.is_staff(auth.uid()))));
create policy "msg insert" on public.application_messages for insert to authenticated with check (
  sender_id = auth.uid() and (
    (from_official = false and exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid()))
    or (from_official = true and public.is_staff(auth.uid()))
  ));

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid(),
  event_type text not null check (event_type in ('assessment_started','assessment_completed','matches_generated')),
  match_count int,
  created_at timestamptz not null default now()
);
grant insert on public.activity_events to anon, authenticated;
grant select on public.activity_events to authenticated;
grant all on public.activity_events to service_role;
alter table public.activity_events enable row level security;
create policy "anyone log" on public.activity_events for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());
create policy "staff read events" on public.activity_events for select to authenticated using (public.is_staff(auth.uid()));

alter publication supabase_realtime add table public.application_messages;