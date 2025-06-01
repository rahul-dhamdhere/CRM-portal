import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from './nav.jsx';
import Dashboard from './dashboard.jsx';
import UpperNav from './uppernav.jsx';
import Lead from './Lead.jsx';
import Client from './Client.jsx';
import Setting from './Settings.jsx';
import Auth from './Auth.jsx';



function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth/*" element={<Auth />} />
        {/* All other routes use the main layout */}
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

const MainApp = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh',
    overflow: 'hidden'
  }}>
    <UpperNav />
    <div style={{ 
      display: 'flex', 
      flex: 1,
      position: 'relative'
    }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/settings" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lead" element={<Lead />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/settings" element={<Setting />} />
        {/* Fallback: redirect to settings */}
        <Route path="*" element={<Navigate to="/settings" />} />
      </Routes>
    </div>
  </div>
);

export default App;
