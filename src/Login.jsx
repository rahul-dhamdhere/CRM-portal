import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      if (response.data.message) {
        alert("Login Successful!");
        navigate("/"); // Redirect to the dashboard
      } else {
        setError(response.data.error || "Login failed.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div>
      <div className="header">
        <div className="text">Log In</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
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
        <div className="submit" onClick={handleLogin}>
          Log In
        </div>
      </div>
    </div>
  );
};

export default Login;
