import { useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { AiFillPlusCircle } from "react-icons/ai";
import { Navigate, Link, Outlet, useNavigate } from "react-router-dom";
import Img from "../assets/user.jpg";
import { useAuth } from "../Context/AuthContext";
import useLocalStorage from "../Hooks/useLocalStorage";
import NewChat from "../components/NewChat";

const Dashboard = ({ setSelectedChat, selectedChat }) => {
  const [chats, setChats] = useLocalStorage("chats", []);
  const [modal, setModal] = useState(false);

  const { logout, currentUser } = useAuth();

  const navigate = useNavigate();
  function selectHandler(e) {
    setSelectedChat(e.target.dataset.id);
    console.log(selectedChat);
    navigate("/chat");
  }

  return !currentUser ? (
    <Navigate to={"/"} />
  ) : (
    <div>
      <div className="bg-teal-600 h-20 flex items-center px-5 justify-between">
        <h1 className="text-3xl text-white font-semibold mt-0 p-0">Chats</h1>

        <div className="flex items-center">
          <Link className="mr-1 text-white px-3 py-1 rounded" to={"/profile"}>
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={currentUser.photoURL}
            />
          </Link>
          <HiOutlineLogout
            onClick={() => logout()}
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
            return (
              <div
                onClick={selectHandler}
                data-id={c.uid}
                className="flex items-center py-3 border-b cursor-pointer"
                key={c.uid}
              >
                <img
                  className="w-14 h-14 rounded-full border-2 border-gray-400 cursor-pointer object-cover"
                  src={c.photoURL}
                  data-id={c.uid}
                />
                <span className=" ">
                  <h2 className="text-xl ml-2" data-id={c.uid}>
                    {c.name}
                  </h2>
                  <p data-id={c.uid}>{c.lastMsg}</p>
                </span>
              </div>
            );
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
