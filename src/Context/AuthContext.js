import React, { useContext, useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
  setDoc,
  doc,
  Timestamp,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { updateProfile, updateProfileInfo } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  function signup(name, email, password) {
    const photoURL =
      "https://firebasestorage.googleapis.com/v0/b/authpractice-dev.appspot.com/o/avatar%2Fuser.jpg?alt=media&token=c52387c3-0e60-46f5-9f45-7d09014a9f76";

    return auth.createUserWithEmailAndPassword(email, password).then((res) => {
      res.user.updateProfile({
        displayName: name,
        photoURL,
      });

      setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        photoURL,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: false,
      });
    });
  }

  function checkUserEmail(email) {
    return auth.fetchSignInMethodsForEmail(email);
  }

  async function checkUsername(username) {
    const userRef = doc(db, "users", currentUser.uid);
    const thisUser = (await getDoc(userRef)).data();
    if (thisUser.username === username) return false;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    let user;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });
    return user;
  }

  function updateUsername(uid, username) {
    const usersRef = doc(db, "users", uid);
    return updateDoc(usersRef, { username }).then(() => setUser({ username }));
  }

  async function getUser(uid) {
    const usersRef = doc(db, "users", uid);
    return (await getDoc(usersRef)).data();
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  async function logout() {
    const currentUserRef = doc(db, "users", currentUser.uid);
    await updateDoc(currentUserRef, {
      isOnline: Date.now(),
    });
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function updateProfileInfo(user) {
    return updateProfile(currentUser, user);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) getUser(currentUser.uid).then((res) => setUser(res));
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    checkUserEmail,
    updateProfileInfo,
    checkUsername,
    updateUsername,
    getUser,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
