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
  const [currentUser, setCurrentUser] = useState();
  const [user, setUser] = useState(null);
  const [recepId, setRecepId] = useLocalStorage("recepId", "");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function checkUsername(username) {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const thisUser = (await getDoc(userRef)).data();
      if (thisUser.username === username) return false;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    let user;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });
    return user;
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
          displayName: name,
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
      const { photoURL, displayName, email, uid } = result.user;

      myToast = toast.loading("Signing In...");
      if (result._tokenResponse.isNewUser) {
        setDoc(doc(db, "users", uid), {
          uid,
          photoURL,
          name: displayName,
          email,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    });
  }

  function signInWithGithub() {
    const Github = new GithubAuthProvider();

    signInWithPopup(auth, Github).then((result) => {
      const { photoURL, displayName, email, uid } = result.user;

      myToast = toast.loading("Signing In...");
      if (result._tokenResponse.isNewUser) {
        setDoc(doc(db, "users", uid), {
          uid,
          photoURL,
          name: displayName,
          email,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
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

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function updateProfileInfo(user) {
    return updateProfile(currentUser, user);
  }

  if (currentUser) {
    const currentUserRef = doc(db, "users", currentUser.uid);
    window.addEventListener("beforeunload", function (e) {
      updateDoc(currentUserRef, {
        status: Date.now(),
      });
    });

    document.addEventListener(
      "visibilitychange",
      function () {
        updateDoc(currentUserRef, {
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
        setCurrentUser(user);
        return setLoading(false);
      }
      const usersRef = doc(db, "users", user.uid);
      getDoc(usersRef).then((res) => {
        setCurrentUser(user);
        setLoading(false);
        setUser(res);
      });

      const currentUserRef = doc(db, "users", user.uid);
      updateDoc(currentUserRef, {
        status: "online",
      });
      if (!myToast) return;
      toast.success("SuccessFully Signed In", { id: myToast });
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    checkUserEmail,
    signInWithGoogle,
    signInWithGithub,
    updateProfileInfo,
    checkUsername,
    user,
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
