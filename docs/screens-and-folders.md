# Screen Architecture and Folder Structure

## Main screens

- `/(auth)/sign-in`
- `/(boss)`
- `/(boss)/jobs/create`
- `/(boss)/jobs/[jobId]`
- `/(boss)/jobs/[jobId]/plans`
- `/(boss)/jobs/[jobId]/rooms`
- `/(boss)/jobs/[jobId]/rooms/[roomId]`
- `/(boss)/jobs/[jobId]/walkthrough/[sessionId]`
- `/(boss)/jobs/[jobId]/review`
- `/(worker)`
- `/(worker)/tasks`
- `/(shared)/tasks/[taskId]`
- `/(settings)/profile`

## Folder structure

```text
app/
src/
  components/
  constants/
  data/
  features/
    auth/
    jobs/
    plans/
    review/
    rooms/
    tasks/
    walkthrough/
    worker/
  hooks/
  lib/
    diagrams/
    offline/
    openai/
    supabase/
    utils/
  providers/
  store/
  types/
supabase/
  migrations/
  functions/
docs/
```

## Principle

Each major workflow gets its own feature folder so you can find code by product behavior, not by guessing whether it lives in “screens,” “services,” or “helpers.”
