import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";

const User = ({ c, selectHandler }) => {
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
          className="w-14 h-14 rounded-full cursor-pointer object-cover"
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
    </section>
  );
};

export default User;
