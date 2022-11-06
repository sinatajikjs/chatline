import { useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const Restore = () => {
  const emailRef = useRef();
  const { resetPassword, checkUserEmail } = useAuth();

  function submitHandler(e) {
    const emailValue = emailRef.current.value;

    e.preventDefault();
    if (!emailValue.split("@")[1].includes(".")) {
      return toast.error("Invalid Email Address");
    }
    const myToast = toast.loading("Sending...");

    checkUserEmail(emailValue).then((res) => {
      if (res.length === 0) {
        toast.error("User does not exist", {
          id: myToast,
        });
      } else {
        resetPassword(emailValue)
          .then(() => {
            toast.success("Reset Link Sent to Your Email", {
              id: myToast,
            });
          })
          .catch(() =>
            toast.error("Failed To Reset Password", {
              id: myToast,
            })
          );
      }
    });
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl py-5 px-8 rounded-md w-80 border border-gray-300"
      >
        <h2 className="text-3xl font-semibold mb-5">Restore Account</h2>

        <div className="flex flex-col my-1.5 w-full">
          <label className="text-lg" htmlFor="email">
            Email
          </label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="email"
            required
            name="text"
            ref={emailRef}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded text-lg mt-4 w-full"
        >
          Reset Password
        </button>
        <Link className="mt-4 text-blue-600 underline" to={"/login"}>
          Login
        </Link>
      </form>
    </div>
  );
};

export default Restore;
