# App Architecture

## Stack

- Expo managed workflow
- Expo Router
- React Native + TypeScript
- Supabase Auth, Postgres, Storage, Realtime, Edge Functions
- TanStack Query
- Zustand
- Expo SQLite
- NetInfo
- OpenAI API through Supabase Edge Functions

## Why this stack

- Expo keeps native setup lighter for a first app
- Supabase reduces backend moving parts and cost
- Query + Zustand split server data from in-session UI state cleanly
- SQLite makes walkthrough data survive bad service and app restarts

## Route groups

- `(auth)` sign in
- `(boss)` foreman flows
- `(worker)` electrician flows
- `(shared)` task detail
- `(settings)` profile/basic settings

## Feature boundaries

- `auth`: session bootstrap and role routing
- `jobs`: job list/create/detail
- `plans`: upload metadata and plan list
- `rooms`: manual room labels
- `walkthrough`: camera session, transcript capture, local queue
- `review`: extracted draft tasks and approval
- `tasks`: shared task detail and task mutations
- `worker`: worker dashboard and queue

## Data flow

1. User signs in with Supabase Auth
2. App loads profile and role
3. Boss creates walkthrough segments locally first
4. Local queue stores transcript/audio/photo references
5. Sync process uploads files and segment records
6. Edge Function calls OpenAI with transcript + room + snapshot context
7. JSON response is validated
8. Draft tasks are written to `tasks`
9. Boss approves tasks
10. Workers receive published updates through Supabase Realtime

## Offline strategy

- Store pending upload jobs in SQLite
- Keep transcript text locally before any network call
- Store local file URIs for snapshot/audio until upload succeeds
- Mark session state as pending sync
- Retry on reconnect

## Cost control

- Avoid video upload and scene analysis
- Use still snapshots only
- Run AI on transcript segments, not full sessions
- Keep one Edge Function for extraction
- Limit realtime subscriptions to task updates only
