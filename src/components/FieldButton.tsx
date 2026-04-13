import React from "react";
import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  href?: Href;
  variant?: "primary" | "secondary" | "danger";
};

export function FieldButton({ label, onPress, href, variant = "primary" }: Props) {
  const button = (
    <Pressable onPress={onPress} style={[styles.button, styles[variant]]}>
      <Text style={[styles.text, variant !== "secondary" && styles.textInverse]}>{label}</Text>
    </Pressable>
  );

  if (href) {
    return <Link href={href} asChild>{button}</Link>;
  }

  return button;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  textInverse: {
    color: colors.surface,
  },
});
