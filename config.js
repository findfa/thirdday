// Replace the config object below with your Firebase project's config.
// Keep these keys in client code; they're safe to expose. Restrict access in Firebase Console.
export const firebaseConfig = {
  apiKey: "AIzaSyBsmeQU6fFFkROQvhbchDTfwxNmd-eIvV8",
    authDomain: "thirdday-d10ad.firebaseapp.com",
    projectId: "thirdday-d10ad",
    storageBucket: "thirdday-d10ad.firebasestorage.app",
    messagingSenderId: "251215364464",
    appId: "1:251215364464:web:f12b9bc01c0f6f1e584fb5"
};

// Firebase v10 modular imports from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendEmailVerification, updateProfile,
  signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Re-export useful functions for convenience
export {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendEmailVerification, updateProfile,
  signOut, sendPasswordResetEmail,
  doc, setDoc, getDoc, collection, getDocs, query, where, serverTimestamp
};
