import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Lead.css";
import AddLeadContact from "./AddLeadContact";
import { FaSearch, FaFilter, FaPlus, FaEllipsisV } from "react-icons/fa";

const Lead = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null); // State for selected lead
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false); // State for details popup

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leads"); // Ensure endpoint matches main.py
        setLeads(response.data);
        setFilteredLeads(response.data); // Initialize filtered leads
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filter leads based on search query
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
      setFilteredLeads(leads); // Reset to all leads if search query is empty
    }
  }, [searchQuery, leads]);

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
      {renderFilterOption("Lead Source", ["All", "Email", "Google", "Facebook", "Friend"])}
      {renderFilterOption("Added By", ["All", "You"])}
    </div>
  );

  const handleViewDetails = (lead) => {
    setSelectedLead(lead); // Set the selected lead
    setIsDetailsPopupOpen(true); // Open the details popup
  };

  const handleEditDetails = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leads/${selectedLead.id}`,
        selectedLead,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message || "Lead updated successfully.");
      setLeads(leads.map((lead) => (lead.id === selectedLead.id ? response.data.lead : lead)));
      setFilteredLeads(filteredLeads.map((lead) => (lead.id === selectedLead.id ? response.data.lead : lead)));
      setIsDetailsPopupOpen(false);

      // Notify backend about the edit
      await axios.post("http://localhost:5000/api/notifications", {
        title: "Lead Edited",
        message: `Lead ${selectedLead.name} has been updated.`,
        time: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error updating lead:", error.response || error);
      alert(error.response?.data?.error || "Failed to update lead. Please try again.");
    }
  };

  const handleRemoveLead = async (leadId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/leads/${leadId}`);
      alert(response.data.message || "Lead removed successfully.");
      setLeads(leads.filter((lead) => lead.id !== leadId));
      setFilteredLeads(filteredLeads.filter((lead) => lead.id !== leadId));

      // Notify backend about the removal
      await axios.post("http://localhost:5000/api/notifications", {
        title: "Lead Removed",
        message: `A lead has been removed.`,
        time: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error removing lead:", error.response || error);
      alert(error.response?.data?.error || "Failed to remove lead. Please try again.");
    }
  };

  const handleExportLeads = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leads/export", {
        responseType: "blob", // Ensure the response is treated as a file
      });

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads_export.pdf"); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("PDF exported and downloaded successfully.");
    } catch (error) {
      console.error("Error exporting leads:", error);
      alert("Failed to export leads. Please try again.");
    }
  };

  const renderDetailsPopup = () => {
    if (!isDetailsPopupOpen || !selectedLead) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-container">
          <h2>View & Edit Lead Details</h2>
          <form>
            <p>
              <strong>Salutation:</strong>
              <input
                type="text"
                value={selectedLead.salutation}
                onChange={(e) => setSelectedLead({ ...selectedLead, salutation: e.target.value })}
              />
            </p>
            <p>
              <strong>Name:</strong>
              <input
                type="text"
                value={selectedLead.name}
                onChange={(e) => setSelectedLead({ ...selectedLead, name: e.target.value })}
              />
            </p>
            <p>
              <strong>Email:</strong>
              <input
                type="email"
                value={selectedLead.email}
                onChange={(e) => setSelectedLead({ ...selectedLead, email: e.target.value })}
              />
            </p>
            <p>
              <strong>Deal Name:</strong>
              <input
                type="text"
                value={selectedLead.dealName}
                onChange={(e) => setSelectedLead({ ...selectedLead, dealName: e.target.value })}
              />
            </p>
            <p>
              <strong>Pipeline:</strong>
              <input
                type="text"
                value={selectedLead.pipeline}
                onChange={(e) => setSelectedLead({ ...selectedLead, pipeline: e.target.value })}
              />
            </p>
            <p>
              <strong>Deal Stage:</strong>
              <input
                type="text"
                value={selectedLead.dealStage}
                onChange={(e) => setSelectedLead({ ...selectedLead, dealStage: e.target.value })}
              />
            </p>
            <p>
              <strong>Deal Value:</strong>
              <input
                type="number"
                value={selectedLead.dealValue}
                onChange={(e) => setSelectedLead({ ...selectedLead, dealValue: e.target.value })}
              />
            </p>
            <p>
              <strong>Close Date:</strong>
              <input
                type="date"
                value={selectedLead.closeDate}
                onChange={(e) => setSelectedLead({ ...selectedLead, closeDate: e.target.value })}
              />
            </p>
            <p>
              <strong>Product:</strong>
              <input
                type="text"
                value={selectedLead.product}
                onChange={(e) => setSelectedLead({ ...selectedLead, product: e.target.value })}
              />
            </p>
            <p>
              <strong>Company Name:</strong>
              <input
                type="text"
                value={selectedLead.companyName}
                onChange={(e) => setSelectedLead({ ...selectedLead, companyName: e.target.value })}
              />
            </p>
            <p>
              <strong>Website:</strong>
              <input
                type="text"
                value={selectedLead.website}
                onChange={(e) => setSelectedLead({ ...selectedLead, website: e.target.value })}
              />
            </p>
            <p>
              <strong>Mobile:</strong>
              <input
                type="text"
                value={selectedLead.mobile}
                onChange={(e) => setSelectedLead({ ...selectedLead, mobile: e.target.value })}
              />
            </p>
            <p>
              <strong>Office Phone:</strong>
              <input
                type="text"
                value={selectedLead.officePhone}
                onChange={(e) => setSelectedLead({ ...selectedLead, officePhone: e.target.value })}
              />
            </p>
            <p>
              <strong>Country:</strong>
              <input
                type="text"
                value={selectedLead.country}
                onChange={(e) => setSelectedLead({ ...selectedLead, country: e.target.value })}
              />
            </p>
            <p>
              <strong>State:</strong>
              <input
                type="text"
                value={selectedLead.state}
                onChange={(e) => setSelectedLead({ ...selectedLead, state: e.target.value })}
              />
            </p>
            <p>
              <strong>City:</strong>
              <input
                type="text"
                value={selectedLead.city}
                onChange={(e) => setSelectedLead({ ...selectedLead, city: e.target.value })}
              />
            </p>
            <p>
              <strong>Postal Code:</strong>
              <input
                type="text"
                value={selectedLead.postalCode}
                onChange={(e) => setSelectedLead({ ...selectedLead, postalCode: e.target.value })}
              />
            </p>
            <p>
              <strong>Address:</strong>
              <textarea
                value={selectedLead.address}
                onChange={(e) => setSelectedLead({ ...selectedLead, address: e.target.value })}
              ></textarea>
            </p>
            <p>
              <strong>Lead Owner:</strong>
              <input
                type="text"
                value={selectedLead.owner}
                onChange={(e) => setSelectedLead({ ...selectedLead, owner: e.target.value })}
              />
            </p>
            <p>
              <strong>Added By:</strong>
              <input
                type="text"
                value={selectedLead.addedBy}
                onChange={(e) => setSelectedLead({ ...selectedLead, addedBy: e.target.value })}
              />
            </p>
            <p>
              <strong>Created:</strong>
              <input
                type="date"
                value={selectedLead.created}
                onChange={(e) => setSelectedLead({ ...selectedLead, created: e.target.value })}
              />
            </p>
            <button type="button" className="btn btn-primary" onClick={handleEditDetails}>
              Save Changes
            </button>
            <button className="btn" onClick={() => setIsDetailsPopupOpen(false)}>Close</button>
          </form>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (loading) return <p>Loading leads...</p>;
    if (error) return <p className="text-danger">{error}</p>;
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
                          👁    <strong>View & Edit </strong>
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleRemoveLead(lead.id)}>
                          🗑  <strong>Remove Lead</strong>
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
      {renderFilters()}
      <br />
      <h4>Lead Contacts</h4>
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <span>
          <button className="btn btn-primary" onClick={() => setIsPopupOpen(true)}>
            <FaPlus /> Add Lead Contact
          </button>
          <button className="btn btn-outline-secondary import-btn" onClick={handleExportLeads}>
            ⬆ Export as pdf
          </button>
        </span>
      </div>
      <br />
      {renderTable()}
      {renderDetailsPopup()} {/* Render the details popup */}
      <AddLeadContact
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddLead={(newLead) => {
          setLeads([...leads, newLead]); // Add new lead to the list
          setFilteredLeads([...filteredLeads, newLead]); // Add new lead to filtered list
        }}
      />
    </div>
  );
};

export default Lead;