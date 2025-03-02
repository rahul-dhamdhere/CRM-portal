import React, { useState } from "react";
import "./Auth.css"; // Use the same CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
      setEmailError("Email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleReset = () => {
    if (validateEmail(email)) {
      setSuccessMessage("A reset link has been sent to your email.");
      setEmail("");
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Forgot Password</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <label>Email Address</label>
        <div className="input">
          <input
            type="email"
            placeholder="Enter Valid  email  address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
          />
        </div>
        {emailError && <p className="error">{emailError}</p>}
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleReset}>
          Send Reset Link
        </div>
      </div>

      {successMessage && <p className="success">{successMessage}</p>}

      <div className="acc">
        Remember your password? <span onClick={() => window.location.href = "/login"}>Login</span>
      </div>
    </div>
  );
};

export default ForgotPassword;
