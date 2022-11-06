import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { HiOutlineClock } from "react-icons/hi";
import { MdReply } from "react-icons/md";
import { useAuth } from "../Context/AuthContext";

const Message = (props) => {
  const {
    message,
    touchEndHandler,
    touchMoveHandler,
    touchStartHandler,
    msgRef,
    scrollHandler,
    setImgModal,
  } = props;

  const { user } = useAuth();

  function condition() {
    if (
      message.from === user.uid ||
      !message.media.url ||
      message.media.public
    )
      return true;
    return false;
  }

  return (
    condition() && (
      <div
        data-id={message.time}
        ref={(el) => (msgRef[message.time] = el)}
        onTouchMove={touchMoveHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
        className={`relative overflow-visible mt-2 flex transition-all duration-500 ${
          message.from === user.uid
            ? "chat-rtl justify-end"
            : "chat-ltr justify-start"
        }`}
      >
        <li
          className={`max-w-[80%] relative flex flex-col rounded-lg ${
            message.from === user.uid ? "bg-violet-600" : "bg-slate-700"
          }`}
        >
          {message.replyTo && (
            <div
              onClick={scrollHandler}
              className="px-3 mt-1 flex items-center"
              data-id={message.replyTo.time}
            >
              <span className="w-0.5 h-9 bg-violet-300"></span>
              <div className="ml-1.5">
                <h2 className="text-violet-300 font-medium">
                  {message.replyTo.senderName}
                </h2>
                <p className="text-white text-sm">
                  {message.replyTo.text || "Photo"}
                </p>
              </div>
            </div>
          )}
          {message.media.url && (
            <img
              onClick={() => setImgModal(message.media.url)}
              src={message.media.url}
              className={`w-52 px-1 py-1 rounded-lg`}
            />
          )}

          <div className="flex pb-1.5 justify-between">
            <h2
              className={`px-3 text-md text-white  ${
                message.media.url || "pt-1"
              }`}
            >
              {message.text}
            </h2>
            <div className="pr-2 flex justify-end items-end text-blue-300">
              <p
                className={`text-xs font-semibold mr-1 ${
                  message.from === user.uid
                    ? "text-blue-300"
                    : "text-slate-400"
                }`}
              >
                {new Date(message.time).toTimeString().substring(0, 5)}
              </p>
              {message.from === user.uid &&
                (message.seen === "sending" ? (
                  <HiOutlineClock />
                ) : message.seen === "sent" ? (
                  <IoCheckmarkSharp />
                ) : (
                  <IoCheckmarkDoneSharp />
                ))}
            </div>
          </div>
        </li>
        <MdReply
          className={`-scale-x-100 text-2xl text-white bg-gray-400 p-1 rounded-full box-content absolute top-1/2 -translate-y-1/2 -right-14 mt-1`}
        />
      </div>
    )
  );
};

export default Message;
