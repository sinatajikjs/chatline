import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Wellcome = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  return currentUser ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="flex flex-col items-center">
      <button
        className="border border-gray-400 rounded p-2 text-2xl my-2"
        onClick={signInWithGoogle}
      >
        sign in with google
      </button>
      <Link to={"/login"}>
        <button className="border border-gray-400 rounded p-2 text-2xl">
          sign in with email
        </button>
      </Link>
    </div>
  );
};

export default Wellcome;
