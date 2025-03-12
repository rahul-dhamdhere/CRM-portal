import React, { useState } from "react";
import axios from 'axios'; // Import axios for API requests
import "./Auth.css";

const Signup = ({ setCurrentForm }) => {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [companyNameError, setCompanyNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");

  const validateEmail = (email) => {
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const register = async () => {
    let isValid = true;

    if (companyName.trim() === "") {
      setCompanyNameError("The Company Name field is required.");
      isValid = false;
    } else {
      setCompanyNameError("");
    }

    if (name.trim() === "") {
      setNameError("The Name field is required.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (email.trim() === "") {
      setEmailError("The Email field is required.");
      isValid = false;
    } else {
      validateEmail(email);
    }

    if (password.trim() === "") {
      setPasswordError("The Password field is required.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
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
      try {
        const response = await axios.post('http://localhost:5000/signup', {
          companyName,
          name,
          email,
          password
        });

        alert(response.data.message || "Signup successful!");
      } catch (error) {
        alert(error.response?.data?.error || "Signup failed. Try again!");
      }
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
            placeholder="e.g Acme Corporation"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <label>Your Name</label>
        <div className="input">
          <input
            type="text"
            placeholder="e.g John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <label>Email Address</label>
        <div className="input">
          <input
            type="email"
            placeholder="e.g johndoe@gmail.com"
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

        <label>Re-Enter Password</label>
        <div className="input">
          <input
            type="password"
            placeholder="Re-type Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>
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
