import React from "react";
import { useNavigate } from "react-router-dom";
import BookHook from "../assets/BookHook.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      {/* Logo */}
      <img src={BookHook} alt="BookHook Logo" className="w-80 h-60 mb-8" />

      {/* Buttons */}
      <div className="flex space-x-6">
        <button 
          onClick={() => navigate("/login")} 
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button 
          onClick={() => navigate("/register")} 
          className="px-6 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition"
        >
          Register
        </button>
      </div>

    </div>
  );
};

export default HomePage;
