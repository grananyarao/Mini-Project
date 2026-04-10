import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginSignupModal from "../Auth/LoginSignupModal";

const Navbar = ({ user, setUser }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div style={{ display: "flex", alignItems: "center", gap: "2em" }}>
          {/* JUST BRAND TEXT, NO IMAGE */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{
              fontSize: "1.5em",
              fontWeight: 600,
              color: "#202742",
              letterSpacing: 0.2,
              fontFamily: "inherit"
            }}>
              Earn&Learn
            </span>
          </Link>
          <div className="navbar-links">
            {user && user.role === "Student" &&
              <Link to="/student">Student Dashboard</Link>
            }
            {user && user.role === "Admin" &&
              <Link to="/admin">Admin Dashboard</Link>
            }
          </div>
        </div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1.7em" }}>
            <span style={{ fontWeight: 600, color: "#2267b0" }}>
              Welcome, {user.name}{" "}
              <span style={{ color: "#888", fontWeight: 400 }}>({user.role})</span>
            </span>
            <button className="nav-login-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="nav-login-btn" onClick={() => setModalOpen(true)}>
            Login / Signup
          </button>
        )}
        <LoginSignupModal open={modalOpen} onClose={() => setModalOpen(false)} setUser={setUser} />
      </div>
    </nav>
  );
};

export default Navbar;
