import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const projectId =
  process.env.REACT_APP_FIREBASE_PROJECT_ID ?? "demo-hakkason";

const useEmulator =
  process.env.REACT_APP_USE_FIREBASE_EMULATOR === "true";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? "demo-api-key",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ??
    `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ??
    `${projectId}.appspot.com`,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ?? "1:000000000000:web:demo",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/** @type {"emulator" | "cloud"} */
export const firebaseMode = useEmulator ? "emulator" : "cloud";

if (useEmulator) {
  const authEmulatorHost = process.env.REACT_APP_FIREBASE_AUTH_EMULATOR_HOST;
  const firestoreEmulatorHost =
    process.env.REACT_APP_FIRESTORE_EMULATOR_HOST;

  if (authEmulatorHost) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`, {
      disableWarnings: true,
    });
  }
  if (firestoreEmulatorHost) {
    const [host, port] = firestoreEmulatorHost.split(":");
    connectFirestoreEmulator(db, host, Number(port));
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[Firebase] Emulator mode", {
      projectId,
      auth: authEmulatorHost ?? "(not set)",
      firestore: firestoreEmulatorHost ?? "(not set)",
    });
  }
} else if (process.env.NODE_ENV === "development") {
  console.info("[Firebase] Cloud Firestore", { projectId });
}
