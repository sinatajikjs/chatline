import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";

import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { io } from "socket.io-client";
import useLocalStorage from "../Hooks/useLocalStorage";

import Infobar from "../components/Infobar";
import Messages from "../components/Messages";
import Input from "../components/Input";

const Chat = ({ selectedChat }) => {
  const { currentUser, logout } = useAuth();

  const [messages, setMessages] = useLocalStorage(
    `${selectedChat}-messages`,
    []
  );
  const [recep, setRecep] = useLocalStorage("Recep", "");

  const socket = io("https://sina-react-api.herokuapp.com", {
    query: { username: currentUser.uid },
  });

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", selectedChat));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setRecep(doc.data());
      });
    });

    socket.on("message", ({ sender, text }) => {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          { text, id: Date.now(), type: "receive", sender },
        ];
      });
    });
  }, []);

  return !currentUser ? (
    <Navigate to={"/"} />
  ) : (
    <div className="bg-gray-300 absolute top-0 w-screen h-full overflow-hidden ">
      <Infobar recep={recep} />
      <Messages messages={messages} />
      <Input
        setMessages={setMessages}
        recep={recep}
        socket={socket}
        currentUser={currentUser}
        messages={messages}
      />
    </div>
  );
};

export default Chat;
