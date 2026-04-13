import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { fetchPlans } from "@/lib/supabase/queries";

export function PlanUploadScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { data: plans = [] } = useQuery({ queryKey: ["plans", jobId], queryFn: () => fetchPlans(jobId) });

  return (
    <Screen>
      <Text style={styles.title}>Plans</Text>
      <Card>
        <Text style={styles.body}>Upload PDF sheets, screenshots, or photos of marked-up plans.</Text>
        <FieldButton label="Upload plan (wire to document picker)" />
      </Card>
      {plans.map((plan) => (
        <Card key={plan.id}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          <Text style={styles.meta}>{plan.file_type.toUpperCase()} · {plan.page_count} pages</Text>
          <Text style={styles.meta}>{plan.file_url}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  body: { color: colors.text, lineHeight: 22 },
  planTitle: { fontWeight: "700", color: colors.text },
  meta: { color: colors.textMuted },
});
