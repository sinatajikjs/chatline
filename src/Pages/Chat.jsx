import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import Infobar from "../components/Infobar";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { useState } from "react";
import useLocalStorage from "../Hooks/useLocalStorage";

const Chat = ({ recep }) => {
  const { currentUser, username } = useAuth();
  const id =
    currentUser.uid > recep.uid
      ? `${currentUser.uid + recep.uid}`
      : `${recep.uid + currentUser.uid}`;
  const [messages, setMessages] = useLocalStorage(id, []);
  const [reply, setReply] = useState(null);

  useEffect(() => {
    let isMounted = true;

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
      where("to", "==", currentUser.uid)
    );

    onSnapshot(receivedMessages, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (isMounted) {
          if (doc.data().seen) return;
          updateDoc(doc.ref, {
            seen: true,
          });
        }
      });
    });

    return () => {
      isMounted = false;
      localStorage.removeItem("messanger-recep");
    };
  }, []);

  const scrollToDivRef = useRef();

  return !currentUser || !recep || !username ? (
    <Navigate to="/" />
  ) : (
    <div className="bg-gray-300 absolute top-0 w-screen h-full overflow-hidden ">
      <Infobar recep={recep} />
      <Messages
        recep={recep}
        scrollToDivRef={scrollToDivRef}
        currentUser={currentUser}
        setReply={setReply}
        reply={reply}
        messages={messages}
      />
      <Input
        setMessages={setMessages}
        recep={recep}
        scrollToDivRef={scrollToDivRef}
        currentUser={currentUser}
        messages={messages}
        setReply={setReply}
        reply={reply}
      />
    </div>
  );
};

export default Chat;
