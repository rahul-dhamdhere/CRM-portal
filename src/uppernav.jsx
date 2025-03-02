import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './uppernav.css';
import logo from './assets/stoicsalamander_logo.jpeg';
import logout from './assets/logout.png';
import profileIcon from './assets/watermark2.png';

function UpperNav() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        <div className="profile-dropdown">
          <img 
            id="profile-icon" 
            src={profileIcon} 
            alt="Profile" 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            style={{ cursor: 'pointer' }} 
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p onClick={() => navigate('/profile')}>Profile</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpperNav;
