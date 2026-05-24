import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
    projectId: "demo-hakkason",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

connectFirestoreEmulator(db, "localhost", 8080);

export { db };