import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Wellcome = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  return currentUser ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white drop-shadow-xl py-4 px-8 rounded-md w-max border border-gray-300">
      <h2 className="text-2xl font-medium mb-7">Wellcome To Messanger</h2>
      <button
        className="border border-gray-400 rounded p-2 text-2xl mb-4"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
      <Link to={"/login"}>
        <button className="border border-gray-400 rounded p-2 text-2xl">
          Sign in with Email
        </button>
      </Link>
    </div>
  );
};

export default Wellcome;
