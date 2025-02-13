import React, { useState } from "react";
import "./Lead.css"; 
import AddLeadContact from "./AddLeadContact";
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";

const Lead = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state

  const leads = [
    { id: 1, name: "Mr Jay Shah", owner: "Mr Sahil Salunke", addedBy: "Mr Sahil Salunke", created: "12-11-2024" },
    { id: 2, name: "Mr Vinod Jagtap", owner: "Mr Charul Jagtap", addedBy: "Mr Charul Jagtap", created: "12-11-2024" }
  ];

  const renderFilters = () => (
    <div className={`filter-panel ${showFilters ? "open" : ""}`}>
      <div className="d-flex justify-content-between align-items-center">
        <strong>Filters</strong>
        <div><br></br></div>
        <button className="btn-close" onClick={() => setShowFilters(false)}>×</button>
      </div>
      {renderFilterOption("Date Filter On", ["Created", "Updated on"])}
      {renderFilterOption("Lead Source", ["All", "Email", "Google", "Facebook", "Friend"])}
      {renderFilterOption("Added By", ["All", "You"])}
    </div>
  );
  

  const renderFilterOption = (label, options) => (
    <div className="mt-2">
      <label className="form-label">{label}</label>
      <select className="form-select">
        {options.map((option, index) => <option key={index}>{option}</option>)}
      </select>
    </div>
  );

  const renderTable = () => (
    <table className="table mt-3">
      <thead className="table-light">
        <tr>
          <th>Contact Name</th>
          <th>Lead Owner</th>
          <th>Added By</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.owner}</td>
            <td>{lead.addedBy}</td>
            <td>{lead.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container2 mt-4">
      <div className="d-flex justify-content-between mt-3">
        <label className="label">Duration</label>
        <select className="form-select w-25">
          {["Today", "Last 30 Days", "This Month", "Last Month", "Last 90 Days", "Last 6 Months", "Last 1 Year", "Custom Range"].map((option, index) => <option key={index}>{option}</option>)}
        </select>
        <input type="text" className="form-control w-25" placeholder="Search..." />
        <label className="label">Type</label>
        <select className="form-select w-25">
          {["All", "Lead", "Client"].map((option, index) => <option key={index}>{option}</option>)}
        </select>
        <button className="btn btn-outline-secondary ms-auto" onClick={() => setShowFilters(!showFilters)}>
    <FaFilter /> Filters
  </button>
      </div>
      {renderFilters()}
      <br/>
      <h4>Lead Contacts</h4>
      <br/>
      <div className="d-flex justify-content-between align-items-center">
       <span> <button className="btn btn-primary" onClick={() => setIsPopupOpen(true)}>
          <FaPlus /> Add Lead Contact
        </button>
        <button className="btn btn-outline-secondary import-btn">
        <span className="import-icon">⬆</span> Import
      </button>
        </span>
      </div>
      <br/>
      {renderTable()}

      {/* Popup Component */}
      <AddLeadContact isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default Lead;
