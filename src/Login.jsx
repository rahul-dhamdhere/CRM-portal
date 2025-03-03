import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = () => {
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
      alert("Login Successful!");
      navigate("/"); // Navigate to the dashboard route
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
        {emailError && <p className="error">{emailError}</p>}

        <label>Password</label>
        <div className="input password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Must have at least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
                      </span>
        </div>
        {passwordError && <p className="error">{passwordError}</p>}
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
