import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { demoTasks } from "@/data/demo";
import { useSessionStore } from "@/store/session";

export function WorkerDashboardScreen() {
  const setProfile = useSessionStore((state) => state.setProfile);
  const activeCount = demoTasks.filter((task) => task.status !== "completed").length;

  return (
    <Screen showBackButton={false}>
      <Text style={styles.title}>Worker dashboard</Text>
      <Card>
        <Badge text={`${activeCount} live tasks`} tone="warning" />
        <Text style={styles.body}>Open the queue, filter by room or stage, and upload completion photos from the field.</Text>
        <View style={styles.actions}>
          <FieldButton label="Open task list" href="/worker/tasks" />
          <FieldButton label="Sign out" onPress={() => setProfile(null)} variant="secondary" />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  body: { color: colors.text, lineHeight: 22 },
  actions: { gap: 10 },
});
