import { AuthProvider } from "../Context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import Signup from "../Pages/Signup";
import ChangePicture from "../Pages/ChangePicture";
import UpdateProfile from "../Pages/UpdateProfile";
import Profile from "../Pages/Profile";
import Restore from "../Pages/Restore";
import Chat from "../Pages/Chat";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";

const App = () => {
  const [selectedChat, setSelectedChat] = useState("");

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
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
              />
            }
          />
          <Route path="/restore" element={<Restore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/change-picture" element={<ChangePicture />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  );
};

export default App;
