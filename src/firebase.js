import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyApQnVX0INnEHVWG1J6A9I2FN1fi3k10Ig",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const auth = app.auth();
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
