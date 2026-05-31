import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const PROGRESSES_COLLECTION = "progresses";

/**
 * @param {{
 *   textId: string;
 *   pageStart: number;
 *   pageEnd: number;
 *   labels?: string[];
 * }} data
 */
export async function createProgress(data) {
  const a = Math.min(data.pageStart, data.pageEnd);
  const b = Math.max(data.pageStart, data.pageEnd);

  const payload = {
    text_id: data.textId,
    page_start: a,
    page_end: b,
    updated_at: serverTimestamp(),
  };

  if (Array.isArray(data.labels) && data.labels.length > 0) {
    payload.labels = data.labels;
  }

  const docRef = await addDoc(collection(db, PROGRESSES_COLLECTION), payload);
  return docRef.id;
}

/**
 * progresses コレクションを全件取得します
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchProgresses() {
  const snapshot = await getDocs(
    collection(db, PROGRESSES_COLLECTION)
  );

  return snapshot.docs.map((doc) => {
    const d = doc.data();
    const { progress_page: _omitProgressPage, ...rest } = d;
    return {
      id: doc.id,
      ...rest,
    };
  });
}
