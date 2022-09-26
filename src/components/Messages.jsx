import ScrollToBottom from "react-scroll-to-bottom";
import { useAuth } from "../Context/AuthContext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
              className={`max-w-[80%] flex flex-col rounded-lg  mt-2 ${
                m.from === currentUser.uid ? "bg-violet-600" : "bg-slate-700"
              }`}
            >
              {m.media.url &&
                (m.from === currentUser.uid ? (
                  <img
                    src={m.media.url}
                    className="w-52 px-1 py-1 rounded-lg"
                  />
                ) : m.media.type === "local" ? (
                  <SkeletonTheme baseColor="#cecece" highlightColor="#c2bfbf">
                    <Skeleton
                      containerClassName="pb-1 px-1"
                      height={208}
                      width={208}
                    />
                  </SkeletonTheme>
                ) : (
                  <img
                    src={m.media.url}
                    className="w-52 px-1 py-1 rounded-lg"
                  />
                ))}

              {m.text && (
                <h2
                  className={`text-md text-white px-3 pb-1 ${
                    m.media.url || "pt-1"
                  }`}
                >
                  {m.text}
                </h2>
              )}
            </li>
          </div>
        );
      })}
    </ScrollToBottom>
  );
};

export default Messages;
