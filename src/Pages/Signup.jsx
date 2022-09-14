import { useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [loading, setLoading] = useState(false);
  const { signup, checkUserEmail, currentUser } = useAuth();

  async function submitHandler(e) {
    e.preventDefault();

    const nameValue = nameRef.current.value;
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;
    const passwordConfirmValue = passwordConfirmRef.current.value;

    if (!emailValue.split("@")[1].includes(".")) {
      return toast.error("Invalid Email Address");
    }
    if (passwordValue !== passwordConfirmValue) {
      return toast.error("Passwords are not match");
    }
    if (passwordValue.length < 6) return toast.error("Password is Weak");

    const myToast = toast.loading("Signing Up...");

    setLoading(true);

    await checkUserEmail(emailValue).then((res) => {
      if (res.length > 0) {
        toast.error("User is Already Exist", {
          id: myToast,
        });
      } else {
        signup(nameValue, emailRef.current.value, passwordRef.current.value)
          .then((res) => {
            toast.success("SuccessFully Signed Up", {
              id: myToast,
            });
          })
          .catch(() =>
            toast.error("Failed to create an account", {
              id: myToast,
            })
          );
      }
    });
    setLoading(false);
  }

  return currentUser ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl py-6 px-8 rounded-md w-80 border border-gray-300"
      >
        <h2 className="text-3xl font-semibold mb-5">Sign Up</h2>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="name">Name</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full mt-1"
            type="name"
            required
            name="name"
            ref={nameRef}
          />
        </div>

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
          className="bg-blue-500 text-white px-2 py-1 rounded text-lg mt-4 w-full"
          disabled={loading}
        >
          Sign Up
        </button>
      </form>
      <Link to={"/"}>
        <p className="mt-5 text-blue-600 underline">
          Already have an account? Log In
        </p>
      </Link>
    </div>
  );
};

export default Signup;
