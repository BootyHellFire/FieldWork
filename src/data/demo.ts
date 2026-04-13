import type {
  ExtractionCandidate,
  Job,
  Plan,
  Room,
  Task,
  UserProfile,
  WalkthroughSegment,
} from "@/types/schema";

export const demoUsers: UserProfile[] = [
  {
    id: "boss-1",
    full_name: "Mason Reed",
    role: "boss",
    email: "mason@fieldwork.demo",
    phone: "555-1000",
    active: true,
  },
  {
    id: "worker-1",
    full_name: "Jake Mercer",
    role: "worker",
    email: "jake@fieldwork.demo",
    phone: "555-2000",
    active: true,
  },
  {
    id: "worker-2",
    full_name: "Carson Vale",
    role: "worker",
    email: "carson@fieldwork.demo",
    phone: "555-3000",
    active: true,
  },
];

export const demoJobs: Job[] = [
  {
    id: "job-1",
    builder_id: "builder-1",
    name: "Bennett Residence",
    address: "1417 Cottonwood Ridge, Boise, ID",
    status: "active",
    start_date: "2026-04-01",
    notes: "High-end custom home. Focus on trim corrections before cabinet install.",
    builder: {
      id: "builder-1",
      name: "Bennett Custom Homes",
      contact_name: "Lauren Bennett",
      notes: "Call before final trim changes.",
    },
  },
];

export const demoPlans: Plan[] = [
  {
    id: "plan-1",
    job_id: "job-1",
    file_type: "pdf",
    file_url: "https://example.com/demo-plan.pdf",
    page_count: 2,
    title: "Electrical Set A3",
    uploaded_by: "boss-1",
    created_at: "2026-04-10T15:00:00Z",
  },
];

export const demoRooms: Room[] = [
  { id: "room-1", job_id: "job-1", name: "Kitchen", floor_name: "Main", sort_order: 1, notes: "Island pendants and appliance wall." },
  { id: "room-2", job_id: "job-1", name: "Downstairs Bathroom", floor_name: "Main", sort_order: 2, notes: "Vanity, mirror heat, toe-kick outlet." },
  { id: "room-3", job_id: "job-1", name: "Garage", floor_name: "Main", sort_order: 3, notes: "EV charger and shop bench outlets." },
];

export const demoSegments: WalkthroughSegment[] = [
  {
    id: "segment-1",
    session_id: "session-1",
    room_id: "room-2",
    assignee_user_id: "worker-2",
    priority: "high",
    stage: "trim",
    transcript_text:
      "Carson, move this vanity light up to 52 and a half inches to center from finished floor and keep it centered over the sink. This is high priority trim.",
    transcript_start_ms: 0,
    transcript_end_ms: 12000,
    snapshot_image_url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    reviewed: false,
    created_at: "2026-04-12T09:00:00Z",
  },
];

export const demoCandidates: ExtractionCandidate[] = [
  {
    should_create_task: true,
    assignee_name: "Carson Vale",
    task_title: "Raise vanity light to 52.5 inches AFF",
    task_description: "Move the downstairs bathroom vanity light so centerline lands 52.5 inches above finished floor and keep it centered over the sink.",
    room_name: "Downstairs Bathroom",
    wall_reference: "Vanity wall",
    device_type: "vanity light",
    action: "move",
    measurements: {
      height_from_finished_floor_inches: 52.5,
      centered_on: "sink",
      notes: "to center",
    },
    stage: "trim",
    priority: "high",
    ambiguity_flags: [],
    confidence_score: 0.96,
  },
];

export const demoTasks: Task[] = [
  {
    id: "task-1",
    job_id: "job-1",
    room_id: "room-2",
    source_segment_id: "segment-1",
    assigned_to_user_id: "worker-2",
    created_by_user_id: "boss-1",
    status: "published",
    priority: "high",
    stage: "trim",
    title: "Raise vanity light to 52.5 inches AFF",
    description:
      "Move vanity light so the fixture center lands 52.5 inches above finished floor and stays centered over the sink.",
    wall_reference: "Vanity wall",
    measurements_json: {
      height_from_finished_floor_inches: 52.5,
      centered_on: "sink",
      notes: "to center",
    },
    diagram_json: {
      wallLabel: "Vanity wall",
      floorLabel: "Finished floor",
      deviceLabel: "Vanity light",
      dimensions: [
        { label: '52.5" AFF', position: "vertical" },
        { label: "Centered on sink", position: "center" },
      ],
    },
    transcript_snippet:
      "Move this vanity light up to 52 and a half inches to center from finished floor and keep it centered over the sink.",
    source_photo_url:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    needs_review: false,
    approved_at: "2026-04-12T09:15:00Z",
    published_at: "2026-04-12T09:20:00Z",
    created_at: "2026-04-12T09:10:00Z",
    updated_at: "2026-04-12T09:20:00Z",
    room: demoRooms[1],
  },
];
