import Constants from "expo-constants";

type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  demoMode?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const SUPABASE_URL = extra.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  extra.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const DEMO_MODE =
  typeof extra.demoMode === "boolean"
    ? extra.demoMode
    : process.env.EXPO_PUBLIC_DEMO_MODE !== "false";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
