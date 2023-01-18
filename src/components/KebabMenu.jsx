import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { GoKebabVertical } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../firebase";

const KebabMenu = () => {
  const { user, recep } = useAuth();

  const [menu, setMenu] = useState(false);

  const navigate = useNavigate();

  function deleteHandler() {
    const chatsRef = doc(db, "chats", user.uid, "chats", recep.uid);
    deleteDoc(chatsRef).then(() => navigate("/"));
  }

  return (
    <div
      onClick={() => setMenu(true)}
      onBlur={() => setMenu(false)}
      tabIndex="0"
      className="relative"
    >
      <GoKebabVertical className="text-2xl text-white mr-1 cursor-pointer" />
      <ul
        className={`absolute w-max -left-24 -top-2 bg-white rounded ${
          menu ? "scale-100" : "scale-0"
        } transition-all`}
      >
        <li
          onClick={deleteHandler}
          className="text-lg cursor-pointer py-2 px-4"
        >
          Delete Chat
        </li>
      </ul>
    </div>
  );
};

export default KebabMenu;
