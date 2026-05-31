import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

const TEXTS_COLLECTION = "texts";

function mapTextDoc(doc) {
  const d = doc.data();
  const { text_range: _omitRange, ...rest } = d;
  return {
    id: doc.id,
    text_name: rest.text_name ?? "（無題）",
    text_type: rest.text_type ?? "",
    user_id: rest.user_id ?? "",
    ...rest,
  };
}

function sortTexts(list) {
  return list.sort((a, b) => a.text_name.localeCompare(b.text_name, "ja"));
}

export async function fetchTexts() {
  const snapshot = await getDocs(collection(db, TEXTS_COLLECTION));
  return sortTexts(snapshot.docs.map(mapTextDoc));
}

/**
 * @param {string} userId
 */
export async function fetchTextsByUserId(userId) {
  const q = query(
    collection(db, TEXTS_COLLECTION),
    where("user_id", "==", userId)
  );
  const snapshot = await getDocs(q);
  return sortTexts(snapshot.docs.map(mapTextDoc));
}
