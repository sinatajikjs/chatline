import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";

const NewChat = ({ chats, setModal }) => {
  const usernameRef = useRef();

  const { currentUser } = useAuth();

  function submitHandler(e) {
    e.preventDefault();
    const usernameValue = usernameRef.current.value;

    const myToast = toast.loading("Adding...");

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", usernameValue));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        return toast.error("User Does not exist", {
          id: myToast,
        });
      }
      querySnapshot.forEach((res) => {
        const userExist = chats.find((u) => {
          return u.uid === res.data().uid;
        });
        if (userExist) {
          setModal(false);
          return toast.success("Chat is already Exist", {
            id: myToast,
          });
        }

        setDoc(doc(db, "chats", currentUser.uid, "chats", res.data().uid), {
          id: res.data().uid,
          createdAt: Timestamp.fromDate(new Date()),
        }).then(() => {
          setModal(false);
          toast.success("SuccessFully Added", {
            id: myToast,
          });
        });
      });
    });
  }

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="w-screen h-screen bg-modalBg z-10 absolute left-0 top-0"
      ></div>

      <form
        onSubmit={submitHandler}
        className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white drop-shadow-xl py-4 px-8 rounded-md w-80 border border-gray-300"
      >
        <h2 className="text-3xl font-semibold mb-5">New Chat</h2>
        <div>
          <label htmlFor="text">Username</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mb-1 mt-1"
            type="text"
            required
            name="text"
            ref={usernameRef}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded text-lg mt-4 w-full"
        >
          Add
        </button>

        <button
          onClick={() => setModal(false)}
          className="mt-4 text-blue-600 underline"
          to={"/dashboard"}
        >
          Cancel
        </button>
      </form>
    </>
  );
};

export default NewChat;
