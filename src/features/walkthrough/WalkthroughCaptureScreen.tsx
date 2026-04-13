import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors, radius, spacing } from "@/constants/theme";
import { demoRooms, demoSegments, demoUsers } from "@/data/demo";
import { queueUpload } from "@/lib/offline/queue";
import { useSessionStore } from "@/store/session";

export function WalkthroughCaptureScreen() {
  const { jobId, sessionId } = useLocalSearchParams<{ jobId: string; sessionId: string }>();
  const [manualNote, setManualNote] = useState("");
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(demoSegments[0].snapshot_image_url ?? null);
  const [permission, requestPermission] = useCameraPermissions();
  const {
    currentAssigneeId,
    currentPriority,
    currentRoomId,
    currentStage,
    setCurrentAssigneeId,
    setCurrentPriority,
    setCurrentRoomId,
    setCurrentStage,
  } = useSessionStore();

  const room = useMemo(
    () => demoRooms.find((item) => item.id === currentRoomId) ?? demoRooms[0],
    [currentRoomId],
  );

  const assignee = demoUsers.find((user) => user.id === currentAssigneeId) ?? demoUsers[2];

  if (!permission) {
    return (
      <Screen>
        <Card>
          <Text style={styles.snapshotTitle}>Checking camera permission…</Text>
        </Card>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Card>
          <Text style={styles.snapshotTitle}>Camera access is required for walkthrough mode.</Text>
          <Text style={styles.permissionBody}>
            Tap below once. If your phone asks for camera access, allow it so the preview can stay open while the foreman captures notes.
          </Text>
          <FieldButton label="Allow camera" onPress={() => void requestPermission()} />
        </Card>
      </Screen>
    );
  }

  const addManualNote = () => {
    queueUpload({
      id: `${Date.now()}`,
      kind: "segment",
      payload_json: JSON.stringify({
        jobId,
        sessionId,
        roomId: room.id,
        assigneeUserId: assignee.id,
        transcript_text: manualNote || "Manual note split created during offline capture.",
        priority: currentPriority,
        stage: currentStage,
      }),
      status: "pending",
      created_at: new Date().toISOString(),
    });
    setManualNote("");
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.cameraWrap}>
          <CameraView style={styles.camera} facing="back" />
          <View style={styles.overlayTop}>
            <Badge text={`Job ${jobId}`} />
            <Badge text={`Session ${sessionId}`} tone="success" />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.transcriptLabel}>Running transcript</Text>
            <Text style={styles.transcriptText}>{demoSegments[0].transcript_text}</Text>
          </View>
        </View>

        <Card>
          <View style={styles.row}>
            <Badge text={`Room: ${room.name}`} />
            <Badge text={`Assignee: ${assignee.full_name.split(" ")[0]}`} />
          </View>
          <View style={styles.row}>
            <Badge text={`Priority: ${currentPriority}`} tone={currentPriority === "high" ? "danger" : "default"} />
            <Badge text={`Stage: ${currentStage}`} tone="warning" />
          </View>
          <TextInput
            multiline
            onChangeText={setManualNote}
            placeholder="Manual note or correction. Use this when the foreman wants a clean split."
            style={styles.input}
            value={manualNote}
          />
          <View style={styles.grid}>
            <FieldButton label="Snapshot" onPress={() => setSnapshotUrl(demoSegments[0].snapshot_image_url ?? null)} />
            <FieldButton label="New note" onPress={addManualNote} variant="secondary" />
            <FieldButton label="Room" onPress={() => setCurrentRoomId(room.id === "room-1" ? "room-2" : "room-1")} variant="secondary" />
            <FieldButton label="Assign" onPress={() => setCurrentAssigneeId(assignee.id === "worker-1" ? "worker-2" : "worker-1")} variant="secondary" />
            <FieldButton label="Priority" onPress={() => setCurrentPriority(currentPriority === "high" ? "normal" : "high")} variant="secondary" />
            <FieldButton label="Stage" onPress={() => setCurrentStage(currentStage === "trim" ? "finish" : "trim")} variant="secondary" />
          </View>
          <FieldButton label="Finish session" variant="danger" />
        </Card>

        {snapshotUrl ? (
          <Card>
            <Text style={styles.snapshotTitle}>Current snapshot</Text>
            <Image source={{ uri: snapshotUrl }} style={styles.snapshot} />
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, gap: spacing.md, backgroundColor: colors.background },
  cameraWrap: { flex: 1, borderRadius: radius.lg, overflow: "hidden", backgroundColor: "#1C1B18" },
  camera: { flex: 1 },
  overlayTop: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlayBottom: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: "rgba(29,27,25,0.82)",
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  transcriptLabel: { color: "#F8F5F0", fontWeight: "700" },
  transcriptText: { color: "#F8F5F0", lineHeight: 20 },
  row: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    textAlignVertical: "top",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  snapshotTitle: { fontWeight: "700", color: colors.text },
  permissionBody: { color: colors.text, lineHeight: 21 },
  snapshot: { width: "100%", height: 180, borderRadius: radius.md },
});
