import { useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";

const Input = ({ setMessages, recep, currentUser, socket, messages }) => {
  function submitHandler(e) {
    // messageRef.current.focus();

    e.preventDefault();
    socket.emit(
      "sendMessage",
      messageRef.current.value,
      recep.uid,
      currentUser.displayName
    );
    setMessages([
      ...messages,
      {
        text: messageRef.current.value,
        id: Date.now(),
        type: "send",
        sender: "you",
      },
    ]);
    messageRef.current.value = "";
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
