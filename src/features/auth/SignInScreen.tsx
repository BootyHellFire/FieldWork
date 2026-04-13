import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

  const handleSignIn = (selectedEmail = email) => {
    const profile = demoUsers.find((user) => user.email === selectedEmail) ?? demoUsers[0];
    setProfile(profile);
    router.replace(profile.role === "worker" ? "/(worker)" : "/(boss)");
  };

  return (
    <Screen showBackButton={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Field walkthrough V1</Text>
        <Text style={styles.title}>Open the app like a foreman or worker.</Text>
        <Text style={styles.subtitle}>
          Right now this runs in demo mode, so you can test the screens without setting up Supabase first.
        </Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Quick demo sign-in</Text>
        <Pressable onPress={() => handleSignIn("mason@fieldwork.demo")} style={styles.demoCard}>
          <Text style={styles.demoTitle}>Continue as Boss / Foreman</Text>
          <Text style={styles.demoMeta}>Mason Reed · walkthrough capture, review, jobs</Text>
        </Pressable>
        <Pressable onPress={() => handleSignIn("jake@fieldwork.demo")} style={styles.demoCard}>
          <Text style={styles.demoTitle}>Continue as Worker / Electrician</Text>
          <Text style={styles.demoMeta}>Jake Mercer · assigned tasks and task detail</Text>
        </Pressable>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Manual demo sign-in</Text>
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
  sectionTitle: { color: colors.text, fontWeight: "700", fontSize: 18 },
  demoCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.background,
  },
  demoTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  demoMeta: { color: colors.textMuted, lineHeight: 20 },
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
