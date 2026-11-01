import { Stack } from "expo-router";

// the header bar for the screens inside the clubhouse.
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Chats" }} />
      <Stack.Screen name="new-chat" options={{ title: "New chat" }} />
      <Stack.Screen name="chat/[roomId]" options={{ title: "Chat" }} />
    </Stack>
  );
}
