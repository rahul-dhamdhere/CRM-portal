import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Signup = ({ setCurrentForm }) => {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        companyName,
        name,
        email,
        password,
      });

      if (response.data.message) {
        alert("Signup Successful!");
        setCurrentForm("login"); // Switch to login form
      } else {
        setError(response.data.error || "Signup failed.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed. Please try again.");
    }
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
