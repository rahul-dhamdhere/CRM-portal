import React, { useState } from "react";
import axios from 'axios'; // Import axios for API requests
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async () => {
    let isValid = true;
  
    if (email.trim() === "") {
      setEmailError("Email is required.");
      isValid = false;
    } else {
      validateEmail(email);
    }
  
    if (password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    if (isValid) {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email,
          password
        });
  
        if (response.data.message) {
          alert("Login Successful!");
          navigate("/dashboard");  // Redirect on successful login
        } else {
          alert(response.data.error || "Login failed.");
        }
      } catch (error) {
        alert("Invalid credentials. Please try again.");
      }
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
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
        </div>

        <label>Password</label>
        <div className="input">
          <input
            type="password"
            placeholder="Must have at least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          Log In
        </div>
      </div>
    </div>
  );
};

export default Login;
