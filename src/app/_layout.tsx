// draws the stack of screens and the protected ropes.
import { Stack } from "expo-router";
// the status-bar color helper that ships with expo.
import { StatusBar } from "expo-status-bar";
// keeps content out from under the notch.
import { SafeAreaProvider } from "react-native-safe-area-context";
// the megaphone.
import { AuthProvider, useAuth } from "@/context/AuthContext";
// the full-screen spinner.
import { LoadingView } from "@/components/LoadingView";

// this inner piece can read the megaphone because it sits inside AuthProvider.
function RootNavigator() {
  // ask who is logged in, and whether we are still checking.
  const { user, loading } = useAuth();

  // show the spinner until the sticky note has been read.
  if (loading) {
    return <LoadingView />;
  }

  return (
    <Stack>
      {/* chat screens exist only while someone is logged in. otherwise send them to sign-in. */}
      <Stack.Protected guard={user !== null} redirectTo="/sign-in">
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      {/* the door screens exist only while nobody is logged in. */}
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ title: "Create account" }} />
      </Stack.Protected>
    </Stack>
  );
}

// the real root. the provider must wrap the navigator.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
