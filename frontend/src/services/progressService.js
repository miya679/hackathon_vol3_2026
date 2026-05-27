import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const PROGRESSES_COLLECTION = "progresses";

/**
 * @param {{
 *   textId: string;
 *   progressPage: number;
 * }} data
 */
export async function createProgress(data) {
  const docRef = await addDoc(collection(db, PROGRESSES_COLLECTION), {
    text_id: data.textId,
    progress_page: data.progressPage,
    updated_at: serverTimestamp(),
  });
  return docRef.id;
}
