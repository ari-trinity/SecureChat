import { AuthForm } from "@/components/AuthForm";
import { friendlyAuthError, loginWithEmail } from "@/lib/auth";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  // useRouter lets us jump to another file-screen.
  const router = useRouter();

  return (
    <AuthForm
      title="Welcome back"
      buttonLabel="Log in"
      footerText="New here?"
      footerLinkText="Create an account"
      onFooterPress={() => router.push("/sign-up")}
      onSubmit={async (email, password) => {
        try {
          // a successful login updates the megaphone, and the rope opens the chat list by itself.
          await loginWithEmail(email, password);
        } catch (error) {
          // re-throw the friendly sentence so the form can show it.
          throw new Error(friendlyAuthError(error));
        }
      }}
    />
  );
}
