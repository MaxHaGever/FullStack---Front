import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import Navbar from "./NavBar";
import RegistrationForm from "./RegistrationForm";
import Login from "./Login";
import ProfilePage from "./ProfilePage";
import ViewPosts from "./ViewPosts";
import userService from "../Services/user_service";
import PostAPost from "./PostAPost";
import ViewComments from "./ViewComments";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={username} />
      
      {/* FIX: Now Components Are Not Force-Centered */}
      <div className="bg-gray-100 min-h-screen px-6 py-12">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/profile" /> : <HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/view-posts" element={<ViewPosts />} />
          <Route path="/post-a-post" element={<PostAPost isLoggedIn={isLoggedIn} />} />
          <Route path="/comments/:postId" element={<ViewComments />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
