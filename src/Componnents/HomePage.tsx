import React from "react";
import { useNavigate } from "react-router-dom";
import BookHook from "../assets/BookHook.png";

const HomePage: React.FC = () => {
const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={BookHook} style={{
        width: "350px",
        height: "250px",
        marginTop: "-70px",
        marginBottom: "50px",
      }}/>
      <div style={{ 
        display: "flex", 
        alignContent: "center",
        justifyContent: "center",
        gap: "50px",
        marginTop: "0px",}}>
        <button onClick={() => navigate("/login")} className="btn btn-dark" style={{
            height: "50px",
            width: "100px",
            fontSize: "20px",
        }}>
          Login
        </button>
        <button onClick={() => navigate("/register")} className="btn btn-dark" style={{
            height: "50px",
            width: "100px",
            fontSize: "20px",
        }}>
          Register
        </button>      
      </div>
    </div>
  );
};

export default HomePage;
