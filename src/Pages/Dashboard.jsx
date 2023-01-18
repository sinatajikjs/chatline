import { useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { AiFillPlusCircle } from "react-icons/ai";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import NewChat from "../components/NewChat";
import User from "../components/User";
import useLocalStorage from "../Hooks/useLocalStorage";

const Dashboard = () => {
  const [chats, setChats] = useLocalStorage("chats", []);
  const [modal, setModal] = useState(false);

  const { logout, user } = useAuth();

  function logoutHandler() {
    const userRef = doc(db, "users", user.uid);
    updateDoc(userRef, {
      status: Date.now(),
    });

    localStorage.removeItem("messanger-chats");
    logout();
  }

  async function getChats() {
    const chatsRef = collection(db, "chats", user?.uid, "chats");
    const q = query(chatsRef, orderBy("createdAt", "desc"));

    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) setChats([]);

      const chatsArr = [];
      querySnapshot.forEach((chat) => {
        chatsArr.push(chat.data());
      });
      setChats(chatsArr);
    });
  }

  useEffect(() => {
    getChats();
  }, []);

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <div>
      <div className="bg-teal-600 h-20 flex items-center px-5 justify-between">
        <h1 className="text-3xl text-white font-semibold mt-0 p-0">Chats</h1>

        <div className="flex items-center">
          <Link className="mr-1 text-white px-3 py-1 rounded" to={"/profile"}>
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={user.photoURL || "/user.jpg"}
            />
          </Link>
          <HiOutlineLogout
            onClick={logoutHandler}
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
  );
};

export default Dashboard;
