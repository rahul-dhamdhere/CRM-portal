import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import "./Auth.css";

const Auth = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <div className="container">
      {currentForm === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentForm === "signup" && <Signup />}
      {currentForm === "forgotPassword" && <ForgotPassword />}

      <div className="switch">
        {currentForm === "login" && (
          <>
            <p>
              Don't have an account?{" "}
              <span onClick={() => setCurrentForm("signup")}>Register!</span>
            </p>
            <div className="forgot-password">
              Forgot Password?{" "}
              <span onClick={() => setCurrentForm("forgotPassword")}>
                Click Here!
              </span>
            </div>
          </>
        )}

        {currentForm === "signup" && (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentForm("login")}>Login here!</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
