import { useAuth } from "../Context/AuthContext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdReply } from "react-icons/md";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

const Messages = ({ messages, inputRef, reply, setReply }) => {
  const { currentUser } = useAuth();
  const [touched, setTouched] = useState(0);
  const [vibrate, setVibrate] = useState(false);
  const [isHorzMoved, setIsHorzMoved] = useState(false);
  const [bottom, setBottom] = useState(true);

  const msgRef = useRef();
  const messagesRef = useRef();

  function touchMoveHandler(e) {
    const horzMoved = Math.round(e.touches[0].clientX) - touched.x;
    const vertMoved = Math.round(e.touches[0].clientY) - touched.y;

    if (!isHorzMoved) {
      if (vertMoved > 5 || vertMoved < -5) return;
    }
    setIsHorzMoved(true);

    const elementLeft = window
      .getComputedStyle(e.currentTarget)
      .left.replace("px", "");

    if (horzMoved < -2) {
      e.currentTarget.style.left = `${horzMoved > -60 ? horzMoved : "-59"}px`;
      if (elementLeft < -45) {
        setVibrate(true);
      }
    }
  }

  function touchStartHandler(e) {
    e.currentTarget.style.transition = `none`;
    setTouched({
      x: Math.round(e.touches[0].clientX),
      y: Math.round(e.touches[0].clientY),
    });
  }

  async function touchEndHandler(e) {
    e.currentTarget.style.transition = `0.2s`;
    e.currentTarget.style.left = `0`;
    const elementLeft = window.getComputedStyle(e.currentTarget).left;

    if (elementLeft.replace("px", "") < -45) {
      inputRef.current.focus();
      const msg = messages.find(
        (msg) => msg.time == e.currentTarget.dataset.id
      );
      setReply(msg);
    }
    setVibrate(false);
    setIsHorzMoved(false);
  }

  function scrollHandler(e) {
    const msgId = e.currentTarget.dataset.id;
    msgRef[msgId].scrollIntoView({ behavior: "smooth", block: "center" });
    msgRef[msgId].style.backgroundColor = "#2188ff36";
    setTimeout(() => {
      msgRef[msgId].style.backgroundColor = "transparent";
    }, 1500);
  }

  function scrollToBottom() {
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
  function handleScroll(e) {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 200;
    if (bottom) {
      setBottom(true);
    } else setBottom(false);
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });
    resizeObserver.observe(messagesRef.current);
  }, [messages, messagesRef.current && messagesRef.current.scrollHeight]);

  useEffect(() => {
    if (vibrate === true) {
      navigator.vibrate(10);
    }
  }, [vibrate]);

  return (
    <div
      ref={messagesRef}
      onScroll={handleScroll}
      className={`messages overflow-auto px-3 mt-20 flex flex-col relative overflow-auto ${
        reply ? "h-[calc(100%_-_192px)]" : "h-[calc(100%_-_148px)]"
      } hide-scroll-bar transition-all`}
    >
      {messages.map((m) => {
        return (
          <div
            data-id={m.time}
            ref={(el) => (msgRef[m.time] = el)}
            onTouchMove={touchMoveHandler}
            onTouchStart={touchStartHandler}
            onTouchEnd={touchEndHandler}
            key={m.time}
            className={`relative overflow-visible mt-2 flex transition-all duration-500 ${
              m.from === currentUser.uid
                ? "chat-rtl justify-end"
                : "chat-ltr justify-start"
            }`}
          >
            <li
              className={`max-w-[80%] relative flex flex-col rounded-lg ${
                m.from === currentUser.uid ? "bg-violet-600" : "bg-slate-700"
              }`}
            >
              {m.replyTo && (
                <div
                  onClick={scrollHandler}
                  className="px-3 mt-1 flex items-center"
                  data-id={m.replyTo.time}
                >
                  <span className="w-0.5 h-9 bg-violet-300"></span>
                  <div className="ml-1.5">
                    <h2 className="text-violet-300 font-medium">
                      {m.replyTo.senderName}
                    </h2>
                    <p className="text-white text-sm">
                      {m.replyTo.text || "Photo"}
                    </p>
                  </div>
                </div>
              )}
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

              <div className="flex pb-1.5 justify-between">
                <h2
                  className={`px-3 text-md text-white  ${
                    m.media.url || "pt-1"
                  }`}
                >
                  {m.text}
                </h2>
                <div className="pr-2 flex justify-end items-end text-blue-300">
                  <p
                    className={`text-xs font-semibold mr-1 ${
                      m.from === currentUser.uid
                        ? "text-blue-300"
                        : "text-slate-400"
                    }`}
                  >
                    {new Date(m.time).toTimeString().substring(0, 5)}
                  </p>
                  {m.from === currentUser.uid &&
                    (m.seen ? <IoCheckmarkDoneSharp /> : <IoCheckmarkSharp />)}
                </div>
              </div>
            </li>
            <MdReply
              className={`-scale-x-100 text-2xl text-white bg-gray-400 p-1 rounded-full box-content absolute top-1/2 -translate-y-1/2 -right-14 mt-1`}
            />
          </div>
        );
      })}
      <IoIosArrowDown
        className={`fixed bottom-0 right-0 box-content text-white text-2xl z-20 mr-4 mb-[4.5rem] bg-slate-700 p-1.5 rounded-full cursor-pointer ${
          bottom ? "opacity-0" : "opacity-100"
        } transition-all`}
        onClick={scrollToBottom}
      />
    </div>
  );
};

export default Messages;
