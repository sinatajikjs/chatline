import ScrollToBottom from "react-scroll-to-bottom";
import { useAuth } from "../Context/AuthContext";

const Messages = ({ messages }) => {
  const { currentUser } = useAuth();
  return (
    <ScrollToBottom className="messages px-3 mt-20 flex flex-col relative overflow-auto h-[calc(100%_-_148px)] hide-scroll-bar pb-1">
      {messages.map((m) => {
        return (
          <div
            key={m.id}
            className={`flex ${
              m.from === currentUser.uid
                ? "chat-rtl justify-end"
                : "chat-ltr justify-start"
            }`}
          >
            <li
              className={`flex flex-col rounded  mt-2 ${
                m.from === currentUser.uid ? "bg-blue-500" : "bg-slate-700"
              }`}
            >
              {m.media ? (
                <img src={m.media} className="w-52 px-1 pt-1 rounded" />
              ) : null}
              <h2 className={`text-md text-white w-max   px-3 py-1`}>
                {m.text}
              </h2>
            </li>
          </div>
        );
      })}
    </ScrollToBottom>
  );
};

export default Messages;
