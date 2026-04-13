import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { fetchWorkerTasks } from "@/lib/supabase/queries";

export function WorkerTaskListScreen() {
  const { data: tasks = [] } = useQuery({ queryKey: ["worker-tasks"], queryFn: fetchWorkerTasks });

  return (
    <Screen>
      <Text style={styles.title}>Assigned tasks</Text>
      <Text style={styles.subtitle}>Filter controls can be promoted into chips once live data is wired.</Text>
      {tasks.map((task) => (
        <Link href={`/(shared)/tasks/${task.id}`} key={task.id} asChild>
          <Pressable>
            <Card>
              <View style={styles.row}>
                <Badge text={task.priority} tone={task.priority === "high" ? "danger" : "default"} />
                <Badge text={task.stage} tone="warning" />
                <Badge text={task.status} tone={task.status === "completed" ? "success" : "default"} />
              </View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.meta}>{task.room?.name ?? "No room label"}</Text>
              <Text style={styles.body}>{task.description}</Text>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { color: colors.textMuted },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  taskTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  meta: { color: colors.textMuted },
  body: { color: colors.text, lineHeight: 21 },
});
