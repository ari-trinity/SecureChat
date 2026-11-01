// initializeApp starts firebase. getApps and getApp reuse it if it is already started.
import { getApp, getApps, initializeApp } from "firebase/app";
// these three tools handle sign-in. asyncstorage keeps the login on the phone.
import {
	getAuth,
	getReactNativePersistence,
	initializeAuth,
	type Auth,
} from "firebase/auth";
// getFirestore opens the shared notebook.
import { getFirestore } from "firebase/firestore";
// this is the phone storage used as the login sticky note.
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// read one setting from .env. if it is missing, stop with a clear message.
function required(name: string): string {
  // expo copies EXPO_PUBLIC_ values into process.env when the server starts.
  const value = process.env[name];
  // a missing value means the .env file is incomplete or the server was not restarted.
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env, save, then restart Expo.`,
    );
  }
  // hand the text back to the caller.
  return value;
}

// the address book firebase gave you in the web setup.
const firebaseConfig = {
  apiKey: required("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: required("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: required("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: required("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: required("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: required("EXPO_PUBLIC_FIREBASE_APP_ID"),
};

// start firebase, or grab the copy that is already started.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// auth is declared here so the try/catch below can fill it in.
let auth: Auth;

try {
  // start auth and tell it to keep the login in asyncstorage.
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  // fast refresh can start auth twice. the second time, reuse the first one.
  auth = getAuth(app);
}

// open the notebook.
const db = getFirestore(app);

// other files import these two objects.
export { auth, db };

