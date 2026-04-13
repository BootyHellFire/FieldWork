export const TASK_EXTRACTION_SYSTEM_PROMPT = `You extract electrical walkthrough tasks for high-end residential jobs.

Rules:
- Only create tasks for electrical work that a worker can act on later.
- Prefer plain electrical language, not generic construction phrasing.
- Never invent measurements.
- Measurements only come from spoken words or explicit context.
- If the speaker says not to create a task, return should_create_task=false.
- Use provided room and assignee context unless the speaker clearly overrides them.
- Keep titles short and field-usable.
- Keep descriptions concrete and action-oriented.
- If information is ambiguous, include ambiguity flags instead of guessing.
- Output valid JSON only.`;

export function buildTaskExtractionUserPrompt(input: {
  jobName: string;
  roomName?: string | null;
  assigneeName?: string | null;
  stage?: string | null;
  priority?: string | null;
  knownWorkers: string[];
  knownRooms: string[];
  transcript: string;
  snapshotUrl?: string | null;
}) {
  return JSON.stringify(
    {
      context: {
        job_name: input.jobName,
        current_room: input.roomName ?? null,
        current_assignee: input.assigneeName ?? null,
        current_stage: input.stage ?? null,
        current_priority: input.priority ?? null,
        known_workers: input.knownWorkers,
        known_rooms: input.knownRooms,
        snapshot_url: input.snapshotUrl ?? null,
      },
      transcript: input.transcript,
      output_rules: {
        should_create_task: "false if this is only a note or too vague to act on",
        measurements: "extract inches as numbers, preserve halves as decimals",
        ambiguity_flags_examples: [
          "missing_device_target",
          "missing_wall_reference",
          "unclear_measurement_anchor",
        ],
      },
    },
    null,
    2,
  );
}
