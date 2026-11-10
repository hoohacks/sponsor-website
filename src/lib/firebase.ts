import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore/lite";

// Points at the current season's HackX Firebase project. See .env.example.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function getDb(): Firestore {
  if (!config.projectId || !config.apiKey) {
    throw new Error("Firebase isn't configured. Set the VITE_FIREBASE_* variables (see .env.example).");
  }
  const app = getApps().length ? getApp() : initializeApp(config);
  return getFirestore(app);
}
