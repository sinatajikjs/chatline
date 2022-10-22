import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyApQnVX0INnEHVWG1J6A9I2FN1fi3k10Ig",
  authDomain: "authpractice-dev.firebaseapp.com",
  databaseURL: "https://authpractice-dev.firebaseio.com",
  projectId: "authpractice-dev",
  storageBucket: "authpractice-dev.appspot.com",
  messagingSenderId: "804276720826",
  appId: "1:804276720826:web:bcaf40cc006e3a42b71e83",
});

export const auth = app.auth();
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
