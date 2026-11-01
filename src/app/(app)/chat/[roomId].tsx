import { ErrorText } from "@/components/ErrorText";
import { LoadingView } from "@/components/LoadingView";
import { MessageBubble } from "@/components/MessageBubble";
import { useAuth } from "@/context/AuthContext";
import { sendMessage } from "@/lib/chat";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/models";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from "react-native";

export default function ChatScreen() {
  const { user } = useAuth();
  // the room id from the address. it can arrive as a string or a list; we want one string.
  const params = useLocalSearchParams<{ roomId: string }>();
  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [title, setTitle] = useState("Chat");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // a handle on the list so we can scroll it.
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (!roomId) return;
    // watch the room document for the other person's email.
    const unsubscribe = onSnapshot(doc(db, "chatRooms", roomId), (snapshot) => {
      if (!snapshot.exists()) {
        setError("This chat does not exist.");
        return;
      }
      const participants = (snapshot.data().participants as string[]) ?? [];
      const other = participants.find(
        (email) => email !== user?.email?.toLowerCase(),
      );
      if (other) setTitle(other);
    });
    return unsubscribe;
  }, [roomId, user?.email]);

  useEffect(() => {
    if (!roomId) return;
    // live messages, oldest first, so the newest one is at the bottom.
    const messagesQuery = query(
      collection(db, "chatRooms", roomId, "messages"),
      orderBy("createdAt", "asc"),
    );
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const next = snapshot.docs.map((item) => {
          const data = item.data() as Omit<Message, "id">;
          return { id: item.id, ...data };
        });
        setMessages(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [roomId]);

  // whenever the list grows, jump to the newest line.
  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  async function handleSend() {
    if (!user?.email || !roomId) return;
    const text = draft;
    // clear the box immediately so the person can type the next line.
    setDraft("");
    try {
      await sendMessage(roomId, text, user.uid, user.email);
    } catch (err) {
      // put the text back if the save failed.
      setDraft(text);
      setError(
        err instanceof Error ? err.message : "Could not send the message.",
      );
    }
  }

  if (loading) return <LoadingView />;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <Stack.Screen options={{ title }} />
      <ErrorText message={error} />
      <FlatList
        ref={listRef}
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} mine={item.senderId === user?.uid} />
        )}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
      />
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message"
          placeholderTextColor="#9AA3B2"
        />
        <Pressable style={styles.send} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#E7ECF5" },
  list: { flex: 1 },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1B2430",
    marginRight: 8,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3D5AFE",
    alignItems: "center",
    justifyContent: "center",
  },
});
