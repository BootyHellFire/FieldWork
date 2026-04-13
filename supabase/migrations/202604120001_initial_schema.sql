create extension if not exists "pgcrypto";

create type public.user_role as enum ('boss', 'worker', 'admin');
create type public.job_status as enum ('planning', 'active', 'paused', 'completed');
create type public.task_priority as enum ('low', 'normal', 'high');
create type public.task_stage as enum ('rough', 'trim', 'finish', 'punch');
create type public.task_status as enum ('draft', 'approved', 'published', 'in_progress', 'completed');
create type public.plan_file_type as enum ('pdf', 'image');
create type public.photo_type as enum ('reference', 'completion');
create type public.queue_status as enum ('pending', 'processing', 'completed', 'failed');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'worker',
  email text not null unique,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.builders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.builders(id) on delete restrict,
  name text not null,
  address text not null,
  status public.job_status not null default 'planning',
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.job_members (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (job_id, user_id)
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  file_type public.plan_file_type not null,
  file_url text not null,
  page_count integer not null default 1,
  title text not null,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.plan_pages (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  page_number integer not null,
  image_preview_url text,
  width numeric,
  height numeric,
  created_at timestamptz not null default timezone('utc', now()),
  unique (plan_id, page_number)
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  plan_page_id uuid references public.plan_pages(id) on delete set null,
  name text not null,
  floor_name text,
  polygon_json jsonb,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (job_id, name)
);

create table public.walkthrough_sessions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  started_by uuid not null references public.users(id) on delete restrict,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  notes text,
  sync_status public.queue_status not null default 'pending'
);

create table public.walkthrough_segments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.walkthrough_sessions(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  assignee_user_id uuid references public.users(id) on delete set null,
  priority public.task_priority not null default 'normal',
  stage public.task_stage not null default 'rough',
  transcript_text text not null,
  transcript_start_ms integer not null default 0,
  transcript_end_ms integer not null default 0,
  audio_clip_url text,
  snapshot_image_url text,
  raw_ai_json jsonb,
  reviewed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  source_segment_id uuid references public.walkthrough_segments(id) on delete set null,
  assigned_to_user_id uuid references public.users(id) on delete set null,
  created_by_user_id uuid not null references public.users(id) on delete restrict,
  status public.task_status not null default 'draft',
  priority public.task_priority not null default 'normal',
  stage public.task_stage not null default 'rough',
  title text not null,
  description text not null,
  wall_reference text,
  device_type text,
  measurements_json jsonb,
  diagram_json jsonb,
  transcript_snippet text,
  source_photo_url text,
  ambiguity_flags_json jsonb,
  needs_review boolean not null default true,
  approved_at timestamptz,
  published_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  photo_url text not null,
  photo_type public.photo_type not null,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index jobs_builder_idx on public.jobs(builder_id);
create index job_members_job_idx on public.job_members(job_id);
create index job_members_user_idx on public.job_members(user_id);
create index plans_job_idx on public.plans(job_id);
create index rooms_job_idx on public.rooms(job_id, sort_order);
create index sessions_job_idx on public.walkthrough_sessions(job_id);
create index segments_session_idx on public.walkthrough_segments(session_id, created_at);
create index tasks_job_idx on public.tasks(job_id, status);
create index tasks_assignee_idx on public.tasks(assigned_to_user_id, status);
create index task_comments_task_idx on public.task_comments(task_id);
create index task_photos_task_idx on public.task_photos(task_id);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_users_updated_at before update on public.users
for each row execute procedure public.set_updated_at();

create trigger set_jobs_updated_at before update on public.jobs
for each row execute procedure public.set_updated_at();

create trigger set_rooms_updated_at before update on public.rooms
for each row execute procedure public.set_updated_at();

create trigger set_tasks_updated_at before update on public.tasks
for each row execute procedure public.set_updated_at();

create or replace function public.current_role(uid uuid)
returns public.user_role
language sql
stable
as $$
  select role from public.users where id = uid
$$;

create or replace function public.is_boss_or_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where id = uid
      and role in ('boss', 'admin')
      and active = true
  )
$$;

create or replace function public.is_job_member(uid uuid, lookup_job_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.job_members
    where user_id = uid
      and job_id = lookup_job_id
  )
$$;

create or replace function public.try_uuid(value text)
returns uuid
language plpgsql
immutable
as $$
begin
  return value::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create or replace function public.storage_job_id(object_name text)
returns uuid
language sql
immutable
as $$
  select public.try_uuid(nullif(split_part(object_name, '/', 1), ''));
$$;

create or replace function public.storage_task_id(object_name text)
returns uuid
language sql
immutable
as $$
  select public.try_uuid(nullif(split_part(object_name, '/', 1), ''));
$$;

alter table public.users enable row level security;
alter table public.builders enable row level security;
alter table public.jobs enable row level security;
alter table public.job_members enable row level security;
alter table public.plans enable row level security;
alter table public.plan_pages enable row level security;
alter table public.rooms enable row level security;
alter table public.walkthrough_sessions enable row level security;
alter table public.walkthrough_segments enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_photos enable row level security;
alter table public.notifications enable row level security;

