import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "certicheck-jharkhand",
  appId: "1:336211913773:web:f9ce0445a7aa9bc000dca4",
  storageBucket: "certicheck-jharkhand.firebasestorage.app",
  apiKey: "AIzaSyA0HtcjxK0_2Lg5Yc3ndy0n78KklpP9eSs",
  authDomain: "certicheck-jharkhand.firebaseapp.com",
  messagingSenderId: "336211913773",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
