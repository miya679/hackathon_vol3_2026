import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const PROGRESS_COLLECTION = "progressRecords";

/**
 * @param {{
 *   materialId: string;
 *   materialTitle: string;
 *   progressPercent: number;
 *   note: string;
 *   recordedAt: string;
 * }} data
 */
export async function createProgressRecord(data) {
  const docRef = await addDoc(collection(db, PROGRESS_COLLECTION), {
    materialId: data.materialId,
    materialTitle: data.materialTitle,
    progressPercent: data.progressPercent,
    note: data.note.trim(),
    recordedAt: data.recordedAt,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
