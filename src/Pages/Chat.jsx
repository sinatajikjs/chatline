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
import useStorage from "../Hooks/useStorage";
import ImgModal from "../components/ImgModal";

const Chat = () => {
  const { user, recep, setRecep, isOnline } = useAuth();
  const [imgModal, setImgModal] = useState(false);

  const messagesId =
    user?.uid > recep.uid
      ? `${user?.uid + recep.uid}`
      : `${recep.uid + user?.uid}`;

  const [messages, setMessages] = useLocalStorage(messagesId, []);
  const [reply, setReply] = useState(null);

  const { getStorage, deleteStorage } = useStorage();

  const { chatId } = useParams();

  function getMessages() {
    const messagesRef = collection(db, "messages", messagesId, "chat");
    const messagesQ = query(messagesRef, orderBy("createdAt", "asc"));

    const onsub = onSnapshot(messagesQ, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
    });
    return onsub;
  }

  useEffect(() => {
    if (!user) return;

    setMessages(getStorage(messagesId) !== null ? getStorage(messagesId) : []);

    let onsub1 = () => {};
    let onsub2 = () => {};

    if (!recep) {
      const usersRef = collection(db, "users");
      const searchingFor = chatId[0] === "+" ? "phoneNumber" : "username";
      const q = query(usersRef, where(searchingFor, "==", chatId));

      onsub1 = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setRecep(doc.data());
          onsub2 = getMessages();
        });
      });
    } else {
      onsub2 = getMessages();
    }

    return () => {
      onsub1();
      onsub2();
      deleteStorage("recep");
    };
  }, [chatId, messagesId]);

  useEffect(() => {
    const messagesRef = collection(db, "messages", messagesId, "chat");

    const receivedMessages = query(
      messagesRef,
      where("seen", "==", "sent"),
      where("to", "==", user.uid)
    );
    const onsub3 = onSnapshot(receivedMessages, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (isOnline) {
          updateDoc(doc.ref, {
            seen: "seen",
          });
        }
      });
    });

    return () => onsub3();
  }, [chatId, isOnline, messagesId]);

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <div
      className={`tablet:w-[calc(100%-24rem)] tablet:left-96 left-0 bg-gray-300 absolute z-40 top-0 w-screen h-full overflow-hidden`}
    >
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
