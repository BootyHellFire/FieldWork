import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/constants/theme";

export function JobCreateScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Create job</Text>
      <Card>
        <Text style={styles.label}>Job name</Text>
        <TextInput placeholder="Bennett Residence" style={styles.input} />
        <Text style={styles.label}>Address</Text>
        <TextInput placeholder="1417 Cottonwood Ridge" style={styles.input} />
        <Text style={styles.label}>Builder</Text>
        <TextInput placeholder="Bennett Custom Homes" style={styles.input} />
        <FieldButton label="Save job (wire to Supabase insert)" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  label: { fontWeight: "600", color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
});
