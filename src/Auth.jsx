import React, { useState } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import "./Auth.css";

const Auth = () => {
  const [currentForm, setCurrentForm] = useState("login");

  return (
    <div className="c1">
      <div className="container">
        {currentForm === "login" && <Login setCurrentForm={setCurrentForm} />}
        {currentForm === "signup" && <Signup setCurrentForm={setCurrentForm} />}

        <div className="switch">
          {currentForm === "login" && (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setCurrentForm("signup")}>Register!</span>
            </p>
          )}
          {currentForm === "signup" && (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentForm("login")}>Login here!</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
