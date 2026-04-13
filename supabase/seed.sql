insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mason@fieldwork.demo', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mason Reed"}', now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jake@fieldwork.demo', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Jake Mercer"}', now(), now()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carson@fieldwork.demo', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Carson Vale"}', now(), now())
on conflict (id) do nothing;

insert into public.users (id, full_name, role, email, phone, active)
values
  ('00000000-0000-0000-0000-000000000001', 'Mason Reed', 'boss', 'mason@fieldwork.demo', '555-1000', true),
  ('00000000-0000-0000-0000-000000000002', 'Jake Mercer', 'worker', 'jake@fieldwork.demo', '555-2000', true),
  ('00000000-0000-0000-0000-000000000003', 'Carson Vale', 'worker', 'carson@fieldwork.demo', '555-3000', true)
on conflict (id) do nothing;

insert into public.builders (id, name, contact_name, notes)
values
  ('10000000-0000-0000-0000-000000000001', 'Bennett Custom Homes', 'Lauren Bennett', 'Call before final trim changes.')
on conflict (id) do nothing;

insert into public.jobs (id, builder_id, name, address, status, start_date, notes)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Bennett Residence', '1417 Cottonwood Ridge, Boise, ID', 'active', '2026-04-01', 'High-end custom home. Focus on trim corrections before cabinet install.')
on conflict (id) do nothing;

insert into public.job_members (id, job_id, user_id, role)
values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'boss'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'worker'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'worker')
on conflict (job_id, user_id) do nothing;

insert into public.plans (id, job_id, file_type, file_url, page_count, title, uploaded_by)
values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'pdf', '20000000-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000001/electrical-set-a3.pdf', 2, 'Electrical Set A3', '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.plan_pages (id, plan_id, page_number, image_preview_url, width, height)
values
  ('41000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 1, '20000000-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000001/1.jpg', 2400, 1800),
  ('41000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 2, '20000000-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000001/2.jpg', 2400, 1800)
on conflict (id) do nothing;

insert into public.rooms (id, job_id, plan_page_id, name, floor_name, notes, sort_order)
values
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000001', 'Kitchen', 'Main', 'Island pendants and appliance wall.', 1),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000001', 'Downstairs Bathroom', 'Main', 'Vanity, mirror heat, toe-kick outlet.', 2),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000002', 'Garage', 'Main', 'EV charger and bench outlets.', 3)
on conflict (id) do nothing;

insert into public.walkthrough_sessions (id, job_id, started_by, started_at, notes, sync_status)
values
  ('60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026-04-12T09:00:00Z', 'Trim walkthrough with vanity corrections.', 'completed')
on conflict (id) do nothing;

insert into public.walkthrough_segments (id, session_id, room_id, assignee_user_id, priority, stage, transcript_text, transcript_start_ms, transcript_end_ms, snapshot_image_url, raw_ai_json, reviewed)
values
  (
    '70000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'high',
    'trim',
    'Carson, move this vanity light up to 52 and a half inches to center from finished floor and keep it centered over the sink. This is high priority trim.',
    0,
    12000,
    '20000000-0000-0000-0000-000000000001/60000000-0000-0000-0000-000000000001/70000000-0000-0000-0000-000000000001/vanity.jpg',
    '{"should_create_task":true,"assignee_name":"Carson Vale","task_title":"Raise vanity light to 52.5 inches AFF","task_description":"Move the downstairs bathroom vanity light so centerline lands 52.5 inches above finished floor and keep it centered over the sink.","room_name":"Downstairs Bathroom","wall_reference":"Vanity wall","device_type":"vanity light","action":"move","measurements":{"height_from_finished_floor_inches":52.5,"centered_on":"sink","notes":"to center"},"stage":"trim","priority":"high","ambiguity_flags":[],"confidence_score":0.96}',
    false
  )
on conflict (id) do nothing;

insert into public.tasks (id, job_id, room_id, source_segment_id, assigned_to_user_id, created_by_user_id, status, priority, stage, title, description, wall_reference, device_type, measurements_json, diagram_json, transcript_snippet, source_photo_url, ambiguity_flags_json, needs_review, approved_at, published_at, completed_at)
values
  (
    '80000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000002',
    '70000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'published',
    'high',
    'trim',
    'Raise vanity light to 52.5 inches AFF',
    'Move vanity light so the fixture center lands 52.5 inches above finished floor and stays centered over the sink.',
    'Vanity wall',
    'vanity light',
    '{"height_from_finished_floor_inches":52.5,"centered_on":"sink","notes":"to center"}',
    '{"wallLabel":"Vanity wall","floorLabel":"Finished floor","deviceLabel":"Vanity light","dimensions":[{"label":"52.5\" AFF","position":"vertical"},{"label":"Centered on sink","position":"center"}]}',
    'Move this vanity light up to 52 and a half inches to center from finished floor and keep it centered over the sink.',
    '20000000-0000-0000-0000-000000000001/60000000-0000-0000-0000-000000000001/70000000-0000-0000-0000-000000000001/vanity.jpg',
    '[]',
    false,
    '2026-04-12T09:15:00Z',
    '2026-04-12T09:20:00Z',
    null
  )
on conflict (id) do nothing;

insert into public.task_photos (id, task_id, photo_url, photo_type, uploaded_by, created_at)
values
  ('85000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001/80000000-0000-0000-0000-000000000001/reference.jpg', 'reference', '00000000-0000-0000-0000-000000000001', '2026-04-12T09:12:00Z')
on conflict (id) do nothing;

insert into public.task_comments (id, task_id, user_id, comment)
values
  ('90000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Need confirmation if the mirror height changed too.')
on conflict (id) do nothing;

insert into public.notifications (id, user_id, type, title, body)
values
  ('91000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'task_assigned', 'New trim task assigned', 'Raise vanity light to 52.5 inches AFF in the downstairs bathroom.')
on conflict (id) do nothing;
