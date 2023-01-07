import { IoIosArrowDown } from "react-icons/io";

import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Message from "./Message";

const Messages = ({ messages, reply, setReply, setImgModal }) => {
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

  function touchEndHandler(e) {
    e.currentTarget.style.transition = `0.2s`;
    e.currentTarget.style.left = `0`;
    const elementLeft = window.getComputedStyle(e.currentTarget).left;

    if (elementLeft.replace("px", "") < -45) {
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

  function scrollToBottom(behavior) {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior,
    });
  }
  function handleScroll(e) {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 200;
    if (bottom) {
      setBottom(true);
    } else setBottom(false);
  }

  const [firstLoad, setFirstLoad] = useState(0);
  useEffect(() => {
    setFirstLoad(firstLoad + 1);
    scrollToBottom(firstLoad > 1 ? "smooth" : "auto");
  }, [messages]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom("smooth");
    });
    resizeObserver.observe(messagesRef.current);
  }, []);

  useEffect(() => {
    if (vibrate === true) {
      navigator.vibrate(10);
    }
  }, [vibrate]);

  return (
    <div
      ref={messagesRef}
      onScroll={handleScroll}
      className={`scrollbar-hiden overflow-x-hidden px-3 mt-20 flex flex-col relative overflow-auto ${
        reply ? "h-[calc(100%_-_192px)]" : "h-[calc(100%_-_148px)]"
      } hide-scroll-bar transition-all`}
    >
      {messages.map((message) => {
        return (
          <Message
            key={message.time}
            setImgModal={setImgModal}
            message={message}
            touchEndHandler={touchEndHandler}
            touchMoveHandler={touchMoveHandler}
            touchStartHandler={touchStartHandler}
            msgRef={msgRef}
            scrollHandler={scrollHandler}
          />
        );
      })}
      <IoIosArrowDown
        className={`fixed -bottom-0 right-0 box-content text-white text-2xl z-10 mr-4 mb-[4.5rem] bg-slate-700 p-1.5 rounded-full cursor-pointer ${
          bottom && "-bottom-14"
        } transition-all duration-200`}
        onClick={() => scrollToBottom("smooth")}
      />
    </div>
  );
};

export default Messages;
