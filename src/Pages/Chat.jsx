import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import Infobar from "../components/Infobar";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { useState } from "react";
import useLocalStorage from "../Hooks/useLocalStorage";
import ImgModal from "../components/ImgModal";

const Chat = () => {
  const { user, recep, setRecep } = useAuth();
  const [imgModal, setImgModal] = useState(false);

  const id =
    user?.uid > recep.uid
      ? `${user?.uid + recep.uid}`
      : `${recep.uid + user?.uid}`;

  const [messages, setMessages] = useLocalStorage(id, []);
  const [reply, setReply] = useState(null);

  const { chatId } = useParams();

  useEffect(() => {
    if (!user) return;

    if (!recep) {
      const usersRef = collection(db, "users");
      const searchingFor = chatId[0] === "+" ? "phoneNumber" : "username";
      const q = query(usersRef, where(searchingFor, "==", chatId));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setRecep(doc.data());
        });
      });
    }

    const messagesRef = collection(db, "messages", id, "chat");
    const messagesQ = query(messagesRef, orderBy("createdAt", "asc"));

    onSnapshot(messagesQ, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
    });

    const receivedMessages = query(
      messagesRef,
      where("seen", "==", "sent"),
      where("to", "==", user.uid)
    );

    const unsubscribe = onSnapshot(receivedMessages, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          seen: "seen",
        });
      });
    });

    return () => {
      unsubscribe();
      localStorage.removeItem("messanger-recep");
    };
  }, []);

  return !user ? (
    <Navigate to="/" />
  ) : (
    <div className="bg-gray-300 absolute top-0 w-screen h-full overflow-hidden ">
      <Infobar />
      {imgModal && <ImgModal setImgModal={setImgModal} src={imgModal} />}
      <Messages
        setReply={setReply}
        reply={reply}
        setImgModal={setImgModal}
        messages={messages}
      />
      <Input setReply={setReply} reply={reply} />
    </div>
  );
};

export default Chat;
