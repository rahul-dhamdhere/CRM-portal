import React, { useState } from "react";
import "./Client.css"; 
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";

function Client() {
  const [showFilters, setShowFilters] = useState(false);

  const clients = [
    { id: 1, name: "Ms Priya Sharma", owner: "Mr Sahil Salunke", addedBy: "Mr Sahil Salunke", created: "12-11-2024" },
    { id: 2, name: "Mr Rohan Mehta", owner: "Ms Charul Jagtap", addedBy: "Ms Charul Jagtap", created: "12-11-2024" }
  ];

  return (
    
    <div className="container mt-4">
       {/* Search & Filters */}
       <div className="d-flex justify-content-between mt-3 gap-1.5">
       <label className="label" >Duration</label>
<select className="form-select w-25">
  <option>Today</option>
  <option>Last 30 Days</option>
  <option>This Month</option>
  <option>Last Month</option>
  <option>Last 90 Days</option>
  <option>Last 6 Months</option>
  <option>Last 1 Year</option>
  <option>Custom Range</option>
</select>

  <input type="text" className="form-control w-25" placeholder="Search..." />
  <label className="label">Type</label>
  <select className="form-select w-25">
    <option>All</option>
    <option>Lead</option>
    <option>Client</option>
  </select>

  <button className="btn btn-outline-secondary" onClick={() => setShowFilters(!showFilters)}>
    <FaFilter /> Filters
  </button>
</div>
 {/* Filter Panel */}
 {showFilters && (
        <div className="filter-panel mt-3 p-3 border rounded shadow-sm">
          <div className="d-flex justify-content-between">
            <strong>Filters</strong>
            <button className="btn-close" onClick={() => setShowFilters(false)}></button>
          </div>

          <div className="mt-2">
            <label>Date Filter On</label>
            <select className="form-select">
              <option>Created</option>
              <option>Updated on</option>
            </select>
          </div>

          <div className="mt-2">
            <label>Lead Source</label>
            <select className="form-select">
              <option>All</option>
              <option>Email</option>
              <option>Google</option>
              <option>Facebook</option>
              <option>Friend</option>
              
            </select>
          </div>

          <div className="mt-2">
            <label>Added By</label>
            <select className="form-select">
              <option>All</option>
              <option>You</option>
            </select>
          </div>
        </div>
      )}
 <br/>
      <h4>Client Contacts</h4>

      <br/>

      {/* Buttons */}
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary"><FaPlus /> Add Client Contact</button>
        <button className="btn btn-outline-secondary">Import</button>
      </div>

      {/* Table */}
      <table className="table mt-3">
        <thead className="table-light">
          <tr>
            <th>Contact Name</th>
            <th>Client Owner</th>
            <th>Added By</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.owner}</td>
              <td>{client.addedBy}</td>
              <td>{client.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Client;
