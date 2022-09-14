import { useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";

const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [loading, setLoading] = useState(false);
  const { currentUser, updateEmail, updatePassword } = useAuth();

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();

    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;
    const passwordConfirmValue = passwordConfirmRef.current.value;

    if (!emailValue.split("@")[1].includes(".")) {
      return toast.error("Invalid Email Address");
    }
    if (passwordValue !== passwordConfirmValue) {
      return toast.error("Passwords are not match");
    }
    if (passwordValue.length < 6 && passwordValue !== "")
      return toast.error("Password is Weak");

    const promises = [];

    const myToast = toast.loading("Updating...");

    setLoading(true);

    if (passwordValue) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    if (emailValue !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        toast.success("Updated Successfully", { id: myToast });
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error("Failed to update account", { id: myToast });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return !currentUser ? (
    <Navigate to="/" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl py-6 px-8 rounded-md w-80 border border-gray-300"
      >
        <h2 className="text-3xl font-semibold mb-5">Update Profile</h2>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="email">Email</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="email"
            required
            defaultValue={currentUser.email}
            name="text"
            ref={emailRef}
          />
        </div>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="password">Password</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="password"
            placeholder="Leave blank to keep the same"
            name="password"
            ref={passwordRef}
          />
        </div>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="password-confirm">Password-Confimation</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="password"
            placeholder="Leave blank to keep the same"
            name="password-confirm"
            ref={passwordConfirmRef}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded text-lg mt-4 w-full"
          disabled={loading}
        >
          Update
        </button>
      </form>
      <Link to={"/dashboard"}>
        <p className="mt-5 text-blue-600 underline">Cancel</p>
      </Link>
    </div>
  );
};

export default UpdateProfile;
