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
      <div className="ml-3 flex flex-col">
        <h2 className="text-white text-2xl">{recep.name}</h2>
        <p className="text-teal-300">
          {recep.status === "online"
            ? "online"
            : recep.status === "typing"
            ? "typing..."
            : `Last seen at ${new Date(recep.status)
                .toTimeString()
                .substring(0, 5)}`}
        </p>
      </div>
    </section>
  );
};

export default Infobar;
