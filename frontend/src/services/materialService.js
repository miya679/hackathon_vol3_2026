import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const MATERIALS_COLLECTION = "materials";

export async function fetchMaterials() {
  const snapshot = await getDocs(collection(db, MATERIALS_COLLECTION));
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      title: doc.data().title ?? "（無題）",
      description: doc.data().description ?? "",
      ...doc.data(),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "ja"));
}
