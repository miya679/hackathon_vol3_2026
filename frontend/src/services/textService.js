import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const TEXTS_COLLECTION = "texts";

export async function fetchTexts() {
  const snapshot = await getDocs(collection(db, TEXTS_COLLECTION));
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      text_name: doc.data().text_name ?? "（無題）",
      text_range: doc.data().text_range ?? "",
      text_type: doc.data().text_type ?? "",
      user_id: doc.data().user_id ?? "",
      ...doc.data(),
    }))
    .sort((a, b) => a.text_name.localeCompare(b.text_name, "ja"));
}
