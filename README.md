# FieldWork V1

FieldWork is an Expo + Supabase mobile app for high-end residential electrical walkthroughs. A foreman walks a job once, talks naturally, captures snapshots, and reviews AI-extracted tasks before workers ever see them.

This starter is intentionally practical:
- mobile-first
- plain UI
- Expo managed workflow
- Supabase-friendly schema and policies
- OpenAI extraction contracts
- offline-safe walkthrough queue

## What is already in this repo

- Expo Router app scaffold in [app](/Users/jake/Documents/New%20project/app)
- feature code in [src](/Users/jake/Documents/New%20project/src)
- Supabase SQL and seed data in [supabase](/Users/jake/Documents/New%20project/supabase)
- architecture and product docs in [docs](/Users/jake/Documents/New%20project/docs)

The app is built so it can open in demo mode even before Supabase is connected. That makes first-time setup much less stressful.

## Lowest-cost setup choices

- Expo managed app: lowest friction for your first mobile app
- Supabase free tier friendly:
  - Postgres database
  - Auth
  - Storage buckets
  - Realtime only for task updates
  - 1 Edge Function for extraction
- No LiDAR
- No automatic measuring
- No CAD/BIM integrations
- No enterprise admin layer

## How Expo and Supabase work together

This is the simplest mental model:

1. Expo is the phone app itself
   It shows the screens, camera, buttons, task lists, and forms.
2. Supabase is the online backend
   It stores users, jobs, rooms, tasks, photos, and audio.
3. The app talks to Supabase using keys in your `.env` file
   Those keys tell the app which Supabase project belongs to it.
4. OpenAI is only used for the AI part
   The app sends transcript/photo context to a Supabase Edge Function, and that function talks to OpenAI.

So the chain is:

`Phone app (Expo) -> Supabase database/storage/auth -> Supabase Edge Function -> OpenAI`

That means you do not upload your whole app to Supabase. You:

- keep the app code in this GitHub repo
- run the app with Expo
- create the database/storage in Supabase
- connect them using environment variables

## What you need to do the first time

There are really 3 separate setup jobs:

1. Get the app code on your computer and in GitHub
2. Create the Supabase project and run the SQL files
3. Start the Expo app on your phone

If one of those three is missing, it can feel like “nothing is showing up.”

## Before you start

Install these on your computer:

1. Node.js 20 LTS
2. npm
3. Expo Go on your phone
4. A Supabase account
5. An OpenAI API key

You can check Node with:

```sh
node -v
```

## Step 1: install dependencies

From the project folder:

```sh
npm install
```

## Step 2: create your environment file

Create a file named `.env` in the project root:

```env
EXPO_PUBLIC_DEMO_MODE=true
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

If you leave `EXPO_PUBLIC_DEMO_MODE=true`, the app can still open with seeded demo data while you are learning the setup.

## Step 3: create your Supabase project

In Supabase:

1. Create a new project
2. Open the SQL editor
3. Run the migration in [supabase/migrations/202604120001_initial_schema.sql](/Users/jake/Documents/New%20project/supabase/migrations/202604120001_initial_schema.sql)
4. Run the seed file in [supabase/seed.sql](/Users/jake/Documents/New%20project/supabase/seed.sql)
5. Confirm the storage buckets from [docs/storage-and-rls.md](/Users/jake/Documents/New%20project/docs/storage-and-rls.md) were created by the migration

## Step 4: connect the Edge Function

The extraction function lives in:

- [supabase/functions/extract-segment-task/index.ts](/Users/jake/Documents/New%20project/supabase/functions/extract-segment-task/index.ts)

Deploy it with the Supabase CLI after linking your project:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy extract-segment-task
```

Set your secret:

```sh
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

## Step 5: start the Expo app

```sh
npm run start
```

Then:

1. Scan the QR code with Expo Go
2. Sign in with `mason@fieldwork.demo` for boss mode
3. Sign in with `jake@fieldwork.demo` for worker mode

If you just open the folder or open GitHub, you will not see the app running yet. The app appears only after you start Expo and open it on a phone or simulator.

## What works right now

- Sign-in flow with role-based routing
- Job list and job detail
- Room list and room detail shell
- Plan screen shell
- Walkthrough capture screen shell with camera preview and offline queue records
- Review extracted tasks screen
- Worker dashboard, task list, and task detail
- SVG diagram rendering for parsed measurements
- Supabase schema, seed data, bucket plan, and RLS examples

## What is still a clean stub

- live speech recognition on-device
- true audio upload from the capture screen
- real plan file upload UI
- review edits persisting to Supabase
- task status mutations and completion photo upload wiring

Those stubs are isolated on purpose so the app still opens cleanly while you build the integrations in order.

## Recommended build order

1. Get demo mode running
2. Connect Supabase env vars
3. Run the SQL migration and seed
4. Replace demo queries with real inserts/updates one feature at a time
5. Deploy the extraction Edge Function
6. Add real audio capture/transcription

## Important beginner note

You do not need to build every advanced feature at once. The safest path is:

1. Get the app to open
2. Get data saving
3. Get uploads working
4. Then add AI

That order is cheaper, easier to debug, and much less frustrating.
