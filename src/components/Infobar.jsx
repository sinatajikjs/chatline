import { BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import KebabMenu from "./KebabMenu";

const Infobar = ({ recep }) => {
  const { user } = useAuth();

  const getUserStatus = () => {
    if (!recep) return;
    if (recep.status === "online") return "online";
    if (recep.status === "typing") {
      return recep.currentRecep === user.uid ? "typing..." : "online";
    }

    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const statDate = new Date(recep.status);

    const DayCondition = new Date().getDate() - statDate.getDate();
    const YearCondition = new Date().getFullYear() - statDate.getFullYear();

    if (YearCondition > 0)
      return `Last seen ${statDate.toString().substring(4, 15)}`;

    switch (DayCondition) {
      case 0:
        return `Last seen at ${statDate.toTimeString().substring(0, 5)}`;
      case 1:
        return `Last seen Yesterday ${statDate.toTimeString().substring(0, 5)}`;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return `Last seen ${weekday[statDate.getDay()]} ${statDate
          .toTimeString()
          .substring(0, 5)}`;
      default:
        return `Last seen ${statDate.toString().substring(4, 10)}, ${statDate
          .toTimeString()
          .substring(0, 5)}`;
    }
  };

  return (
    <section className="flex items-center justify-between bg-teal-600 py-2 fixed w-screen top-0 z-10 px-2">
      <div className="flex items-center">
        <Link to="/">
          <BsArrowLeftShort className="text-4xl cursor-pointer text-white mr-1" />
        </Link>
        <img
          className="w-14 h-14 rounded-full object-cover "
          src={recep.photoURL}
        />
        <div className="ml-3 flex flex-col">
          <h2 className="text-white text-2xl">{recep.name}</h2>
          <p className="text-teal-300">{getUserStatus()}</p>
        </div>
      </div>
      <KebabMenu recep={recep} />
    </section>
  );
};

export default Infobar;
