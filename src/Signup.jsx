import React, { useState } from "react";
import "./Auth.css";

const Signup = ({ setCurrentForm }) => {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    alert("Signup Successful! This is a frontend-only demo.");
    setCurrentForm("login"); // Switch to login form
  };

  return (
    <div>
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <label>Company Name</label>
        <div className="input">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <label>Your Name</label>
        <div className="input">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <label>Email Address</label>
        <div className="input">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>Password</label>
        <div className="input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="submit-container">
        <div className="submit" onClick={handleSignup}>
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default Signup;
