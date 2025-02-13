import React, { useState } from "react";
import "./Lead.css"; 
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";

function Lead(){
  const [showFilters, setShowFilters] = useState(false);

  const leads = [
    { id: 1, name: "Mr Jay Shah", owner: "Mr Sahil Salunke", addedBy: "Mr Sahil Salunke", created: "12-11-2024" },
    { id: 2, name: "Mr Vinod Jagtap", owner: "Mr Charul Jagtap", addedBy: "Mr Charul Jagtap", created: "12-11-2024" }
  ];

  return (
    <div className="container mt-4">
       {/* Search & Filters */}
       <div className="d-flex justify-content-between mt-3">
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
        <div className="filter-panel p-3 mt-3 border rounded">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Filters</strong>
            <button className="btn-close" onClick={() => setShowFilters(false)}></button>
          </div>

          <div className="mt-2">
            <label className="form-label">Date Filter On</label>
            <select className="form-select">
              <option>Created</option>
              <option>Updated on</option>
            </select>
          </div>

          <div className="mt-2">
            <label className="form-label">Lead Source</label>
            <select className="form-select">
              <option>All</option>
              <option>Email</option>
              <option>Google</option>
              <option>Facebook</option>
              <option>Friend</option>
            </select>
          </div>

          <div className="mt-2">
            <label className="form-label">Added By</label>
            <select className="form-select">
              <option>All</option>
              <option>You</option>
            </select>
          </div>
        </div>
      )}

      <br/>
    

      <h4>Lead Contacts</h4>

      <br/>

      {/* Buttons */}
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary"><FaPlus /> Add Lead Contact</button>
        <button className="btn btn-outline-secondary">Import</button>
      </div>

     
      <br/>

      {/* Table */}
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
    </div>
  );
};

export default Lead;
