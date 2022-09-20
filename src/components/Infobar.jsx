import { useEffect } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router-dom";

const Infobar = ({ recep }) => {
  return (
    <section className="flex items-center bg-teal-600 py-2 fixed w-screen top-0 z-10">
      <Link to="/dashboard">
        <BsArrowLeftShort className="text-4xl cursor-pointer text-white mx-1" />
      </Link>
      <img
        className="w-14 h-14 rounded-full object-cover "
        src={recep.photoURL}
      />
      <h2 className="ml-3 text-white text-2xl pb-1 ">{recep.name}</h2>
    </section>
  );
};

export default Infobar;
