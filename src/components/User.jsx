import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import useLocalStorage from "../Hooks/useLocalStorage";

const User = ({ chat }) => {
  const { user } = useAuth();

  const [recep, setRecep] = useState(null);

  const [lastMsg, setLastMsg] = useLocalStorage(
    `${user.uid}-lastmsgs-${chat.uid}`,
    null
  );
  const [chatData, setChatData] = useLocalStorage(
    `${user.uid}-chatsData-${chat.uid}`,
    {}
  );
  const [unreadMsgs, setUnreadMsgs] = useState("");

  const id =
    user.uid > chat.uid ? `${user.uid + chat.uid}` : `${chat.uid + user.uid}`;

  useEffect(() => {
    const usersRef = doc(db, "users", chat.uid);

    const onsub1 = onSnapshot(usersRef, (doc) => {
      setChatData(doc.data());
      if (recep?.uid === doc.data().uid) setRecep(doc.data());
    });

    const onsub2 = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      if (doc.data()) setLastMsg(doc.data());
    });

    const messagesRef = collection(db, "messages", id, "chat");
    const receivedUnreadMsgs = query(
      messagesRef,
      where("to", "==", user.uid),
      where("seen", "==", "sent")
    );
    const onsub3 = onSnapshot(receivedUnreadMsgs, (snap) => {
      setUnreadMsgs(snap.size);
    });

    return () => {
      onsub1();
      onsub2();
      onsub3();
    };
  }, []);

  return (
    <NavLink
      state={{ chatData: chatData }}
      to={`/${chatData?.username || chatData?.phoneNumber}`}
      className={(navData) =>
        `flex items-center w-full py-3 border-b cursor-pointer justify-between ${
          navData.isActive ? "bg-gray-100" : ""
        }`
      }
    >
      <div className="flex items-center">
        <div className="relative">
          <img
            className="w-14 h-14 rounded-full cursor-pointer object-cover"
            src={chatData?.photoURL || "/user.jpg"}
          />
          {typeof chatData?.status !== "number" && (
            <div className="w-3.5 h-3.5 bg-white rounded-full absolute bottom-0.5 right-0.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>
            </div>
          )}
        </div>
        <div className="ml-2">
          <h2 className="text-xl">{`${chatData?.firstName} ${chatData?.lastName}`}</h2>
          {lastMsg && (
            <p className="text-gray-500">{`${
              lastMsg.from === user.uid ? "You: " : ""
            }${lastMsg.text.substr(0, 19)}${
              lastMsg.text.length > 19 ? "..." : ""
            }`}</p>
          )}
        </div>
      </div>
      {unreadMsgs ? (
        <div className="bg-violet-600 w-6 h-6 rounded-full flex items-center justify-center mr-1">
          <p className="text-white">{unreadMsgs}</p>
        </div>
      ) : (
        ""
      )}
    </NavLink>
  );
};

export default User;
