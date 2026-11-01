import { ErrorText } from "@/components/ErrorText";
import { useAuth } from "@/context/AuthContext";
import { startChat } from "@/lib/chat";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

export default function NewChatScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    if (!user?.email) return;
    setError("");
    setBusy(true);
    try {
      const roomId = await startChat(user.email, email);
      // replace means Back returns to the chat list, not to this form.
      router.replace(`/chat/${encodeURIComponent(roomId)}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not start the chat.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.help}>
        Type the email of someone who already made an account.
      </Text>
      <ErrorText message={error} />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="friend@email.com"
        placeholderTextColor="#9AA3B2"
      />
      <Pressable style={styles.button} onPress={handleStart} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Start chat</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6FB", padding: 16 },
  help: { color: "#526074", marginBottom: 12 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5DDEA",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1B2430",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#3D5AFE",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
