import React, { useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import {
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  GithubAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../Hooks/useLocalStorage";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
let myToast;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [recepId, setRecepId] = useLocalStorage("recepId", "");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function checkUsername(username) {
    if (user) {
      if (user.username === username) return false;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    let userInfo;
    querySnapshot.forEach((doc) => {
      userInfo = doc.data();
    });
    return userInfo;
  }

  async function signup(name, email, password, photoURL, username, bio) {
    myToast = toast.loading("Signing Up...");

    const userNameExist = await checkUsername(username);

    if (userNameExist) return toast.error("Username is Taken", { id: myToast });

    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        navigate("/");
        res.user.updateProfile({
          fullName: name,
          photoURL,
        });

        setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          photoURL: photoURL || "",
          fullName: name,
          username,
          bio: bio || "",
          email,
          createdAt: Timestamp.fromDate(new Date()),
        });
      })
      .catch(() => {
        toast.error("Failed to create an account", {
          id: myToast,
        });
      });
  }

  function signInWithGoogle() {
    const Google = new GoogleAuthProvider();

    signInWithPopup(auth, Google).then((result) => {
      const { photoURL, fullName, email, uid } = result.user;

      myToast = toast.loading("Signing In...");
      if (result._tokenResponse.isNewUser) {
        setDoc(doc(db, "users", uid), {
          uid,
          photoURL,
          fullName: fullName,
          email,
          createdAt: Timestamp.fromDate(new Date()),
        });
      } else {
        navigate("/");
      }
    });
  }

  async function updateProfile(fullName, username, bio, imgUrl) {
    const usersRef = doc(db, "users", user.uid);
    await updateDoc(usersRef, {
      fullName,
      username,
      photoURL: imgUrl,
      bio,
    });
    return getDoc(usersRef).then((res) => {
      setUser(res.data());
    });
  }

  function checkUserEmail(email) {
    return auth.fetchSignInMethodsForEmail(email);
  }

  function login(email, password) {
    myToast = toast.loading("Signing In...");
    auth.signInWithEmailAndPassword(email, password).catch(() => {
      toast.error("Email or Password is Incorrect", { id: myToast });
    });
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  if (user) {
    const userRef = doc(db, "users", user.uid);
    window.addEventListener("beforeunload", function (e) {
      updateDoc(userRef, {
        status: Date.now(),
      });
    });

    document.addEventListener(
      "visibilitychange",
      function () {
        updateDoc(userRef, {
          status: document.hidden ? Date.now() : "online",
        });
      },
      false
    );
  }

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
        if (myToast) {
          toast.success("SuccessFully Signed In", { id: myToast });
        }
      });

      const userRef = doc(db, "users", user.uid);
      updateDoc(userRef, {
        status: "online",
      });
    });
    return unsubscribe;
  }, []);

  const value = {
    login,
    signup,
    logout,
    resetPassword,
    checkUserEmail,
    signInWithGoogle,
    checkUsername,
    user,
    updateProfile,
    recepId,
    setRecepId,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <Toaster position="top-center" reverseOrder={false} />
    </AuthContext.Provider>
  );
}
