import { Pressable, StyleSheet, Text, View } from "react-native";

type ChatListItemProps = {
  title: string;
  preview: string;
  onPress: () => void;
};

export function ChatListItem({ title, preview, onPress }: ChatListItemProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{title.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.words}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {preview || "No messages yet"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E7ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#3D5AFE", fontWeight: "700", fontSize: 18 },
  words: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: "#1B2430" },
  preview: { marginTop: 2, color: "#526074" },
});
