import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const projectId =
  process.env.REACT_APP_FIREBASE_PROJECT_ID ?? "demo-hakkason";

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: "000000000000",
  appId: `1:000000000000:web:demo`,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const authEmulatorHost = process.env.REACT_APP_FIREBASE_AUTH_EMULATOR_HOST;
const firestoreEmulatorHost =
  process.env.REACT_APP_FIRESTORE_EMULATOR_HOST;

let emulatorsConnected = false;

if (!emulatorsConnected) {
  if (authEmulatorHost) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`, {
      disableWarnings: true,
    });
  }
  if (firestoreEmulatorHost) {
    const [host, port] = firestoreEmulatorHost.split(":");
    connectFirestoreEmulator(db, host, Number(port));
  }
  emulatorsConnected = true;
}
