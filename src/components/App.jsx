import { AuthProvider, useAuth } from "../Context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import Signup from "../Pages/Signup";
import UpdateProfile from "../Pages/UpdateProfile";
import Restore from "../Pages/Restore";
import Chat from "../Pages/Chat";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import useLocalStorage from "../Hooks/useLocalStorage";
import Username from "../Pages/Username";
import Profile from "../Pages/Profile";
import Wellcome from "../Pages/Wellcome";

const App = () => {
  const [recep, setRecep] = useLocalStorage("recep", "");

  const getCountry = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    return res.data.country_code;
  };

  useEffect(() => {
    getCountry().then((res) => {
      if (res === "IR") toast.error("Turn On Your VPN!");
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Wellcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={<Dashboard setRecep={setRecep} />}
          />
          <Route path="/chat" element={<Chat recep={recep} />} />
          <Route path="/restore" element={<Restore />} />
          <Route path="/username" element={<Username />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
