import type { Message } from "@/types/models";
import { StyleSheet, Text, View } from "react-native";

type MessageBubbleProps = {
  message: Message;
  mine: boolean;
};

export function MessageBubble({ message, mine }: MessageBubbleProps) {
  // show a clock time when firebase has stored one. otherwise the write is still finishing.
  const time = message.createdAt
    ? message.createdAt.toDate().toLocaleTimeString()
    : "Sending...";

  return (
    <View style={[styles.row, mine ? styles.mineRow : styles.theirRow]}>
      <View
        style={[styles.bubble, mine ? styles.mineBubble : styles.theirBubble]}
      >
        <Text style={[styles.text, mine ? styles.mineText : styles.theirText]}>
          {message.text}
        </Text>
        <Text style={[styles.time, mine ? styles.mineTime : styles.theirTime]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 4, paddingHorizontal: 12 },
  mineRow: { alignItems: "flex-end" },
  theirRow: { alignItems: "flex-start" },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mineBubble: { backgroundColor: "#3D5AFE" },
  theirBubble: { backgroundColor: "#FFFFFF" },
  text: { fontSize: 16 },
  mineText: { color: "#FFFFFF" },
  theirText: { color: "#1B2430" },
  time: { fontSize: 11, marginTop: 4 },
  mineTime: { color: "#D6DEFF" },
  theirTime: { color: "#8090A6" },
});
