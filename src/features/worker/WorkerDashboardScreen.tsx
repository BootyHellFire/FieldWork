import React from "react";
import { StyleSheet, Text } from "react-native";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { demoTasks } from "@/data/demo";

export function WorkerDashboardScreen() {
  const activeCount = demoTasks.filter((task) => task.status !== "completed").length;

  return (
    <Screen>
      <Text style={styles.title}>Worker dashboard</Text>
      <Card>
        <Badge text={`${activeCount} live tasks`} tone="warning" />
        <Text style={styles.body}>Open the queue, filter by room or stage, and upload completion photos from the field.</Text>
        <FieldButton label="Open task list" href="/(worker)/tasks" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  body: { color: colors.text, lineHeight: 22 },
});
