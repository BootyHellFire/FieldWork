import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { fetchReviewCandidates } from "@/lib/supabase/queries";

export function ReviewTasksScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { data: candidates = [] } = useQuery({
    queryKey: ["review-candidates", jobId],
    queryFn: () => fetchReviewCandidates(jobId),
  });

  return (
    <Screen>
      <Text style={styles.title}>Review extracted tasks</Text>
      <Text style={styles.subtitle}>Nothing reaches workers until the boss approves it here.</Text>
      {candidates.map((candidate, index) => (
        <Card key={`${candidate.task_title}-${index}`}>
          <View style={styles.row}>
            <Badge text={candidate.stage ?? "Unstaged"} tone="warning" />
            <Badge text={candidate.priority ?? "normal"} tone={candidate.priority === "high" ? "danger" : "default"} />
            <Badge text={`${Math.round(candidate.confidence_score * 100)}%`} tone="success" />
          </View>
          <Text style={styles.taskTitle}>{candidate.task_title}</Text>
          <Text style={styles.body}>{candidate.task_description}</Text>
          <Text style={styles.meta}>Room: {candidate.room_name ?? "Needs review"}</Text>
          <Text style={styles.meta}>Assignee: {candidate.assignee_name ?? "Unassigned"}</Text>
          <Text style={styles.meta}>Flags: {candidate.ambiguity_flags.join(", ") || "None"}</Text>
          <View style={styles.actions}>
            <FieldButton label="Approve" />
            <FieldButton label="Discard" variant="secondary" />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { color: colors.textMuted },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  taskTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { color: colors.text, lineHeight: 21 },
  meta: { color: colors.textMuted },
  actions: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
});
