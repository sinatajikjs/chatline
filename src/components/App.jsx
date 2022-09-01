import useLocalStorage from "../Hooks/useLocalStorage";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { io } from "socket.io-client";
import { useState } from "react";

const App = () => {
  const [username, setUsername] = useLocalStorage("username", "");
  const socket = io("http://localhost:5000");

  return username ? (
    <Dashboard socket={socket} username={username} setUsername={setUsername} />
  ) : (
    <Login socket={socket} username={username} setUsername={setUsername} />
  );
};

export default App;
