export type UserRole = "boss" | "worker" | "admin";
export type JobStatus = "planning" | "active" | "paused" | "completed";
export type TaskStatus =
  | "draft"
  | "approved"
  | "published"
  | "in_progress"
  | "completed";
export type TaskPriority = "low" | "normal" | "high";
export type TaskStage = "rough" | "trim" | "finish" | "punch";

export type UserProfile = {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  phone?: string | null;
  active: boolean;
};

export type Builder = {
  id: string;
  name: string;
  contact_name?: string | null;
  notes?: string | null;
};

export type Job = {
  id: string;
  builder_id: string;
  name: string;
  address: string;
  status: JobStatus;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  builder?: Builder;
};

export type Room = {
  id: string;
  job_id: string;
  plan_page_id?: string | null;
  name: string;
  floor_name?: string | null;
  polygon_json?: string | null;
  notes?: string | null;
  sort_order: number;
};

export type Plan = {
  id: string;
  job_id: string;
  file_type: "pdf" | "image";
  file_url: string;
  page_count: number;
  title: string;
  uploaded_by: string;
  created_at: string;
};

export type MeasurementJson = {
  height_from_finished_floor_inches?: number | null;
  offset_from_right_wall_inches?: number | null;
  offset_from_left_wall_inches?: number | null;
  centered_on?: string | null;
  above_feature?: string | null;
  notes?: string | null;
};

export type WalkthroughSegment = {
  id: string;
  session_id: string;
  room_id?: string | null;
  assignee_user_id?: string | null;
  priority: TaskPriority;
  stage: TaskStage;
  transcript_text: string;
  transcript_start_ms: number;
  transcript_end_ms: number;
  audio_clip_url?: string | null;
  snapshot_image_url?: string | null;
  raw_ai_json?: unknown;
  reviewed: boolean;
  created_at: string;
};

export type Task = {
  id: string;
  job_id: string;
  room_id?: string | null;
  source_segment_id?: string | null;
  assigned_to_user_id?: string | null;
  created_by_user_id: string;
  status: TaskStatus;
  priority: TaskPriority;
  stage: TaskStage;
  title: string;
  description: string;
  wall_reference?: string | null;
  measurements_json?: MeasurementJson | null;
  diagram_json?: DiagramSpec | null;
  transcript_snippet?: string | null;
  source_photo_url?: string | null;
  needs_review: boolean;
  approved_at?: string | null;
  published_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  room?: Room | null;
};

export type TaskComment = {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_at: string;
};

export type TaskPhoto = {
  id: string;
  task_id: string;
  photo_url: string;
  photo_type: "reference" | "completion";
  uploaded_by: string;
  created_at: string;
};

export type DiagramSpec = {
  wallLabel?: string;
  floorLabel?: string;
  deviceLabel?: string;
  dimensions: {
    label: string;
    position: "left" | "right" | "vertical" | "center";
  }[];
};

export type ExtractionCandidate = {
  should_create_task: boolean;
  assignee_name?: string | null;
  task_title: string;
  task_description: string;
  room_name?: string | null;
  wall_reference?: string | null;
  device_type?: string | null;
  action?: string | null;
  measurements: MeasurementJson;
  stage?: TaskStage | null;
  priority?: TaskPriority | null;
  ambiguity_flags: string[];
  confidence_score: number;
  note_only_reason?: string | null;
};
