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
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/*" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/auth" />} />
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/lead" element={<Lead />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </div>
  </div>
);

export default App;
