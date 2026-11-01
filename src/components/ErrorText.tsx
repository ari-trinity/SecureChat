import { StyleSheet, Text } from "react-native";

// shows a red sentence when something goes wrong.
export function ErrorText({ message }: { message: string }) {
  // an empty message draws nothing.
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "#B00020",
    backgroundColor: "#FDECEE",
    padding: 12,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
});
