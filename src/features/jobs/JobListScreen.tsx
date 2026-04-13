import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/constants/theme";
import { fetchJobs } from "@/lib/supabase/queries";
import { useSessionStore } from "@/store/session";

export function JobListScreen() {
  const setProfile = useSessionStore((state) => state.setProfile);
  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  return (
    <Screen showBackButton={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Jobs</Text>
        <Text style={styles.subtitle}>
          Open a residence, review rooms, start a walkthrough, or jump into task review.
        </Text>
      </View>

      <View style={styles.topActions}>
        <FieldButton label="Create job" href="/(boss)/jobs/create" />
        <FieldButton label="Sign out" onPress={() => setProfile(null)} variant="secondary" />
      </View>

      {jobs.map((job) => (
        <Link href={`/(boss)/jobs/${job.id}`} key={job.id} asChild>
          <Pressable>
            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.jobName}>{job.name}</Text>
                <Badge text={job.status} />
              </View>
              <Text style={styles.meta}>{job.builder?.name ?? "Builder"} </Text>
              <Text style={styles.meta}>{job.address}</Text>
              <Text style={styles.notes}>{job.notes}</Text>
              <View style={styles.previewRow}>
                <Badge text="Rooms ready" tone="success" />
                <Badge text="Walkthrough ready" tone="warning" />
              </View>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
  title: { fontSize: 30, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  topActions: { gap: spacing.sm },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  jobName: { fontSize: 18, fontWeight: "700", color: colors.text, flex: 1, paddingRight: spacing.sm },
  meta: { color: colors.textMuted },
  notes: { color: colors.text, lineHeight: 20 },
  previewRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
});
