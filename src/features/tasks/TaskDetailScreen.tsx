import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { DiagramPreview } from "@/lib/diagrams/renderDiagram";
import { fetchTask } from "@/lib/supabase/queries";

export function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const { data: task } = useQuery({ queryKey: ["task", taskId], queryFn: () => fetchTask(taskId) });

  if (!task) return null;

  return (
    <Screen>
      <Text style={styles.title}>{task.title}</Text>
      <Card>
        <Badge text={task.room?.name ?? "No room"} />
        <Badge text={task.stage} tone="warning" />
        <Badge text={task.priority} tone={task.priority === "high" ? "danger" : "default"} />
        <Text style={styles.body}>{task.description}</Text>
      </Card>

      {task.source_photo_url ? (
        <Card>
          <Text style={styles.sectionTitle}>Reference photo</Text>
          <Image source={{ uri: task.source_photo_url }} style={styles.photo} />
        </Card>
      ) : null}

      <Card>
        <Text style={styles.sectionTitle}>Measurements & diagram</Text>
        <DiagramPreview measurements={task.measurements_json} spec={task.diagram_json} />
        <Text style={styles.meta}>{task.transcript_snippet}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Worker actions</Text>
        <FieldButton label="Mark in progress" />
        <FieldButton label="Mark done" variant="secondary" />
        <FieldButton label="Upload completion photo" variant="secondary" />
        <FieldButton label="Ask a question" variant="secondary" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  sectionTitle: { fontWeight: "700", color: colors.text },
  body: { color: colors.text, lineHeight: 22 },
  meta: { color: colors.textMuted, lineHeight: 20 },
  photo: { width: "100%", height: 220, borderRadius: radius.md },
});
