import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const USERS_COLLECTION = "users";

/**
 * @param {string} uid
 * @param {string} mailAddress
 */
export async function ensureUserProfile(uid, mailAddress) {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      mail_address: mailAddress,
      created_at: serverTimestamp(),
    });
  } else if (snap.data().mail_address !== mailAddress && mailAddress) {
    await setDoc(ref, { mail_address: mailAddress }, { merge: true });
  }

  return getUserProfile(uid);
}

/**
 * @param {string} uid
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
