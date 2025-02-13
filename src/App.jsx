import Nav from './nav.jsx';
import Dashboard from './dashboard.jsx';
import UpperNav from './uppernav.jsx';
import Lead from './Lead.jsx';
import Client from './Client.jsx';
import Setting from './Settings.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
