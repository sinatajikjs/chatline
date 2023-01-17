import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";

const User = ({ chat }) => {
  const [lastMsg, setLastMsg] = useState(null);
  const [chatData, setChatData] = useState({});
  const [unreadMsgs, setUnreadMsgs] = useState("");
  const { user, setRecep } = useAuth();

  const id =
    user.uid > chat.uid ? `${user.uid + chat.uid}` : `${chat.uid + user.uid}`;

  useEffect(() => {
    const usersRef = doc(db, "users", chat.uid);

    onSnapshot(usersRef, (doc) => {
      setChatData(doc.data());
    });

    onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setLastMsg(doc.data());
    });

    const messagesRef = collection(db, "messages", id, "chat");
    const receivedUnreadMsgs = query(
      messagesRef,
      where("to", "==", user.uid),
      where("seen", "==", "sent")
    );
    onSnapshot(receivedUnreadMsgs, (snap) => {
      if (snap.empty) return;
      setUnreadMsgs(snap.size);
    });
  }, []);

  return (
    <Link
      onClick={() => setRecep(chatData)}
      to={`/${chatData.username || chatData.phoneNumber}`}
      className="flex items-center 
      w-full py-3 border-b cursor-pointer justify-between"
    >
      <div className="flex items-center">
        <div className="relative">
          <img
            className="w-14 h-14 rounded-full cursor-pointer object-cover"
            src={chatData.photoURL || "/user.jpg"}
          />
          {chatData.status === "online" && (
            <div className="w-3.5 h-3.5 bg-white rounded-full absolute bottom-0.5 right-0.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>
            </div>
          )}
        </div>
        <div className="ml-2">
          <h2 className="text-xl">{`${chatData.firstName} ${chatData.lastName}`}</h2>
          {lastMsg && (
            <p className="text-gray-500">{`${
              lastMsg.from === user.uid ? "You: " : ""
            }${lastMsg.text.substr(0, 19)}${
              lastMsg.text.length > 19 ? "..." : ""
            }`}</p>
          )}
        </div>
      </div>
      {unreadMsgs && (
        <div className="bg-violet-600 w-6 h-6 rounded-full flex items-center justify-center mr-1">
          <p className="text-white">{unreadMsgs}</p>
        </div>
      )}
    </Link>
  );
};

export default User;
