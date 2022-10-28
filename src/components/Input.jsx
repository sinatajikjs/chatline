import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { MdReply } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { ImAttachment, ImCross } from "react-icons/im";
import { db, storage } from "../firebase";

const Input = ({ recep, currentUser, reply, setReply }) => {
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  const fileRef = useRef();

  async function submitHandler(e) {
    e && e.preventDefault();
    inputRef.current.focus();

    if (!inputRef.current.value && !imgUrl) return;

    setImgUrl(null);
    setReply(null);

    let inputValue;

    inputValue = inputRef.current.value;
    inputRef.current.value = "";
    const id =
      currentUser.uid > recep.uid
        ? `${currentUser.uid + recep.uid}`
        : `${recep.uid + currentUser.uid}`;

    let url;
    const messageId = Date.now();

    const docRef = doc(db, "messages", id, "chat", `${messageId}`);
    await setDoc(docRef, {
      text: inputValue,
      from: currentUser.uid,
      senderName: currentUser.displayName,
      to: recep.uid,
      time: messageId,
      createdAt: Timestamp.fromDate(new Date()),
      media: {
        url: imgUrl || "",
        public: false,
      },
      replyTo: reply,
      seen: "sending",
    }).then(() => !imgUrl && updateDoc(docRef, { seen: "sent" }));

    await setDoc(doc(db, "lastMsg", id), {
      text: inputValue || "Photo",
      from: currentUser.uid,
      to: recep.uid,
      createdAt: Timestamp.fromDate(new Date()),
    });

    if (img) {
      setImg(null);
      fileRef.current.value = null;
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
      await updateDoc(docRef, {
        media: {
          url,
          public: true,
        },
        seen: "sent",
      });
    }
    setDoc(doc(db, "chats", currentUser.uid, "chats", recep.uid), {
      id: recep.uid,
      createdAt: Timestamp.fromDate(new Date()),
    }).then(() => {
      setDoc(doc(db, "chats", recep.uid, "chats", currentUser.uid), {
        id: currentUser.uid,
        createdAt: Timestamp.fromDate(new Date()),
      });
    });
  }

  const fileChangeHandler = (e) => {
    setImg(e.target.files[0]);
    setImgUrl(URL.createObjectURL(e.target.files[0]));
  };

  const textChangeHandler = () => {
    const currentUserRef = doc(db, "users", currentUser.uid);
    updateDoc(currentUserRef, {
      status: "typing",
      currentRecep: recep.uid,
    });
    setTimeout(() => {
      updateDoc(currentUserRef, {
        status: "online",
      });
    }, 1000);
  };

  function touchEndHandler(e) {
    e.preventDefault();
    submitHandler();
  }

  useEffect(() => {
    if (!reply) return;
    inputRef.current.focus();
  }, [reply]);

  const inputRef = useRef();

  return (
    <form
      onSubmit={submitHandler}
      className="fixed bottom-0 pb-3 z-20 flex items-center justify-center w-screen px-4 mt-5 bg-gray-300"
    >
      {imgUrl ? (
        <>
          <label
            htmlFor="file"
            className="cursor-pointer absolute left-0 ml-1 mb-32 p-1  rounded-xl bg-white border-2 border-gray-400"
          >
            <img
              src={imgUrl}
              className="h-14 w-14 object-cover rounded-lg"
              alt=""
            />
          </label>
          <div
            onClick={() => {
              fileRef.current.value = "";
              setImg(null);
              setImgUrl(null);
            }}
            className=" w-11 h-11 mr-2 bg-red-500 flex items-center justify-center cursor-pointer rounded-full"
          >
            <ImCross className="text-lg text-white" />
          </div>
        </>
      ) : (
        <label
          htmlFor="file"
          className="w-11 h-11 bg-white
           rounded-full mr-2 flex items-center justify-center cursor-pointer"
        >
          <ImAttachment className="text-2xl text-teal-600" />
        </label>
      )}

      <input
        onChange={fileChangeHandler}
        ref={fileRef}
        accept="image/*"
        type="file"
        id="file"
        className="hidden"
      />
      <div className="w-[calc(100%_-_94px)] relative">
        <input
          name="message"
          type="text"
          ref={inputRef}
          onChange={textChangeHandler}
          required={!imgUrl}
          autoComplete="off"
          placeholder="Message"
          className={`w-full relative z-10 rounded-xl ${
            reply && "rounded-t-none"
          } border-stone-400 text-lg h-11 px-2 py-1 outline-none transition-all duration-200`}
        />
        <div
          className={`flex justify-between items-center px-3 absolute rounded-xl border-b w-full ${
            reply ? "-top-12 h-12 rounded-b-none" : "-top-0 h-11"
          } bg-white transition-all`}
        >
          <div className="flex items-center">
            <MdReply className="-scale-x-100 text-teal-600 text-2xl" />
            <div className="ml-3">
              <h2 className="text-teal-600 font-medium">
                {reply && reply.senderName}
              </h2>
              <p className="text-sm">{(reply && reply.text) || "Photo"}</p>
            </div>
          </div>
          <IoMdClose
            onClick={() => setReply(null)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setReply(null);
            }}
            className="text-2xl text-teal-600 box-content cursor-pointer p-2 pr-0"
          />
        </div>
      </div>
      <button
        type="submit"
        onTouchEnd={touchEndHandler}
        className="ml-2 bg-teal-600 rounded-full p-2"
      >
        <AiOutlineSend className="text-white rounded-full text-3xl" />
      </button>
    </form>
  );
};

export default Input;
