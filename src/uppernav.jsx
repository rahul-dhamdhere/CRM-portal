import React from 'react';
import { useNavigate } from 'react-router-dom';
import './uppernav.css';
import logo from './assets/stoicsalamander_logo.jpeg';
import logout from './assets/logout.png';

function UpperNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing tokens, etc.)
    navigate('/auth'); // Navigate to the login page
  };

  return (
    <div id="uppernav">
      <div id="left">
        <img id="logo-nav1" src={logo} alt="logo" />
        <h3>CRM Portal</h3>
      </div>
      <div id='right'>
        <img id="logo-nav2" src={logout} alt="logout" onClick={handleLogout} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export default UpperNav;