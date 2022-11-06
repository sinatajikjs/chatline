import { useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = ({ setEmailPass }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [loading, setLoading] = useState(false);

  const { currentUser, signInWithGoogle, checkUserEmail } = useAuth();

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    if (!emailRef.current.value.split("@")[1].includes(".")) {
      return toast.error("Invalid Email Address");
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return toast.error("Passwords are not match");
    }
    if (passwordRef.current.value.length < 6)
      return toast.error("Password is Weak");

    setLoading(true);
    const myToast = toast.loading("Checking Email...");
    const userExist = await checkUserEmail(emailRef.current.value);
    setLoading(false);
    if (userExist.length > 0) {
      return toast.error("User is Already Exist", {
        id: myToast,
      });
    }
    toast.dismiss(myToast);

    setEmailPass({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    navigate("/profile");
  }

  return currentUser ? (
    <Navigate to="/profile" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl pt-6 px-8 rounded-md w-80 border border-gray-300"
      >
        <h2 className="text-3xl font-semibold mb-5">Sign Up</h2>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="email">Email</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="email"
            required
            name="text"
            ref={emailRef}
          />
        </div>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="password">Password</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="password"
            required
            name="password"
            ref={passwordRef}
          />
        </div>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="password-confirm">Password-Confimation</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="password"
            required
            name="password-confirm"
            ref={passwordConfirmRef}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 ${
            loading ? "opacity-50" : "opacity-100"
          } text-white px-2 py-1 rounded text-lg mt-4 w-full`}
          disabled={loading}
        >
          Next
        </button>
        <button
          type="button"
          disabled={loading}
          className={`border border-gray-400 ${
            loading ? "opacity-50" : "opacity-100"
          } rounded p-2 mt-4 text-2xl mb-4`}
          onClick={signInWithGoogle}
        >
          Sign Up With Google
        </button>
      </form>
      <Link to={"/login"}>
        <p className="mt-5 text-blue-600 underline">
          Already have an account? Log In
        </p>
      </Link>
    </div>
  );
};

export default Signup;
