import { ChatListItem } from "@/components/ChatListItem";
import { ErrorText } from "@/components/ErrorText";
import { LoadingView } from "@/components/LoadingView";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import { db } from "@/lib/firebase";
import type { ChatRoom } from "@/types/models";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function ChatListScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // wait until we know the email. the layout already keeps logged-out people away.
    if (!user?.email) return;
    const myEmail = user.email.toLowerCase();

    // rooms whose participants list contains me.
    const roomsQuery = query(
      collection(db, "chatRooms"),
      where("participants", "array-contains", myEmail),
    );

    // onSnapshot stays connected. every change calls this function again.
    const unsubscribe = onSnapshot(
      roomsQuery,
      (snapshot) => {
        const next = snapshot.docs.map((item) => {
          const data = item.data() as Omit<ChatRoom, "id">;
          return { id: item.id, ...data };
        });
        // newest activity first. missing times sink to the bottom.
        next.sort(
          (a, b) =>
            (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0),
        );
        setRooms(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    // leaving the screen hangs up the listener.
    return unsubscribe;
  }, [user?.email]);

  // put Log out in the header.
  const headerRight = () => (
    <Pressable onPress={() => logout()} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>Log out</Text>
    </Pressable>
  );

  if (loading) return <LoadingView />;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Chats", headerRight }} />
      <ErrorText message={error} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No chats yet. Tap the blue button to start one.
          </Text>
        }
        renderItem={({ item }) => {
          const other =
            item.participants.find(
              (email) => email !== user?.email?.toLowerCase(),
            ) ?? "Chat";
          return (
            <ChatListItem
              title={other}
              preview={item.lastMessage}
              onPress={() =>
                router.push(`/chat/${encodeURIComponent(item.id)}`)
              }
            />
          );
        }}
      />
      <Pressable style={styles.fab} onPress={() => router.push("/new-chat")}>
        <Ionicons name="create" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6FB" },
  list: { padding: 16, paddingBottom: 90 },
  empty: { textAlign: "center", color: "#526074", marginTop: 40 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3D5AFE",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButton: { paddingHorizontal: 8 },
  headerButtonText: { color: "#3D5AFE", fontWeight: "700" },
});
