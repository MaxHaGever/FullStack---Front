import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Navbar from "./NavBar";
import RegistrationForm from "./RegistrationForm";
import Login from "./Login";
import userService from "../Services/user_service";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const response = await userService.getUserProfile();
          setUsername(response.data.username);
          console.log("✅ Fetched user:", response.data.username);
        } catch (error) {
          console.error("❌ Failed to fetch user data", error);
        }
      } else {
        setUsername(null);
      }
    };

    checkLoginStatus(); // ✅ Run on mount
    window.addEventListener("storage", checkLoginStatus); // ✅ Listen for login/logout

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={username} />
      <div style={{ backgroundColor: "#C1BAAC", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
