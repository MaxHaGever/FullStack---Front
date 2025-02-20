import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BookHookLogo from "../assets/BookHook.png";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  username: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn, username }) => {
  const navigate = useNavigate();

  console.log("🟢 Navbar Rendered | isLoggedIn:", isLoggedIn, "| Username:", username);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={BookHookLogo} alt="Book Hook Logo" width="60" height="45" />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              {isLoggedIn ? (
                <>
                  <span className="navbar-text text-white me-3">Welcome, {username}!</span>
                  <button className="btn btn-outline-light" onClick={handleLogout}>Log Out</button>
                </>
              ) : (
                <Link className="btn btn-outline-light" to="/login">Log In</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
