import { useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { AiFillPlusCircle } from "react-icons/ai";
import { Navigate, useParams, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import NewChat from "../components/NewChat";
import User from "../components/User";
import useLocalStorage from "../Hooks/useLocalStorage";
import Profile from "./Profile";

const Dashboard = () => {
  const [chats, setChats] = useLocalStorage("chats", []);
  const [modal, setModal] = useState(false);

  const { logout, user, isProfileOpen, setIsProfileOpen } = useAuth();

  const { chatId } = useParams();

  useEffect(() => {
    if (!user) return;
    const chatsRef = collection(db, "chats", user.uid, "chats");
    const q = query(chatsRef, orderBy("createdAt", "desc"));

    const onsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) return setChats([]);
      const chatsArr = [];
      querySnapshot.forEach((chat) => {
        chatsArr.push(chat.data());
      });
      setChats(chatsArr);
    });
    return () => onsub();
  }, []);

  return !user ? (
    <Navigate to={`/login${chatId ? "?redirect=" + chatId : ""}`} />
  ) : (
    <div className="flex">
      {isProfileOpen ? (
        <Profile />
      ) : (
        <div className={`tablet:w-96 w-full relative h-screen`}>
          <div className="bg-teal-600 py-2 flex items-center px-5 justify-between">
            <h1 className="text-3xl text-white font-semibold mt-0 p-0">
              Chats
            </h1>

            <div className="flex items-center">
              <div
                className="mr-1 text-white px-3 py-1 rounded cursor-pointer"
                onClick={() => setIsProfileOpen(true)}
              >
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={user.photoURL || "/user.jpg"}
                />
              </div>
              <HiOutlineLogout
                onClick={logout}
                className="text-red-500 text-3xl cursor-pointer"
              />
            </div>
          </div>
          {chats.length === 0 ? (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-gray-400 ">
              There is not any chats yet!
            </p>
          ) : (
            <div className="mt-5 mx-3 border-t">
              {chats.map((chat) => {
                return <User chat={chat} key={chat.uid} />;
              })}
            </div>
          )}

          <button onClick={() => setModal(true)}>
            <AiFillPlusCircle className="text-4xl absolute right-0 bottom-0 bg-white text-teal-600 w-16 h-16 mb-4 mr-4 rounded-full cursor-pointer" />
          </button>
          {modal && <NewChat chats={chats} setModal={setModal} />}
        </div>
      )}
      <Outlet />
      <div className="hidden tablet:block bg-gray-300 tablet:w-[calc(100%-24rem)] h-screen" />
    </div>
  );
};

export default Dashboard;
