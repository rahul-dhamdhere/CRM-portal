import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Client.css";
import { FaSearch, FaFilter, FaPlus, FaEllipsisV } from "react-icons/fa";
import AddClientContact from "./AddClientContact";

const Client = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  // Fetch clients from the API
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
      setFilteredClients(response.data); // Initialize filtered clients
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients); // Reset to all clients if search query is empty
    }
  }, [searchQuery, clients]);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const renderFilters = () => (
    <div className={`filter-panel ${showFilters ? "open" : ""}`}>
      <div className="d-flex justify-content-between align-items-center">
        <strong>Filters</strong>
        <button className="btn-close" onClick={() => setShowFilters(false)}>×</button>
      </div>
      {renderFilterOption("Date Filter On", ["Created", "Updated on"])}
      {renderFilterOption("Client Source", ["All", "Email", "Google", "Facebook", "Referral"])}
      {renderFilterOption("Added By", ["All", "You"])}
    </div>
  );

  const renderTable = () => {
    if (loading) return <p>Loading clients...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (filteredClients.length === 0) return <p>No clients found.</p>;

    return (
      <table className="table mt-3">
        <thead className="table-light">
          <tr>
            <th>Contact Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email || "N/A"}</td>
              <td>{client.phone || "N/A"}</td>
              <td>{client.company || "N/A"}</td>
              <td>{new Date(client.created_at).toLocaleDateString()}</td>
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
        <button className="btn btn-primary" onClick={() => setIsPopupOpen(true)}>
          <FaPlus /> Add Client Contact
        </button>
        <button className="btn btn-outline-secondary import-btn">
          ⬆ Import
        </button>
      </div>
      <br />
      {renderTable()}
      <AddClientContact
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          fetchClients(); // Refresh client list after adding a new client
        }}
      />
    </div>
  );
};

export default Client;