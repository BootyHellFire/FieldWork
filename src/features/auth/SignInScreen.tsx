import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/constants/theme";
import { demoUsers } from "@/data/demo";
import { useSessionStore } from "@/store/session";

export function SignInScreen() {
  const [email, setEmail] = useState("mason@fieldwork.demo");
  const setProfile = useSessionStore((state) => state.setProfile);

  const handleSignIn = () => {
    const profile = demoUsers.find((user) => user.email === email) ?? demoUsers[0];
    setProfile(profile);
    router.replace(profile.role === "worker" ? "/(worker)" : "/(boss)");
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Field walkthrough V1</Text>
        <Text style={styles.title}>Sign in for today’s electrical walk.</Text>
        <Text style={styles.subtitle}>
          Invite-only access in V1. Demo mode signs you into seeded Supabase-style data.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.input}
          value={email}
        />
        <FieldButton label="Sign in" onPress={handleSignIn} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, paddingTop: spacing.xl },
  eyebrow: { color: colors.primary, fontWeight: "700", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 30, fontWeight: "700", lineHeight: 36 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  label: { color: colors.textMuted, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
});
