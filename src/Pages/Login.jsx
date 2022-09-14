import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login, currentUser } = useAuth();

  async function submitHandler(e) {
    e.preventDefault();
    const myPromise = login(emailRef.current.value, passwordRef.current.value);

    toast.promise(myPromise, {
      loading: "Signing in...",
      success: "SuccessFully Signed In",
      error: "Email or Password is Incorrect",
    });
  }

  return currentUser ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center bg-white drop-shadow-xl py-4 px-8 rounded-md w-80 border border-gray-300"
      >
        <h2 className="text-3xl font-semibold mb-3">Login</h2>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="email">Email</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full"
            type="email"
            required
            name="text"
            ref={emailRef}
          />
        </div>

        <div className="flex flex-col my-1.5 w-full">
          <label htmlFor="password">Password</label>
          <input
            className="border border-stone-400 rounded text-medium px-2 py-1 w-full"
            type="password"
            required
            name="password"
            ref={passwordRef}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded text-lg mt-4 w-full"
        >
          Log In
        </button>
        <Link className="mt-4 text-blue-600 underline" to={"/restore"}>
          Forgot Password?
        </Link>
      </form>
      <Link className="mt-4" to={"/signup"}>
        <p className="text-blue-600 underline">Need an account? Sign Up</p>
      </Link>
    </div>
  );
};

export default Login;
