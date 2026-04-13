import React, { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";
import { fetchCurrentProfile } from "@/lib/supabase/queries";
import { useBoot } from "@/hooks/useBoot";
import { useSessionStore } from "@/store/session";

const queryClient = new QueryClient();

export function AppProvider({ children }: PropsWithChildren) {
  const setProfile = useSessionStore((state) => state.setProfile);
  const setAuthReady = useSessionStore((state) => state.setAuthReady);
  useBoot();

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentProfile();
        if (mounted) {
          setProfile(profile);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    };

    void loadProfile();

    const authSubscription = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setProfile(null);
        setAuthReady(true);
        return;
      }

      const profile = await fetchCurrentProfile().catch(() => null);
      setProfile(profile);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      authSubscription?.data.subscription.unsubscribe();
    };
  }, [setAuthReady, setProfile]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
