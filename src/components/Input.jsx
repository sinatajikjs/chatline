import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { db } from "../firebase";

const Input = ({ setMessages, recep, currentUser, messages }) => {

  async function submitHandler(e) {
    e.preventDefault();
    let inputValue;
    inputValue = messageRef.current.value;
    messageRef.current.value = "";

    const id =
      currentUser.uid > recep.uid
        ? `${currentUser.uid + recep.uid}`
        : `${recep.uid + currentUser.uid}`;

    let url;

    await addDoc(collection(db, "messages", id, "chat"), {
      text: inputValue,
      from: currentUser.uid,
      to: recep.uid,
      id: Date.now(),
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });
  }

  const messageRef = useRef();

  return (
    <form
      onSubmit={submitHandler}
      className="fixed bottom-0 pb-3 flex items-center justify-center w-screen px-4 mt-5 bg-gray-300"
    >
      <input
        name="message"
        type="text"
        ref={messageRef}
        required
        autoComplete="off"
        placeholder="Message"
        className="w-[calc(100%_-_45px)] border-stone-400 rounded-full text-lg h-10 px-2 py-1 outline-none"
      />
      <button
        type="submit"
        onClick={() => messageRef.current.focus()}
        className="ml-2 bg-teal-600 rounded-full p-2"
      >
        <AiOutlineSend className="text-white  rounded-full text-lg text-3xl" />
      </button>
    </form>
  );
};

export default Input;
