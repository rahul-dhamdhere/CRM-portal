import React, { useState } from "react";
import "./Auth.css";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validate Email
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
    }
  };

  return (
    <div>
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={emailIcon} alt="Email" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
        </div>
        {emailError && <p className="error">{emailError}</p>}

        <div className="input">
          <img src={passwordIcon} alt="Password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {passwordError && <p className="error">{passwordError}</p>}
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          Login
        </div>
      </div>

      
    </div>
  );
};

export default Login;
