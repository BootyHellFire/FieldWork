import React from "react";
import { StyleSheet, Text } from "react-native";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { useSessionStore } from "@/store/session";

export function ProfileScreen() {
  const profile = useSessionStore((state) => state.profile);
  const setProfile = useSessionStore((state) => state.setProfile);

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      <Card>
        <Text style={styles.line}>{profile?.full_name}</Text>
        <Text style={styles.line}>{profile?.email}</Text>
        <Text style={styles.line}>Role: {profile?.role}</Text>
        <FieldButton label="Sign out" onPress={() => setProfile(null)} variant="secondary" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  line: { color: colors.text, lineHeight: 22 },
});
