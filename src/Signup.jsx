import React, { useState } from "react";
import "./Auth.css";
import emailIcon from "../assets/email.png";
import userIcon from "../assets/pro.png";
import passwordIcon from "../assets/password.png";

const Signup = ({ setCurrentForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [message, setMessage] = useState("");

  // Validate Email
  const validateEmail = (email) => {
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const register = () => {
    let isValid = true;

    if (name.trim() === "") {
      setNameError("Name is required.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (email.trim() === "") {
      setEmailError("Email is required.");
      isValid = false;
    } else {
      validateEmail(email);
    }

    if (password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (rePassword.trim() === "") {
      setRePasswordError("Re-enter password.");
      isValid = false;
    } else if (password !== rePassword) {
      setRePasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setRePasswordError("");
    }

    if (isValid) {
      alert('Successfully signed up!')
    }
  };

  return (
    <div>
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={userIcon} alt="User" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {nameError && <p className="error">{nameError}</p>}

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

        <div className="input">
          <img src={passwordIcon} alt="Re-enter Password" />
          <input
            type="password"
            placeholder="Re-enter Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>
        {rePasswordError && <p className="error">{rePasswordError}</p>}
      </div>

      <div className="submit-container">
        <div className="submit" onClick={register}>
          Sign Up
        </div>
      </div>

      
    </div>
  );
};

export default Signup;