create policy "users can read their own profile"
on public.users
for select
using (id = auth.uid() or public.is_boss_or_admin(auth.uid()));

create policy "boss admin manage builders"
on public.builders
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read jobs"
on public.jobs
for select
using (public.is_job_member(auth.uid(), id));

create policy "boss admin manage jobs"
on public.jobs
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read job members"
on public.job_members
for select
using (public.is_job_member(auth.uid(), job_id));

create policy "boss admin manage job members"
on public.job_members
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read plans"
on public.plans
for select
using (public.is_job_member(auth.uid(), job_id));

create policy "boss admin manage plans"
on public.plans
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read plan pages"
on public.plan_pages
for select
using (
  exists (
    select 1 from public.plans p
    where p.id = plan_id
      and public.is_job_member(auth.uid(), p.job_id)
  )
);

create policy "boss admin manage plan pages"
on public.plan_pages
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read rooms"
on public.rooms
for select
using (public.is_job_member(auth.uid(), job_id));

create policy "boss admin manage rooms"
on public.rooms
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read sessions"
on public.walkthrough_sessions
for select
using (public.is_job_member(auth.uid(), job_id));

create policy "boss admin manage sessions"
on public.walkthrough_sessions
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read segments"
on public.walkthrough_segments
for select
using (
  exists (
    select 1
    from public.walkthrough_sessions ws
    where ws.id = session_id
      and public.is_job_member(auth.uid(), ws.job_id)
  )
);

create policy "boss admin manage segments"
on public.walkthrough_segments
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "job members can read tasks"
on public.tasks
for select
using (
  public.is_job_member(auth.uid(), job_id)
  and (
    public.is_boss_or_admin(auth.uid())
    or assigned_to_user_id = auth.uid()
    or status in ('approved', 'published', 'in_progress', 'completed')
  )
);

create policy "boss admin manage tasks"
on public.tasks
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

create policy "workers can update limited task progress"
on public.tasks
for update
using (
  assigned_to_user_id = auth.uid()
  and status in ('approved', 'published', 'in_progress', 'completed')
)
with check (
  assigned_to_user_id = auth.uid()
  and status in ('approved', 'published', 'in_progress', 'completed')
);

create policy "job members can read task comments"
on public.task_comments
for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = task_id
      and public.is_job_member(auth.uid(), t.job_id)
  )
);

create policy "job members can insert task comments"
on public.task_comments
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.tasks t
    where t.id = task_id
      and public.is_job_member(auth.uid(), t.job_id)
  )
);

create policy "job members can read task photos"
on public.task_photos
for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = task_id
      and public.is_job_member(auth.uid(), t.job_id)
  )
);

create policy "workers and bosses can insert task photos"
on public.task_photos
for insert
with check (
  uploaded_by = auth.uid()
  and exists (
    select 1
    from public.tasks t
    where t.id = task_id
      and (
        public.is_boss_or_admin(auth.uid())
        or t.assigned_to_user_id = auth.uid()
      )
      and public.is_job_member(auth.uid(), t.job_id)
  )
);

create policy "users can read own notifications"
on public.notifications
for select
using (user_id = auth.uid());

create policy "boss admin manage notifications"
on public.notifications
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values
  ('plans', 'plans', false),
  ('plan-previews', 'plan-previews', false),
  ('snapshots', 'snapshots', false),
  ('audio-clips', 'audio-clips', false),
  ('task-completion-photos', 'task-completion-photos', false)
on conflict (id) do nothing;

create policy "job members can read plans bucket"
on storage.objects
for select
using (
  bucket_id in ('plans', 'plan-previews')
  and public.is_job_member(auth.uid(), public.storage_job_id(name))
);

create policy "boss admin manage plans bucket"
on storage.objects
for all
using (
  bucket_id in ('plans', 'plan-previews')
  and public.is_boss_or_admin(auth.uid())
)
with check (
  bucket_id in ('plans', 'plan-previews')
  and public.is_boss_or_admin(auth.uid())
);

create policy "job members can read walkthrough media"
on storage.objects
for select
using (
  bucket_id in ('snapshots', 'audio-clips')
  and public.is_job_member(auth.uid(), public.storage_job_id(name))
);

create policy "boss admin manage walkthrough media"
on storage.objects
for all
using (
  bucket_id in ('snapshots', 'audio-clips')
  and public.is_boss_or_admin(auth.uid())
)
with check (
  bucket_id in ('snapshots', 'audio-clips')
  and public.is_boss_or_admin(auth.uid())
);

create policy "job members can read completion photos"
on storage.objects
for select
using (
  bucket_id = 'task-completion-photos'
  and exists (
    select 1
    from public.tasks t
    where t.id = public.storage_task_id(name)
      and public.is_job_member(auth.uid(), t.job_id)
  )
);

create policy "workers and bosses can add completion photos"
on storage.objects
for insert
with check (
  bucket_id = 'task-completion-photos'
  and owner = auth.uid()
  and exists (
    select 1
    from public.tasks t
    where t.id = public.storage_task_id(name)
      and (
        public.is_boss_or_admin(auth.uid())
        or t.assigned_to_user_id = auth.uid()
      )
      and public.is_job_member(auth.uid(), t.job_id)
  )
);
