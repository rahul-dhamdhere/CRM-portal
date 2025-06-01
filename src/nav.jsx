import React, { useState } from 'react';
import home from './assets/home.png';
import lead from './assets/lead.png'
import client from './assets/clients.png'
import setting from './assets/setting.png'
import './nav.css';
import {Link} from 'react-router-dom';
function Nav() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
   
    <div id="block1" className={collapsed ? 'collapsed' : ''}>
      <Link id="blocks" to="/dashboard">
        <img id="image" src={home} alt="home" />
        <h3>Dashboard</h3>
      </Link>
      <Link id="blocks" to="/lead">
        <img id="image" src={lead} alt="lead" />
        <h3>Lead</h3>
      </Link>
      <Link id="blocks" to="/clients">
        <img id="image" src={client} alt="clients" />
        <h3>Clients</h3>
      </Link>
      <Link id="blocks" to="/settings">
        <img id="image" src={setting} alt="settings" />
        <h3>Setting</h3>
      </Link>

      
      {/* Arrow for collapsing/expanding at the bottom */}
      <div className="collapse-arrow" onClick={toggleCollapse}>
        {collapsed ? '<' : '>'}
      </div>
      
   
    

    </div>
    
  );
}

export default Nav;

