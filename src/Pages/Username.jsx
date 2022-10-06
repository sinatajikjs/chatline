import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Username = () => {
  const [inputValue, setInputValue] = useState("");

  const { currentUser, checkUsername, updateUsername, getUser, user } =
    useAuth();

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    if (inputValue.length < 5)
      return toast.error("Username must be more than 4 letters");

    const myToast = toast.loading("Checking...");
    checkUsername(inputValue).then((userExist) =>
      userExist
        ? toast.error("Username is Taken", { id: myToast })
        : updateUsername(currentUser.uid, inputValue).then(() => {
            toast.dismiss(myToast);
            console.log(user.username);
            if (user.username) return navigate("/dashboard");
            navigate("/profile");
          })
    );
  }
  const changeHandler = (e) => {
    let myToast;
    toast.dismiss(myToast);
    if (!Boolean(e.target.value.match(/^[A-Za-z0-9._ ]*$/))) {
      return (myToast = toast.error(
        "Only letters, numbers, periods and underscores is accepted"
      ));
    }
    setInputValue(e.target.value.toLowerCase().replaceAll(" ", "_"));
  };

  useEffect(() => {
    setInputValue(user && user.username);
  }, [user]);

  return !currentUser ? (
    <Navigate to="/" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl py-4 px-8 rounded-md w-max border border-gray-300"
      >
        <h2 className="text-2xl font-semibold mb-3">
          {user && user.username ? "Change Username" : "Choose a Username"}
        </h2>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="username">Username</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full"
            type="text"
            required
            value={inputValue}
            onChange={changeHandler}
            name="text"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded text-lg mt-4 w-full"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Username;
