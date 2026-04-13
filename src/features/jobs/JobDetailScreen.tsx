import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
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
        <Text style={styles.sectionTitle}>Job actions</Text>
        <FieldButton label="Plans" variant="secondary" href={`/(boss)/jobs/${jobId}/plans`} />
        <FieldButton label="Rooms" variant="secondary" href={`/(boss)/jobs/${jobId}/rooms`} />
        <FieldButton label="Start walkthrough" href={`/(boss)/jobs/${jobId}/walkthrough/session-live`} />
        <FieldButton
          label="Review extracted tasks"
          variant="secondary"
          href={`/(boss)/jobs/${jobId}/review`}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Snapshot</Text>
        <Text style={styles.meta}>{rooms.length} rooms labeled</Text>
        <Text style={styles.meta}>{plans.length} plans uploaded</Text>
        <Text style={styles.body}>{job.notes}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: "700", color: colors.text },
  subtitle: { color: colors.textMuted },
  sectionTitle: { fontWeight: "700", color: colors.text, fontSize: 16 },
  meta: { color: colors.textMuted },
  body: { color: colors.text, lineHeight: 21 },
});
