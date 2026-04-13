# OpenAI Task Extraction Design

## Purpose

Turn one transcript segment plus current walkthrough context into one structured draft task or a note-only result.

The live backend handler for this flow is `supabase/functions/extract-segment-task/index.ts`.

## Inputs

- job name
- current room
- current assignee
- current stage
- current priority
- known room labels
- known worker names
- transcript text
- optional snapshot URL

When a snapshot exists, send it as an image input to the model. That gives the extractor enough context to understand fixture placement and wall references without adding more services.

## Output requirements

- valid JSON only
- no invented measurements
- note-only segments must return `should_create_task=false`
- ambiguity must be explicit, not hidden

## Model behavior rules

- prefer the currently selected room unless speaker overrides it
- prefer the currently selected assignee unless speaker overrides it
- keep the task title short and field-friendly
- keep the description specific enough for an electrician to execute later
- preserve halves as decimals
- if only one dimension exists, return one dimension only

## JSON schema

See:

- [src/lib/openai/schema.ts](/Users/jake/Documents/New%20project/src/lib/openai/schema.ts)
- `supabase/functions/extract-segment-task/index.ts` should stay aligned with that schema.

## Prompt source

See:

- [src/lib/openai/prompts.ts](/Users/jake/Documents/New%20project/src/lib/openai/prompts.ts)

## Example supported phrases

- “Carson, mount this light at 84 inches to center from finished floor and 27 inches from the right wall.”
- “Move this switch bank over 2 inches.”
- “Put this outlet centered under the window.”
- “This one is for trim.”
- “This is high priority.”
- “Don’t make a task for this, just a note.”
