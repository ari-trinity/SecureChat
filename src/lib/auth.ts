// the three door actions.
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
// setDoc writes a document. doc points at one document. serverTimestamp asks firebase for the current time.
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// the door and the notebook.
import { auth, db } from "@/lib/firebase";

// turn firebase's code-style errors into a sentence a person can read.
export function friendlyAuthError(error: unknown): string {
  // pull the code off the error object when it has one.
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: string }).code)
      : "";

  // each code gets a plain sentence.
  if (code === "auth/email-already-in-use")
    return "That email already has an account. Try logging in.";
  if (code === "auth/invalid-email") return "That email does not look right.";
  if (code === "auth/weak-password")
    return "Use a password with at least 6 characters.";
  if (code === "auth/invalid-credential")
    return "Email or password is incorrect.";
  if (code === "auth/too-many-requests")
    return "Too many tries. Wait a minute and try again.";
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

// create the door account, then write the email card into the notebook.
export async function registerWithEmail(email: string, password: string) {
  // clean the email so lookups always match.
  const cleanEmail = email.trim().toLowerCase();
  // ask firebase authentication to create the account.
  const credential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password,
  );
  // write users/{their-id} so other people can start a chat with this email.
  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    email: cleanEmail,
    createdAt: serverTimestamp(),
  });
  // hand the new person back to the screen.
  return credential.user;
}

// check an email and password that already exist.
export async function loginWithEmail(email: string, password: string) {
  // firebase compares the password. on success, the megaphone updates by itself.
  await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
}

// forget the sticky note and return to the door.
export async function logout() {
  await signOut(auth);
}
