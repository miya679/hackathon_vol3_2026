import {

  browserLocalPersistence,

  createUserWithEmailAndPassword,

  GoogleAuthProvider,

  onAuthStateChanged,

  setPersistence,

  signInWithEmailAndPassword,

  signInWithPopup,

  signOut,

} from "firebase/auth";

import { auth } from "../lib/firebase";



const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });



export function subscribeAuth(callback) {

  return onAuthStateChanged(auth, callback);

}



export async function signIn(email, password) {

  return signInWithEmailAndPassword(auth, email, password);

}



export async function signUp(email, password) {

  return createUserWithEmailAndPassword(auth, email, password);

}



export async function signInWithGoogle() {

  await setPersistence(auth, browserLocalPersistence);

  return signInWithPopup(auth, googleProvider);

}



export async function signOutUser() {

  return signOut(auth);

}


