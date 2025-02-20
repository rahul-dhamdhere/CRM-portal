import React, { useState } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import "./Auth.css";
import logo from "./assets/stoicsalamanderlogo.png"; 

const Auth = () => {
  const [currentForm, setCurrentForm] = useState("login");

  return (
   
    <div className="c1">

    {}
    
    <nav className="nav-bar">
    <img src={logo} alt="Company Logo" className="logo" />
  
  </nav> 



    <div className="container">
      
      

      {}
      {currentForm === "login" && <Login />}
      {currentForm === "signup" && <Signup />}
      {currentForm === "forgotPassword" && <ForgotPassword />}

      

      {}
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
    </div>
  );
};

export default Auth;
