import { useEffect, useRef, useState } from "react";

const Dashboard = ({ username, setUsername, socket }) => {
  const [messages, setMessages] = useState([]);

  function logoutHandler() {
    setUsername(null);
    socket.emit("leave", username);
  }
  function submitHandler(e) {
    e.preventDefault();
    socket.emit(
      "sendMessage",
      messageRef.current.value,
      idRef.current.value,
      username,
      (dt) => console.log(dt)
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

  useEffect(() => {
    socket.on("message", ({ sender, text, socket }) => {
      // console.log(sender);
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          { text, id: Date.now(), type: "receive", sender },
        ];
      });
      console.log(socket);
    });
  }, []);

  const messageRef = useRef();
  const idRef = useRef();
  return (
    <>
      <div className="mx-3 my-2 absolute right-0">
        <ul className="chat-rtl">
          {messages.map((m) => {
            return (
              <div key={m.id}>
                <li
                  className={`text-lg text-white w-max ${
                    m.type === "send" ? "bg-blue-500" : "bg-slate-700"
                  } px-3 py-1 rounded mt-2`}
                >
                  {m.text}
                </li>
                <p>{m.sender}</p>
              </div>
            );
          })}
        </ul>
      </div>

      <form onSubmit={submitHandler} className="absolute bottom-0 mb-2">
        <div className="my-2">
          <label className="text-lg mx-2" htmlFor="message">
            message
          </label>
          <input
            name="message"
            type="text"
            ref={messageRef}
            required
            className="border border-stone-400 rounded text-lg px-1 py-1"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 rounded text-lg ml-2"
          >
            send
          </button>
        </div>
        <div className="my-2">
          <label className="text-lg mx-2" htmlFor="id">
            id
          </label>
          <input
            name="id"
            ref={idRef}
            type="text"
            required
            className="border border-stone-400 rounded text-lg px-1 py-1"
          />
        </div>
        <p className="ml-2">Id: {username}</p>
        <button
          className="bg-red-600 text-white px-2 py-1 rounded text-lg ml-2"
          type="button"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </form>
    </>
  );
};

export default Dashboard;
