// src/components/ProfileSettings/ProfileSettings.jsx
import React, { useState } from 'react';
import './ProfileSettings.css';
import pic from './assets/watermark2.png';

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    name: 'Rahul Dhamdhere',
    email: 'rahulrdhamdhere@gmail.com',
    receiveNotifications: true,
    enableGoogleCalendar: false,
    country: 'India',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile data submitted:', profileData);
  };

  return (
    <div className="profile-settings-container">
      
      <main className="content">
        <div className="profile-header">
          <h2>Profile Settings</h2>
          {/* <div className="search-box">
            <input type="search" placeholder="Search" />
          </div> */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-picture">
            {/* Replace with your image upload component */}
            <img src={pic} alt="Profile Picture" />
          </div>

          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" name="email" value={profileData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Your Password</label>
            <input type="password" id="password" name="password" value={profileData.password} onChange={handleChange} placeholder="Must have at least 8 characters" minLength="8" />
          </div>

          <div className="form-group">
            <label htmlFor="receiveNotifications">Receive email notifications?</label>
            <input type="checkbox" id="receiveNotifications" name="receiveNotifications" checked={profileData.receiveNotifications} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="enableGoogleCalendar">Enable Google Calendar</label>
            <select id="enableGoogleCalendar" name="enableGoogleCalendar" value={profileData.enableGoogleCalendar} onChange={handleChange}>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select id="country" name="country" value={profileData.country} onChange={handleChange}>
              <option value="India">India</option>
              {/* Add more countries as needed */}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={profileData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit">Save</button>
        </form>
      </main>
    </div>
  );
};

export default ProfileSettings;