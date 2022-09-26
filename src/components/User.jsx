import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";

const User = ({ c, deleteHandler, selectHandler }) => {
  const [lastMsg, setLastMsg] = useState(null);
  const { currentUser } = useAuth();

  const id =
    currentUser.uid > c.uid
      ? `${currentUser.uid + c.uid}`
      : `${c.uid + currentUser.uid}`;

  useEffect(() => {
    onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setLastMsg(doc.data());
    });
  }, []);

  return (
    <section key={c.uid} className="flex items-center justify-between relative">
      <div
        onClick={selectHandler}
        data-id={c.uid}
        className="flex items-center 
      w-full py-3 border-b cursor-pointer"
      >
        <img
          className="w-14 h-14 rounded-full border-2 border-gray-400 cursor-pointer object-cover"
          src={c.photoURL}
        />
        <span className="ml-2">
          <h2 className="text-xl">{c.name}</h2>
          {lastMsg && (
            <p className="text-gray-500">{`${
              lastMsg.from === currentUser.uid ? "You: " : ""
            }${lastMsg.text.substr(0, 19)}${
              lastMsg.text.length > 19 ? "..." : ""
            }`}</p>
          )}
        </span>
      </div>
      <div
        onClick={deleteHandler}
        data-id={c.uid}
        className="absolute right-0 p-3 pr-0 cursor-pointer"
      >
        <IoTrashOutline className="text-3xl text-red-500 mr-1" />
      </div>
    </section>
  );
};

export default User;
