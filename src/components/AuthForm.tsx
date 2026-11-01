// useState remembers what the person types.
import { useState } from "react";
// the basic phone widgets.
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
// a small icon next to the title.
import { Ionicons } from "@expo/vector-icons";
// the red error sentence.
import { ErrorText } from "@/components/ErrorText";

// what the parent screen must pass in.
type AuthFormProps = {
  title: string;
  buttonLabel: string;
  footerText: string;
  footerLinkText: string;
  // called with the email and password when the button is pressed.
  onSubmit: (email: string, password: string) => Promise<void>;
  // called when the person taps the link at the bottom.
  onFooterPress: () => void;
};

export function AuthForm({
  title,
  buttonLabel,
  footerText,
  footerLinkText,
  onSubmit,
  onFooterPress,
}: AuthFormProps) {
  // the words in the email box.
  const [email, setEmail] = useState("");
  // the words in the password box.
  const [password, setPassword] = useState("");
  // true while firebase is working, so we can disable the button.
  const [busy, setBusy] = useState(false);
  // a sentence to show when firebase says no.
  const [error, setError] = useState("");

  // runs when the main button is pressed.
  async function handlePress() {
    // clear the old error.
    setError("");
    // show the spinner on the button.
    setBusy(true);
    try {
      // ask the parent screen to log in or sign up.
      await onSubmit(email, password);
    } catch (err) {
      // show the friendly sentence.
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      // whether it worked or failed, the button can be pressed again.
      setBusy(false);
    }
  }

  return (
    // this box slides up when the keyboard covers the inputs.
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Ionicons name="chatbubbles" size={42} color="#3D5AFE" />
        <Text style={styles.title}>{title}</Text>
        <ErrorText message={error} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="you@email.com"
          placeholderTextColor="#9AA3B2"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 6 characters"
          placeholderTextColor="#9AA3B2"
        />

        <Pressable style={styles.button} onPress={handlePress} disabled={busy}>
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          )}
        </Pressable>

        <Pressable onPress={onFooterPress} style={styles.footer}>
          <Text style={styles.footerText}>
            {footerText} <Text style={styles.footerLink}>{footerLinkText}</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    justifyContent: "center",
    padding: 20,
  },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B2430",
    marginTop: 8,
    marginBottom: 16,
  },
  label: { color: "#526074", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#D5DDEA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1B2430",
    backgroundColor: "#F9FAFC",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3D5AFE",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  footer: { marginTop: 16, alignItems: "center" },
  footerText: { color: "#526074" },
  footerLink: { color: "#3D5AFE", fontWeight: "700" },
});
