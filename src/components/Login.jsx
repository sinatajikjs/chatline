import { useEffect, useRef, useState } from "react";

const Login = ({ username, setUsername, socket }) => {
  const [error, setError] = useState(false);
  function submitHandler(e) {
    e.preventDefault();
    const inputValue = inputRef.current.value;

    socket.emit("join", inputValue, () => {
      setUsername(inputValue);
    });
    setTimeout(() => {
      setError(true);
    }, 200);
  }
  const inputRef = useRef();
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
      <form onSubmit={submitHandler} className="">
        <label htmlFor="id">Enter Your Id</label>
        <div className="flex items-center mt-1">
          <input
            className="border border-stone-400 rounded text-lg px-2 py-1"
            type="text"
            name="id"
            required
            ref={inputRef}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-2 py-1 rounded text-lg ml-2 h-max"
          >
            Login
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">Username Is Taken</p>}
    </div>
  );
};

export default Login;
