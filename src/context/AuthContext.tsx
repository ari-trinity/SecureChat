// tools for sharing data, and for running code when the screen appears.
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
// the listener that fires whenever login changes. User is firebase's person object.
import { onAuthStateChanged, type User } from "firebase/auth";
// the door object from the previous file.
import { auth } from "@/lib/firebase";

// what every screen is allowed to read from the megaphone.
type AuthContextValue = {
  // the logged-in person, or null if nobody is logged in.
  user: User | null;
  // true while firebase is still checking the sticky note.
  loading: boolean;
};

// the box that holds that value. undefined means a screen forgot to stand inside the provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// this component wraps the app and keeps the login value up to date.
export function AuthProvider({ children }: { children: ReactNode }) {
  // start with nobody logged in.
  const [user, setUser] = useState<User | null>(null);
  // start in the loading state so we do not flash the login screen at a person who is already in.
  const [loading, setLoading] = useState(true);

  // run once when the provider appears.
  useEffect(() => {
    // subscribe to login changes. nextUser is the person, or null.
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      // save the person so every screen can see them.
      setUser(nextUser);
      // the check is finished.
      setLoading(false);
    });
    // when the provider goes away, stop listening.
    return unsubscribe;
  }, []);

  // share user and loading with every child screen.
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// a helper so screens can read the megaphone in one line.
export function useAuth() {
  // read whatever the provider shared.
  const value = useContext(AuthContext);
  // if there is no provider above this screen, say so immediately.
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  // hand back the user and the loading flag.
  return value;
}
