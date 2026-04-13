import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/Card";
import { FieldButton } from "@/components/FieldButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { fetchRooms } from "@/lib/supabase/queries";

export function RoomListScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { data: rooms = [] } = useQuery({ queryKey: ["rooms", jobId], queryFn: () => fetchRooms(jobId) });

  return (
    <Screen>
      <Text style={styles.title}>Rooms</Text>
      <FieldButton label="Add room label" />
      {rooms.map((room) => (
        <Link href={`/jobs/${jobId}/rooms/${room.id}`} key={room.id} asChild>
          <Pressable>
            <Card>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.meta}>{room.floor_name ?? "Unassigned floor"}</Text>
              <Text style={styles.meta}>{room.notes}</Text>
            </Card>
          </Pressable>
        </Link>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  roomName: { fontWeight: "700", fontSize: 17, color: colors.text },
  meta: { color: colors.textMuted },
});
