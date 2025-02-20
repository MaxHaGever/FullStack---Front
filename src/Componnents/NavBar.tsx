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

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page when the button is clicked
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={BookHookLogo} alt="Book Hook Logo" style={{
            filter: "invert(1)",
          }} width="60" height="45" />
        </Link>

        {/* Navbar Collapse for Responsive Design */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* If logged in, show username and logout button */}
            {isLoggedIn ? (
              <>
                <li className="nav-item mt-2">
                <span className="navbar-text text-white me-3">
  {isLoggedIn ? `Welcome, ${username || "User"}!` : "Welcome, Guest!"}
</span>

                </li>
                <li className="nav-item">
                <button onClick={handleProfileClick} className="btn btn-outline-light" style={{
                    marginRight: "10px",
                  }} >
                    Profile
                  </button>
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Log Out
                  </button>
                  
                </li>
                <li className="nav-item">

                </li>
              </>
            ) : (
              // If not logged in, show login button
              <li className="nav-item">
                <Link className="btn btn-outline-light" to="/login">
                  Log In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
