import React, { useState, useEffect } from "react";
import "./Lead.css";
import AddLeadContact from "./AddLeadContact";
import { FaSearch, FaFilter, FaPlus, FaEllipsisV } from "react-icons/fa";

const Lead = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', owner: 'Admin', addedBy: 'Admin', created: '2023-10-01' },
    { id: 2, name: 'Jane Smith', owner: 'Admin', addedBy: 'Admin', created: '2023-10-02' },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLeads, setFilteredLeads] = useState(leads);

  useEffect(() => {
    if (searchQuery) {
      const filtered = leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.addedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
    }
  }, [searchQuery, leads]);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleViewDetails = (lead) => {
    alert(`Viewing details for ${lead.name}`);
  };

  const handleRemoveLead = (leadId) => {
    setLeads(leads.filter((lead) => lead.id !== leadId));
    setFilteredLeads(filteredLeads.filter((lead) => lead.id !== leadId));
    alert("Lead removed successfully.");
  };

  const handleExportLeads = () => {
    alert("This is a frontend-only demo. Export functionality is not available.");
  };

  const renderTable = () => {
    if (filteredLeads.length === 0) return <p>No leads found.</p>;

    return (
      <table className="table mt-3">
        <thead className="table-light">
          <tr>
            <th>Contact Name</th>
            <th>Lead Owner</th>
            <th>Added By</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.owner}</td>
              <td>{lead.addedBy}</td>
              <td>{lead.created}</td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-light" onClick={() => toggleDropdown(lead.id)}>
                    <FaEllipsisV />
                  </button>
                  {activeDropdown === lead.id && (
                    <ul className="dropdown-menu show">
                      <li>
                        <button className="dropdown-item" onClick={() => handleViewDetails(lead)}>
                          👁 <strong>View & Edit</strong>
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleRemoveLead(lead.id)}>
                          🗑 <strong>Remove Lead</strong>
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
  };

  return (
    <div className="container2 mt-4">
      <div className="d-flex justify-content-between mt-3">
        <label className="label">Duration</label>
        <select className="form-select w-25">
          {["Today", "Last 30 Days", "This Month", "Last Month", "Last 90 Days", "Last 6 Months", "Last 1 Year", "Custom Range"].map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label className="label">Type</label>
        <select className="form-select w-25">
          {["All", "Lead", "Client"].map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
        <button className="btn btn-outline-secondary ms-auto" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button>
      </div>
      <br />
      <h4>Lead Contacts</h4>
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <span>
          <button className="btn btn-primary" onClick={() => setIsPopupOpen(true)}>
            <FaPlus /> Add Lead Contact
          </button>
          <button className="btn btn-outline-secondary import-btn" onClick={handleExportLeads}>
            ⬆ Export as PDF
          </button>
        </span>
      </div>
      <br />
      {renderTable()}
      <AddLeadContact
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddLead={(newLead) => {
          setLeads((prevLeads) => [...prevLeads, newLead]);
          setFilteredLeads((prevFilteredLeads) => [...prevFilteredLeads, newLead]);
        }}
      />
    </div>
  );
};

export default Lead;