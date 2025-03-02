import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './uppernav.css';
import logo from './assets/stoicsalamander_logo.jpeg';
import profileIcon from './assets/watermark2.png';
import notificationIcon from './assets/notification.png';

function UpperNav() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, name: "Sahil Salunke", message: "have birthday 1 Mar", time: "1 day ago" },
    { id: 2, name: "Arya Vilas Tandale", message: "have birthday 28 Feb", time: "2 days ago" },
    { id: 3, name: "Tejas Ganesh Nikam", message: "and 1 other have a birthday on 25 Feb", time: "5 days ago" },
    { id: 4, name: "Ashwini Subhash Narwade", message: "have birthday 22 Feb", time: "1 week ago" },
    { id: 5, title: "Important Notice: New Update Published", message: "Office Closure on 24th & 25th Feb 2025 – Work from Home", time: "1 week ago" },
    { id: 6, title: "Important Notice: New Update Published", message: "Reporting Process and Escalation Cycle", time: "1 week ago" }
  ]);

  return (
    <div id="uppernav">
      <div id="left">
        <img id="logo-nav1" src={logo} alt="logo" />
        <h3>CRM Portal</h3>
      </div>
      <div id='right'>
        {/* Notification Bell */}
        <div className="notification-container" onClick={() => setNotifOpen(!notifOpen)}>
          <img id="notification-icon" src={notificationIcon} alt="Notifications" />
          {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
        </div>

        {/* Notification Dropdown */}
        {notifOpen && (
          <div className="notification-dropdown">
            <div className="notif-header">
              <span>New notifications</span>
              <span className="notif-actions">
                Mark as Read | Show All
                <span className="close-btn" onClick={() => setNotifOpen(false)}>✖</span>
              </span>
            </div>
            <div className="notif-list">
              {notifications.map((notif) => (
                <div key={notif.id} className="notif-item">
                  <div className="notif-content">
                    <strong>{notif.name || notif.title}</strong>
                    <p>{notif.message}</p>
                    <small>{notif.time}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="notif-footer">Show All</div>
          </div>
        )}

        {/* Profile Dropdown */}
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
              <p onClick={() => navigate('/auth')}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpperNav;
