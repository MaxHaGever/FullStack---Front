import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./HomePage";
import Navbar from "./NavBar";
import RegistrationForm from "./RegistrationForm";
import Login from "./Login";
import ProfilePage from "./ProfilePage";
import ViewPosts from "./ViewPosts"; // Import the ViewPosts component
import userService from "../Services/user_service";
import PostAPost from "./PostAPost"; // Import the PostAPost component

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Prevent flashing



  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
  
      try {
        const response = await userService.getUserProfile();
        setIsLoggedIn(true);
        setUsername(response.data.username);
        console.log("✅ Fetched user:", response.data.username);
      } catch (error) {
        console.error("❌ Failed to fetch user data", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkLoginStatus();
  }, []);
  

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "20px" }}>Loading...</div>; // ✅ Show loading message
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={username} />
      <div style={{ backgroundColor: "#C1BAAC", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/profile" /> : <HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/view-posts" element={<ViewPosts />} /> {/* New Route */}
          <Route path="/post-a-post" element={<PostAPost isLoggedIn={isLoggedIn}/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
