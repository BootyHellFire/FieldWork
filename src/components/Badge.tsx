import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";

type Props = {
  text: string;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneMap = {
  default: { bg: colors.surfaceMuted, fg: colors.text },
  success: { bg: "#DCEFE5", fg: colors.success },
  warning: { bg: "#F7E8CB", fg: colors.warning },
  danger: { bg: "#F4D8D8", fg: colors.danger },
};

export function Badge({ text, tone = "default" }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: toneMap[tone].bg }]}>
      <Text style={[styles.text, { color: toneMap[tone].fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
