import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDC_NyQhQn0ZhPYWclqYObstmMOHf-FYAU",
  authDomain: "messanger-eefed.firebaseapp.com",
  projectId: "messanger-eefed",
  storageBucket: "messanger-eefed.appspot.com",
  messagingSenderId: "948608976444",
  appId: "1:948608976444:web:6f246185549c67780be539",
  databaseURL: "https://messanger-eefed.firebaseio.com",
});

export const auth = app.auth();
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
