import { z } from "zod";

export const measurementSchema = z.object({
  height_from_finished_floor_inches: z.number().nullable().optional(),
  offset_from_right_wall_inches: z.number().nullable().optional(),
  offset_from_left_wall_inches: z.number().nullable().optional(),
  centered_on: z.string().nullable().optional(),
  above_feature: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const extractionSchema = z.object({
  should_create_task: z.boolean(),
  assignee_name: z.string().nullable().optional(),
  task_title: z.string(),
  task_description: z.string(),
  room_name: z.string().nullable().optional(),
  wall_reference: z.string().nullable().optional(),
  device_type: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
  measurements: measurementSchema,
  stage: z.enum(["rough", "trim", "finish", "punch"]).nullable().optional(),
  priority: z.enum(["low", "normal", "high"]).nullable().optional(),
  ambiguity_flags: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
  note_only_reason: z.string().nullable().optional(),
});

export type ExtractionPayload = z.infer<typeof extractionSchema>;
