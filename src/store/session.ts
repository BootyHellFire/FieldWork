import { create } from "zustand";

import type { TaskPriority, TaskStage, UserProfile } from "@/types/schema";

type SessionState = {
  profile: UserProfile | null;
  authReady: boolean;
  currentRoomId: string | null;
  currentAssigneeId: string | null;
  currentPriority: TaskPriority;
  currentStage: TaskStage;
  setProfile: (profile: UserProfile | null) => void;
  setAuthReady: (ready: boolean) => void;
  setCurrentRoomId: (roomId: string | null) => void;
  setCurrentAssigneeId: (userId: string | null) => void;
  setCurrentPriority: (priority: TaskPriority) => void;
  setCurrentStage: (stage: TaskStage) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  profile: null,
  authReady: false,
  currentRoomId: null,
  currentAssigneeId: null,
  currentPriority: "normal",
  currentStage: "rough",
  setProfile: (profile) => set({ profile }),
  setAuthReady: (authReady) => set({ authReady }),
  setCurrentRoomId: (currentRoomId) => set({ currentRoomId }),
  setCurrentAssigneeId: (currentAssigneeId) => set({ currentAssigneeId }),
  setCurrentPriority: (currentPriority) => set({ currentPriority }),
  setCurrentStage: (currentStage) => set({ currentStage }),
}));
