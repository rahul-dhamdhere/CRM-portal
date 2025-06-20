import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './uppernav.css';
import logo from './assets/stoicsalamander_logo.jpeg';
import profileIcon from './assets/watermark2.png';
import notificationIcon from './assets/notification.png';

function UpperNav() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the backend API
    fetch('http://127.0.0.1:5000/api/notifications')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        return response.json();
      })
      .then((data) => setNotifications(data))
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setNotifications([]); // Fallback to an empty array
      });
  }, []);

  const markAsRead = () => {
    fetch('http://127.0.0.1:5000/api/notifications/mark-as-read', {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to mark notifications as read');
        }
        setNotifications([]); // Reset notifications
      })
      .catch((error) => {
        console.error('Error marking notifications as read:', error);
      });
  };

  const showAllNotifications = () => {
    fetch('http://127.0.0.1:5000/api/notifications/all')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch all notifications');
        }
        return response.json();
      })
      .then((data) => setNotifications(data))
      .catch((error) => {
        console.error('Error fetching all notifications:', error);
      });
  };

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
                <span onClick={markAsRead} style={{ cursor: 'pointer' }}>Mark as Read</span> | 
                <span onClick={showAllNotifications} style={{ cursor: 'pointer' }}>Show All</span>
                <span className="close-btn" onClick={() => setNotifOpen(false)}>✖</span>
              </span>
            </div>
            <div className="notif-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="notif-item">
                    <div className="notif-content">
                      <strong>{notif.title}</strong>
                      <p>{notif.message}</p>
                      <small>{notif.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notif-empty">No new notifications</div>
              )}
            </div>
            <div className="notif-footer">Notification Panel</div>
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
              <p onClick={() => navigate('/Settings')}>Profile</p>
              <p onClick={() => {
                localStorage.removeItem('authToken');
                navigate('/auth');
              }}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpperNav;
