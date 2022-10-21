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
  where,
  orderBy,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import NewChat from "../components/NewChat";
import User from "../components/User";
import useLocalStorage from "../Hooks/useLocalStorage";

const Dashboard = ({ setRecep }) => {
  const [chats, setChats] = useLocalStorage("chats", []);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const { logout, currentUser, username } = useAuth();

  function selectHandler(e) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", e.currentTarget.dataset.id));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setRecep(doc.data());
        navigate("/chat");
      });
    });
  }

  function logoutHandler() {
    const currentUserRef = doc(db, "users", currentUser.uid);
    updateDoc(currentUserRef, {
      status: Date.now(),
    });

    localStorage.removeItem("messanger-chats");
    logout();
  }

  function getChats() {
    const chatsRef = collection(db, "chats", currentUser.uid, "chats");
    const q = query(chatsRef, orderBy("createdAt", "asc"));

    let users = [];
    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) setChats([]);
      querySnapshot.forEach((snap) => {
        const usersRef = doc(db, "users", snap.data().id);
        getDoc(usersRef).then((res) => {
          users.push(res.data());
          setChats(users);
        });
      });
    });
  }

  useEffect(() => {
    getChats();
  }, []);

  return !currentUser ? (
    <Navigate to="/" />
  ) : !username ? (
    <Navigate to="/username" />
  ) : (
    <div>
      <div className="bg-teal-600 h-20 flex items-center px-5 justify-between">
        <h1 className="text-3xl text-white font-semibold mt-0 p-0">Chats</h1>

        <div className="flex items-center">
          <Link
            className="mr-1 text-white px-3 py-1 rounded"
            to={"/update-profile"}
          >
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={currentUser.photoURL}
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
          {chats.map((c) => {
            return <User c={c} key={c.uid} selectHandler={selectHandler} />;
          })}
        </div>
      )}

      <button onClick={() => setModal(true)}>
        <AiFillPlusCircle className="text-4xl absolute right-0 bottom-0 bg-white text-teal-600 w-16 h-16 mb-4 mr-4 rounded-full cursor-pointer" />
      </button>
      {modal && (
        <NewChat chats={chats} setChats={setChats} setModal={setModal} />
      )}
    </div>
  );
};

export default Dashboard;
