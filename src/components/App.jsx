import { AuthProvider } from "../Context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "../Pages/Signup";
import Restore from "../Pages/Restore";
import Chat from "../Pages/Chat";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import Profile from "../Pages/Profile";
import { useState } from "react";

const App = () => {
  const [emailPass, setEmailPass] = useState({ email: "", password: "" });

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/signup"
            element={<Signup setEmailPass={setEmailPass} />}
          />
          <Route path="/chat" element={<Chat />} />
          <Route path="/restore" element={<Restore />} />
          <Route path="/profile" element={<Profile emailPass={emailPass} />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
