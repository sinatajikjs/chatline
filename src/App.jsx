import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Chat from "./Pages/Chat";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import { useState } from "react";
import Signin from "./Pages/Signin";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3A76F0",
    },
  },
});

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/chat" element={<Chat />} />
            <Route
              path="/profile"
              element={<Profile  />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <div className="hidden" id="sign-in-button"></div>
    </ThemeProvider>
  );
};

export default App;
