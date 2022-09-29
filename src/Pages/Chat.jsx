import { useEffect } from "react";
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
} from "firebase/firestore";

import Infobar from "../components/Infobar";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { useState } from "react";

const Chat = ({ recep }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const id =
      currentUser.uid > recep.uid
        ? `${currentUser.uid + recep.uid}`
        : `${recep.uid + currentUser.uid}`;

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

  return !currentUser || !recep ? (
    <Navigate to={"/"} />
  ) : (
    <div className="bg-gray-300 absolute top-0 w-screen h-full overflow-hidden ">
      <Infobar recep={recep} />
      <Messages messages={messages} />
      <Input
        setMessages={setMessages}
        recep={recep}
        currentUser={currentUser}
        messages={messages}
      />
    </div>
  );
};

export default Chat;
