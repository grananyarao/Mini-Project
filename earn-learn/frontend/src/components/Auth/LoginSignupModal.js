import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSignupModal = ({ open, onClose, setUser }) => {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ name: "", password: "", role: "Student" });
  const [signupForm, setSignupForm] = useState({ name: "", password: "", confirm: "", role: "Student" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  if (!open) return null;

  function handleLoginChange(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }
  
  function handleSignupChange(e) {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
        setUser({ name: loginForm.name, role: loginForm.role });
        onClose();
        
        // Role-based redirect
        if (loginForm.role === "Admin") {
          setTimeout(() => navigate("/admin"), 100); // Redirect to Admin Dashboard
        } else {
          setTimeout(() => navigate("/student"), 100); // Redirect to Student Dashboard
        }
      } else {
        setMsg(data.error || "Login failed.");
      }
    } catch (err) {
      setMsg("Login failed.");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setMsg("");
    if (signupForm.password !== signupForm.confirm) {
      setMsg("Password and Confirm Password do not match!");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          password: signupForm.password,
          role: signupForm.role
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
        setUser({ name: signupForm.name, role: signupForm.role });
        onClose();
        
        // Role-based redirect
        if (signupForm.role === "Admin") {
          setTimeout(() => navigate("/admin"), 100); // Redirect to Admin Dashboard
        } else {
          setTimeout(() => navigate("/student"), 100); // Redirect to Student Dashboard
        }
      } else {
        setMsg(data.error || "Signup failed.");
      }
    } catch (err) {
      setMsg("Signup failed.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <div className="modal-tabs">
          <button onClick={() => { setTab("login"); setMsg(""); }} className={tab === "login" ? "active" : ""}>Login</button>
          <button onClick={() => { setTab("signup"); setMsg(""); }} className={tab === "signup" ? "active" : ""}>Signup</button>
        </div>
        <div className="modal-body">
          {tab === "login" && (
            <form className="modal-form" onSubmit={handleLogin}>
              <label>Name</label>
              <input type="text" name="name" value={loginForm.name} required onChange={handleLoginChange} placeholder="Your name" autoFocus />
              <label>Password</label>
              <input type="password" name="password" value={loginForm.password} required onChange={handleLoginChange} placeholder="Password" />
              <label>Choose role</label>
              <select name="role" value={loginForm.role} onChange={handleLoginChange}>
                <option>Student</option>
                <option>Admin</option>
              </select>
              <button type="submit" className="modal-submit-btn">Login</button>
            </form>
          )}
          {tab === "signup" && (
            <form className="modal-form" onSubmit={handleSignup}>
              <label>Name</label>
              <input type="text" name="name" value={signupForm.name} required onChange={handleSignupChange} placeholder="Your name" autoFocus />
              <label>Password</label>
              <input type="password" name="password" value={signupForm.password} required onChange={handleSignupChange} placeholder="Password" />
              <label>Confirm Password</label>
              <input type="password" name="confirm" value={signupForm.confirm} required onChange={handleSignupChange} placeholder="Confirm password" />
              <label>Choose role</label>
              <select name="role" value={signupForm.role} onChange={handleSignupChange}>
                <option>Student</option>
                <option>Admin</option>
              </select>
              <button type="submit" className="modal-submit-btn">Signup</button>
            </form>
          )}
          {msg && <p className="modal-msg">{msg}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;
