import React, { useState } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import "./Auth.css";
import logo from "./assets/stoicsalamanderlogo.jpg"; 

const Auth = () => {
  const [currentForm, setCurrentForm] = useState("login");

  return (
    <div className="container">
      <nav></nav> 

      {/* Forms */}
      {currentForm === "login" && <Login />}
      {currentForm === "signup" && <Signup />}
      {currentForm === "forgotPassword" && <ForgotPassword />}

      {/* Switch Between Forms */}
      <div className="switch">
        {currentForm === "login" && (
          <>
            <div className="forgot-password">
              Forgot Password? <span onClick={() => setCurrentForm("forgotPassword")}>Click Here!</span>
            </div>
            <p>
              Don't have an account? <span onClick={() => setCurrentForm("signup")}>Register!</span>
            </p>
          </>
        )}
        {currentForm === "signup" && (
          <p>
            Already have an account? <span onClick={() => setCurrentForm("login")}>Login here!</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
