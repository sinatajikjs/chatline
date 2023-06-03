import React, { useContext, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { auth, db } from "../firebase";
import {
  setDoc,
  doc,
  Timestamp,
  collection,
  query,
  where,
  updateDoc,
  getDoc,
  getDocs,
  deleteField,
} from "firebase/firestore";
import { RecaptchaVerifier } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
let myToast;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isOnline, setIsOnline] = useState(false);

  const [loading, setLoading] = useState(true);

  async function checkUsername(username) {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("username", "==", username),
      where("username", "!=", user.username)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  async function signIn(phoneNumber) {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "sign-in-button",
        {
          size: "invisible",
          callback: (response) => {},
        },
        auth
      );
    }
    return await auth
      .signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      .then((result) => {
        window.confirmationResult = result;
      });
  }

  async function confirmOTP(code) {
    const confirmationResult = window.confirmationResult;
    return await confirmationResult.confirm(code).then((res) => {
      const { uid, phoneNumber } = res.user;
      if (res.additionalUserInfo?.isNewUser) {
        setDoc(doc(db, "users", uid), {
          uid,
          phoneNumber,
          photoURL: "",
          firstName: "",
          lastName: "",
          username: "",
          bio: "",
          status: "",
          isNewUser: true,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    });
  }

  async function updateProfile(firstName, lastName, username, bio, photoURL) {
    const usersRef = doc(db, "users", user.uid);
    await updateDoc(usersRef, {
      firstName,
      lastName,
      username,
      photoURL,
      isNewUser: deleteField(),
      bio,
    });
    return getDoc(usersRef).then((res) => {
      setUser(res.data());
    });
  }

  function logout() {
    setIsOnline(false);
    localStorage.removeItem("messanger-chats");
    return auth.signOut();
  }

  window.addEventListener("beforeunload", function (e) {
    setIsOnline(false);
  });

  document.addEventListener(
    "visibilitychange",
    function () {
      setIsOnline(!document.hidden);
    },
    false
  );

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    updateDoc(userRef, {
      status: isOnline ? "online" : Date.now(),
    });
  }, [isOnline]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
        return setLoading(false);
      }

      const usersRef = doc(db, "users", user.uid);
      getDoc(usersRef).then((res) => {
        setLoading(false);
        setUser(res.data());
      });

      setIsOnline(true);
    });
    return unsubscribe;
  }, []);

  const value = {
    signIn,
    logout,
    isOnline,
    checkUsername,
    user,
    updateProfile,
    confirmOTP,
    isProfileOpen,
    setIsProfileOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <Toaster position="top-center" reverseOrder={false} />
    </AuthContext.Provider>
  );
}
