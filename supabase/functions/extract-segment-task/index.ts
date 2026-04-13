import { z } from "npm:zod@3.24.2";

const requestSchema = z.object({
  jobName: z.string(),
  roomName: z.string().nullable().optional(),
  assigneeName: z.string().nullable().optional(),
  stage: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  knownWorkers: z.array(z.string()),
  knownRooms: z.array(z.string()),
  transcript: z.string(),
  snapshotUrl: z.string().nullable().optional(),
});

const responseSchema = z.object({
  should_create_task: z.boolean(),
  assignee_name: z.string().nullable().optional(),
  task_title: z.string(),
  task_description: z.string(),
  room_name: z.string().nullable().optional(),
  wall_reference: z.string().nullable().optional(),
  device_type: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
  measurements: z.object({
    height_from_finished_floor_inches: z.number().nullable().optional(),
    offset_from_right_wall_inches: z.number().nullable().optional(),
    offset_from_left_wall_inches: z.number().nullable().optional(),
    centered_on: z.string().nullable().optional(),
    above_feature: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  }),
  stage: z.enum(["rough", "trim", "finish", "punch"]).nullable().optional(),
  priority: z.enum(["low", "normal", "high"]).nullable().optional(),
  ambiguity_flags: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
  note_only_reason: z.string().nullable().optional(),
});

const systemPrompt = `You extract electrical walkthrough tasks for high-end residential jobs.
Return JSON only.
Do not invent measurements.
If the speaker says not to create a task, set should_create_task to false.
Keep titles short and descriptions clear for electricians in the field.`;

function buildUserPrompt(input: z.infer<typeof requestSchema>) {
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
    },
    null,
    2,
  );
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const payload = requestSchema.parse(await request.json());
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY secret." }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const userContent: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "low" | "high" | "auto" } }
    > = [{ type: "text", text: buildUserPrompt(payload) }];

    if (payload.snapshotUrl) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: payload.snapshotUrl,
          detail: "low",
        },
      });
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const result = await openAiResponse.json();
    const content = result.choices?.[0]?.message?.content;
    const parsed = responseSchema.parse(JSON.parse(content));

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown extraction error.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      },
    );
  }
});
