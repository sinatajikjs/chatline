import { useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import loginSvg from "../assets/login.svg";
import { TextField } from "@mui/material";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login, user, signInWithGoogle } = useAuth();

  async function submitHandler(e) {
    e.preventDefault();
    login(emailRef.current.value, passwordRef.current.value);
  }

  return user ? (
    <Navigate to="/" />
  ) : (
    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
      <img className="mt-8" src={loginSvg} alt="" />
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center w-80"
      >
        <h2 className="text-3xl font-semibold mb-3 self-start">Login</h2>

        <TextField variant="standard" label="Email" />
        <TextField variant="standard" label="Password" />

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
        <button
          type="button"
          className="border border-gray-400 rounded p-2 mt-2 text-2xl mb-4"
          onClick={signInWithGoogle}
        >
          Sign In With Google
        </button>
      </form>
      <Link className="mt-4" to={"/signup"}>
        <p className="text-blue-600 underline">Need an account? Sign Up</p>
      </Link>
    </div>
  );
};

export default Login;
