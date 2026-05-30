import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

const TEXTS_COLLECTION = "texts";

export async function createText(textData) {
  const docRef = await addDoc(
    collection(db, TEXTS_COLLECTION),
    textData
  );

  return docRef.id;
}