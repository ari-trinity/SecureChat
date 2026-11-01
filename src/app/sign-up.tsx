import { AuthForm } from "@/components/AuthForm";
import { friendlyAuthError, registerWithEmail } from "@/lib/auth";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <AuthForm
      title="Create account"
      buttonLabel="Sign up"
      footerText="Already have an account?"
      footerLinkText="Log in"
      onFooterPress={() => router.back()}
      onSubmit={async (email, password) => {
        try {
          await registerWithEmail(email, password);
        } catch (error) {
          throw new Error(friendlyAuthError(error));
        }
      }}
    />
  );
}
