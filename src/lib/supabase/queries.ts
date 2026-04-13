import { demoCandidates, demoJobs, demoPlans, demoRooms, demoTasks } from "@/data/demo";
import type { ExtractionCandidate, Job, Plan, Room, Task, UserProfile } from "@/types/schema";

import { supabase } from "./client";
import { DEMO_MODE, isSupabaseConfigured } from "./env";

function assertConfigured() {
  if (!supabase && !DEMO_MODE && !isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY or turn on demo mode.",
    );
  }
}

export async function fetchCurrentProfile(): Promise<UserProfile | null> {
  assertConfigured();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();
  if (error) throw error;
  return data as UserProfile;
}

export async function fetchJobs(): Promise<Job[]> {
  assertConfigured();
  if (!supabase) return demoJobs;
  const { data, error } = await supabase
    .from("jobs")
    .select("*, builder:builders(*)")
    .order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function fetchJob(jobId: string): Promise<Job | null> {
  const jobs = await fetchJobs();
  return jobs.find((job) => job.id === jobId) ?? null;
}

export async function fetchRooms(jobId: string): Promise<Room[]> {
  assertConfigured();
  if (!supabase) return demoRooms.filter((room) => room.job_id === jobId);
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("job_id", jobId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Room[];
}

export async function fetchPlans(jobId: string): Promise<Plan[]> {
  assertConfigured();
  if (!supabase) return demoPlans.filter((plan) => plan.job_id === jobId);
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Plan[];
}

export async function fetchReviewCandidates(jobId: string): Promise<ExtractionCandidate[]> {
  assertConfigured();
  if (!supabase) return demoCandidates;

  const { data: sessions, error: sessionError } = await supabase
    .from("walkthrough_sessions")
    .select("id")
    .eq("job_id", jobId);
  if (sessionError) throw sessionError;

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (sessionIds.length === 0) return [];

  const { data, error } = await supabase
    .from("walkthrough_segments")
    .select("raw_ai_json")
    .eq("reviewed", false)
    .in("session_id", sessionIds)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row) => row.raw_ai_json as ExtractionCandidate | null)
    .filter(Boolean) as ExtractionCandidate[];
}

export async function fetchWorkerTasks(): Promise<Task[]> {
  assertConfigured();
  if (!supabase) return demoTasks;
  const { data, error } = await supabase
    .from("tasks")
    .select("*, room:rooms(*)")
    .in("status", ["approved", "published", "in_progress", "completed"])
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function fetchTask(taskId: string): Promise<Task | null> {
  assertConfigured();
  if (!supabase) return demoTasks.find((task) => task.id === taskId) ?? null;
  const { data, error } = await supabase
    .from("tasks")
    .select("*, room:rooms(*)")
    .eq("id", taskId)
    .single();
  if (error) throw error;
  return (data ?? null) as Task | null;
}
