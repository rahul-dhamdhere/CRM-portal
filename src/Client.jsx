import React, { useState } from "react";
import "./Client.css";
import { FaSearch, FaFilter, FaPlus, FaEllipsisV } from "react-icons/fa";
import AddClientContact from "./AddClientContact";


const Client = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const clients = [
    { id: 1, name: "Ms Priya Sharma", owner: "Mr Sahil Salunke", addedBy: "Mr Sahil Salunke", created: "12-11-2024" },
    { id: 2, name: "Mr Rohan Mehta", owner: "Ms Charul Jagtap", addedBy: "Ms Charul Jagtap", created: "12-11-2024" }
  ];

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const renderFilters = () => (
    <div className={`filter-panel ${showFilters ? "open" : ""}`}>
      <div className="d-flex justify-content-between align-items-center">
        <strong>Filters</strong>
        <div><br></br></div>
        <button className="btn-close" onClick={() => setShowFilters(false)}>×</button>
      </div>
      {renderFilterOption("Date Filter On", ["Created", "Updated on"])}
      {renderFilterOption("Client Source", ["All", "Email", "Google", "Facebook", "Referral"])}
      {renderFilterOption("Added By", ["All", "You"])}
    </div>
  );

  const renderFilterOption = (label, options) => (
    <div className="mt-2">
      <label className="form-label">{label}</label>
      <select className="form-select">
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    </div>
  );

  const renderTable = () => (
    <table className="table mt-3">
      <thead className="table-light">
        <tr>
          <th>Contact Name</th>
          <th>Client Owner</th>
          <th>Added By</th>
          <th>Created</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>{client.owner}</td>
            <td>{client.addedBy}</td>
            <td>{client.created}</td>
            <td>
              <div className="dropdown">
                <button className="btn btn-light" onClick={() => toggleDropdown(client.id)}>
                  <FaEllipsisV />
                </button>
                {activeDropdown === client.id && (
                  <ul className="dropdown-menu show">
                    <li>
                      <button className="dropdown-item" onClick={() => alert(`View details for client ID: ${client.id}`)}>
                        👁 <strong>View</strong>
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => alert(`Edit details for client ID: ${client.id}`)}>
                        ✏️ <strong>Edit</strong>
                      </button>
                    </li>
                    <li className="text-end">
                      <button className="btn btn-link p-0 text-danger" onClick={() => setActiveDropdown(null)}>
                        ❌ Close
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </td>
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
          {["Today", "Last 30 Days", "This Month", "Last Month", "Last 90 Days", "Last 6 Months", "Last 1 Year", "Custom Range"].map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
        <input type="text" className="form-control w-25" placeholder="Search..." />
        <label className="label">Type</label>
        <select className="form-select w-25">
          {["All", "Client", "Lead"].map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
        <button className="btn btn-outline-secondary ms-auto" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button>
      </div>

      {renderFilters()}
      <br />
      <h4>Client Contacts</h4>
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <span>
          <button className="btn btn-primary" onClick={() => setIsPopupOpen(true)}>
            <FaPlus /> Add Client Contact
          </button>
          <button className="btn btn-outline-secondary import-btn">
            ⬆ Import
          </button>
        </span>
      </div>
      <br />
      {renderTable()}
      <AddClientContact isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default Client;
