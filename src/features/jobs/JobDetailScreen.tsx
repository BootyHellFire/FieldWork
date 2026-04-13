import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/constants/theme";
import { fetchJob, fetchPlans, fetchRooms } from "@/lib/supabase/queries";

export function JobDetailScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { data: job } = useQuery({ queryKey: ["job", jobId], queryFn: () => fetchJob(jobId) });
  const { data: rooms = [] } = useQuery({ queryKey: ["rooms", jobId], queryFn: () => fetchRooms(jobId) });
  const { data: plans = [] } = useQuery({ queryKey: ["plans", jobId], queryFn: () => fetchPlans(jobId) });

  if (!job) return null;

  return (
    <Screen>
      <Text style={styles.title}>{job.name}</Text>
      <Text style={styles.subtitle}>{job.address}</Text>

      <Card>
        <Text style={styles.sectionTitle}>Today at a glance</Text>
        <View style={styles.badgeRow}>
          <Badge text={`${rooms.length} rooms`} tone="success" />
          <Badge text={`${plans.length} plans`} />
          <Badge text={job.status} tone="warning" />
        </View>
        <Text style={styles.body}>
          {job.notes ?? "No job notes yet. Add field context here once the real job edit flow is wired."}
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Job actions</Text>
        <FieldButton label="Open plans" variant="secondary" href={`/(boss)/jobs/${jobId}/plans`} />
        <FieldButton label="Open rooms" variant="secondary" href={`/(boss)/jobs/${jobId}/rooms`} />
        <FieldButton label="Start walkthrough" href={`/(boss)/jobs/${jobId}/walkthrough/session-live`} />
        <FieldButton
          label="Review extracted tasks"
          variant="secondary"
          href={`/(boss)/jobs/${jobId}/review`}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>What to do next</Text>
        <Text style={styles.meta}>1. Check rooms before you start the walkthrough.</Text>
        <Text style={styles.meta}>2. Keep the camera open and tap snapshot when something matters.</Text>
        <Text style={styles.meta}>3. Review extracted tasks before workers see anything.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: "700", color: colors.text },
  subtitle: { color: colors.textMuted },
  sectionTitle: { fontWeight: "700", color: colors.text, fontSize: 16 },
  badgeRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  meta: { color: colors.textMuted },
  body: { color: colors.text, lineHeight: 21 },
});
