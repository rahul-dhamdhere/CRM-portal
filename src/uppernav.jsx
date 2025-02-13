import React from 'react';
import './uppernav.css';
import logo from './assets/stoicsalamander_logo.jpeg';
import logout from './assets/logout.png'

function UpperNav() {
  return (
    <div id="uppernav">
      <div id="left">
          <img id="logo-nav1" src={logo} alt="logo" />
          <h3>CRM Portal</h3>
      </div>
      <div id='right'>
          <img id="logo-nav2" src={logout} alt="logo" /> 
      </div>
    </div>
  );
}

export default UpperNav;