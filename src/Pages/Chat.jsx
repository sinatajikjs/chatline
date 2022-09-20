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
} from "firebase/firestore";
import useLocalStorage from "../Hooks/useLocalStorage";

import Infobar from "../components/Infobar";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { useState } from "react";

const Chat = ({ selectedChat }) => {
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [recep, setRecep] = useLocalStorage("recep", "");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", selectedChat));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setRecep(doc.data());
      });
    });

    return () => {
      localStorage.removeItem("messanger-recep");
    };
  }, []);
  useEffect(() => {
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
  }, [recep]);

  return !currentUser ? (
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
