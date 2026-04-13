import React, { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { colors, spacing } from "@/constants/theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function Screen({ children, scroll = true }: Props) {
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? <ScrollView style={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
});
