import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/constants/theme";

export function RoomDetailScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  return (
    <Screen>
      <Text style={styles.title}>Edit room</Text>
      <Text style={styles.subtitle}>Room ID: {roomId}</Text>
      <Card>
        <TextInput defaultValue="Downstairs Bathroom" style={styles.input} />
        <TextInput defaultValue="Main floor" style={styles.input} />
        <TextInput
          defaultValue="Vanity wall, mirror heat, and toe-kick outlet corrections"
          multiline
          style={[styles.input, styles.notes]}
        />
        <FieldButton label="Save room" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  notes: { minHeight: 110, textAlignVertical: "top" },
});
