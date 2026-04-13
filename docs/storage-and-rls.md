# Storage Buckets and RLS Plan

## Buckets

### `plans`

- original plan PDFs and images
- uploaders: boss/admin
- readers: job members
- recommended path: `<job_id>/<plan_id>/<filename>`

### `plan-previews`

- rendered preview images for plan pages
- writers: server-side jobs or boss/admin workflows
- readers: job members
- recommended path: `<job_id>/<plan_id>/<page_number>.jpg`

### `snapshots`

- walkthrough reference photos
- uploaders: boss/admin during walkthrough
- readers: job members attached to the task/job
- recommended path: `<job_id>/<session_id>/<segment_id>/<filename>.jpg`

### `task-completion-photos`

- worker completion photos
- uploaders: assigned worker, boss, admin
- readers: job members
- recommended path: `<task_id>/<filename>.jpg`

### `audio-clips`

- optional recorded audio chunks
- uploaders: boss/admin
- readers: boss/admin only in V1
- recommended path: `<job_id>/<session_id>/<segment_id>/<filename>.m4a`

## RLS examples

### Boss/admin full job access

```sql
create policy "boss admin manage jobs"
on public.jobs
for all
using (public.is_boss_or_admin(auth.uid()))
with check (public.is_boss_or_admin(auth.uid()));
```

### Worker reads assigned tasks

```sql
create policy "workers can read assigned tasks"
on public.tasks
for select
using (
  public.is_job_member(auth.uid(), job_id)
  and (
    assigned_to_user_id = auth.uid()
    or public.is_boss_or_admin(auth.uid())
  )
);
```

### Worker comments on visible task

```sql
create policy "workers comment on visible tasks"
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
```

### Storage access pattern

The storage policies in the migration follow the same idea as the table policies:

- job-scoped buckets use the first path segment as `job_id`
- task photo buckets use the first path segment as `task_id`
- workers can only upload completion photos to tasks they are allowed to see
- snapshot and plan uploads stay private instead of using public buckets

## Practical beginner note

For your first launch, start with the SQL policies in the migration file and keep all file uploads routed through the app using the signed-in user. That makes permission bugs much easier to understand.
