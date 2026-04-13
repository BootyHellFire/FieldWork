import React, { PropsWithChildren } from "react";
import { Redirect, useSegments } from "expo-router";

import { useSessionStore } from "@/store/session";

export function AuthGate({ children }: PropsWithChildren) {
  const profile = useSessionStore((state) => state.profile);
  const authReady = useSessionStore((state) => state.authReady);
  const segments = useSegments();
  const inAuth = segments[0] === "(auth)";

  if (!authReady) {
    return null;
  }

  if (!profile && !inAuth) {
    return <Redirect href="/sign-in" />;
  }

  if (profile && inAuth) {
    return <Redirect href={profile.role === "worker" ? "/worker" : "/jobs"} />;
  }

  return <>{children}</>;
}
