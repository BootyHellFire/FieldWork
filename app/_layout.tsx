import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthGate } from "@/features/auth/AuthGate";
import { AppProvider } from "@/providers/AppProvider";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <AuthGate>
        <Slot />
      </AuthGate>
    </AppProvider>
  );
}
