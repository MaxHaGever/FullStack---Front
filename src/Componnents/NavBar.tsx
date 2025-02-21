import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookHookLogo from "../assets/BookHook.png";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  username: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn, username }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle

  console.log("🟢 Navbar Rendered | isLoggedIn:", isLoggedIn, "| Username:", username);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* 🔥 Logo Section (No Text) */}
          <Link to="/" className="flex items-center">
            <img src={BookHookLogo} alt="Book Hook Logo" className="h-12 invert" />
          </Link>

          {/* 🔥 Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          {/* 🔥 Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            {isLoggedIn ? (
              <>
                <span className="text-gray-300 font-medium mt-2">
                  Welcome, {username || "User"}!
                </span>
                <button
                  onClick={() => navigate("/view-posts")}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  Views
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition">
                Log In
              </Link>
            )}
          </div>
        </div>

        {/* 🔥 Mobile Menu (Collapsible) */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col space-y-3 py-3 border-t border-gray-700">
            {isLoggedIn ? (
              <>
                <span className="text-gray-300 text-center font-medium">
                  Welcome, {username || "User"}!
                </span>
                <button
                  onClick={() => navigate("/view-posts")}
                  className="block text-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  Views
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="block text-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block text-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition">
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
