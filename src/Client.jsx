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
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  // Fetch clients from the API
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      console.log("API Response:", response.data);
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error.response || error);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = clients.filter(client => {
        const query = searchQuery.toLowerCase();
        return (
          (client.name && client.name.toLowerCase().includes(query)) ||
          (client.email && client.email.toLowerCase().includes(query)) ||
          (client.phone && client.phone.toLowerCase().includes(query)) ||
          (client.company_name && client.company_name.toLowerCase().includes(query))
        );
      });
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
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

  const handleViewDetails = (client) => {
    setSelectedClient({
      id: client.id,
      salutation: client.salutation || "",
      name: client.name || "",
      email: client.email || "",
      country: client.country || "India",
      phone: client.phone || "",
      gender: client.gender || "Male",
      language: client.language || "English",
      client_category: client.client_category || "",
      client_sub_category: client.client_sub_category || "",
      login_allowed: client.login_allowed || "No",
      email_notifications: client.email_notifications || "Yes",
      profile_picture: client.profile_picture || null,
      company_name: client.company_name || "",
      website: client.website || "",
      tax_name: client.tax_name || "",
      gst_number: client.gst_number || "",
      company_address: client.company_address || "",
      office_phone_number: client.office_phone_number || "",
      city: client.city || "",
      state: client.state || "",
      postal_code: client.postal_code || "",
      added_by: client.added_by || "",
      shipping_address: client.shipping_address || "",
      note: client.note || "",
      company_logo: client.company_logo || null
    }); // Removed created_at field
    setIsDetailsPopupOpen(true);
  };

  const handleEditDetails = async () => {
    // Validate required fields
    if (!selectedClient.name) {
        alert("Client name is required.");
        return;
    }
    if (!selectedClient.phone || !/^\d{10}$/.test(selectedClient.phone)) {
        alert("Phone number is required and must be a valid 10-digit number.");
        return;
    }

    try {
        const response = await axios.put(
            `http://localhost:5000/api/clients/${selectedClient.id}`,
            selectedClient, // Send the updated object to the backend
            { headers: { "Content-Type": "application/json" } }
        );
        alert("Client updated successfully.");
        // Update the local state with the updated client data
        setClients(clients.map((client) => (client.id === selectedClient.id ? response.data.client : client)));
        setFilteredClients(filteredClients.map((client) => (client.id === selectedClient.id ? response.data.client : client)));
        setIsDetailsPopupOpen(false); // Close the popup
    } catch (error) {
        console.error("Error updating client:", error);
        alert(error.response?.data?.error || "Failed to update client. Please try again.");
    }
};

  const handleRemoveClient = async (clientId) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${clientId}`);
      setClients(clients.filter((client) => client.id !== clientId));
      setFilteredClients(filteredClients.filter((client) => client.id !== clientId));
      alert("Client removed successfully.");
    } catch (error) {
      console.error("Error removing client:", error);
      alert("Failed to remove client. Please try again.");
    }
  };

  const handleExportClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "clients_export.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("PDF exported and downloaded successfully.");
    } catch (error) {
      console.error("Error exporting clients:", error);
      alert("Failed to export clients. Please try again.");
    }
  };

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

  const renderDetailsPopup = () => {
    if (!isDetailsPopupOpen || !selectedClient) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-container">
          <h2>View & Edit Client Details</h2>
          <form>
            <div className="form-group-container">
              <div className="form-group">
                <label>Salutation</label>
                <select
                  name="salutation"
                  value={selectedClient.salutation}
                  onChange={(e) => setSelectedClient({ ...selectedClient, salutation: e.target.value })}
                >
                  <option>--</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Miss</option>
                </select>
              </div>
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  value={selectedClient.name}
                  onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={selectedClient.email}
                  onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={selectedClient.country}
                  onChange={(e) => setSelectedClient({ ...selectedClient, country: e.target.value })}
                >
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mobile *</label>
                <input
                  type="text"
                  value={selectedClient.phone}
                  onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={selectedClient.gender}
                  onChange={(e) => setSelectedClient({ ...selectedClient, gender: e.target.value })}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select
                  name="language"
                  value={selectedClient.language}
                  onChange={(e) => setSelectedClient({ ...selectedClient, language: e.target.value })}
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="profile-upload">
                  {selectedClient.profile_picture ? (
                    <img
                      src={selectedClient.profile_picture}
                      alt="Profile"
                      className="image-preview"
                      style={{ width: "200px", height: "200px" }}
                    />
                  ) : (
                    <p>No profile picture uploaded</p>
                  )}
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSelectedClient({ ...selectedClient, profile_picture: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Company Logo</label>
                <div className="logo-upload">
                  {selectedClient.company_logo ? (
                    <img
                      src={selectedClient.company_logo}
                      alt="Company Logo"
                      className="image-preview"
                      style={{ width: "200px", height: "200px" }}
                    />
                  ) : (
                    <p>No company logo uploaded</p>
                  )}
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSelectedClient({ ...selectedClient, company_logo: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <h3>Company Details</h3>
            <div className="form-group-container">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={selectedClient.company_name}
                  onChange={(e) => setSelectedClient({ ...selectedClient, company_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  value={selectedClient.website}
                  onChange={(e) => setSelectedClient({ ...selectedClient, website: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tax Name</label>
                <input
                  type="text"
                  value={selectedClient.tax_name}
                  onChange={(e) => setSelectedClient({ ...selectedClient, tax_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>GST/VAT Number</label>
                <input
                  type="text"
                  value={selectedClient.gst_number}
                  onChange={(e) => setSelectedClient({ ...selectedClient, gst_number: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company Address</label>
                <textarea
                  value={selectedClient.company_address}
                  onChange={(e) => setSelectedClient({ ...selectedClient, company_address: e.target.value })}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Office Phone Number</label>
                <input
                  type="text"
                  value={selectedClient.office_phone_number}
                  onChange={(e) => setSelectedClient({ ...selectedClient, office_phone_number: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={selectedClient.city}
                  onChange={(e) => setSelectedClient({ ...selectedClient, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={selectedClient.state}
                  onChange={(e) => setSelectedClient({ ...selectedClient, state: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={selectedClient.postal_code}
                  onChange={(e) => setSelectedClient({ ...selectedClient, postal_code: e.target.value })}
                />
              </div>
            </div>

            <h3>Additional Details</h3>
            <div className="form-group-container">
              <div className="form-group">
                <label>Added By *</label>
                <input
                  type="text"
                  value={selectedClient.added_by}
                  onChange={(e) => setSelectedClient({ ...selectedClient, added_by: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  value={selectedClient.shipping_address}
                  onChange={(e) => setSelectedClient({ ...selectedClient, shipping_address: e.target.value })}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Note</label>
                <textarea
                  value={selectedClient.note}
                  readOnly
                ></textarea>
              </div>
            </div>

            <div className="btn-container">
              <button type="button" className="btn btn-primary" onClick={handleEditDetails}>
                Save Changes
              </button>
              <button className="btn btn-cancel" onClick={() => setIsDetailsPopupOpen(false)}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    console.log("Filtered Clients:", filteredClients);
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
            <th>Company Name</th>
            <th>Company Details</th>
            <th>Action</th> {/* Removed Created column */}
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td>{client.name || "N/A"}</td>
              <td>{client.email || "N/A"}</td>
              <td>{client.phone || "N/A"}</td>
              <td>{client.company_name || "N/A"}</td>
              <td>{client.company_address || "N/A"}</td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-light" onClick={() => toggleDropdown(client.id)}>
                    <FaEllipsisV />
                  </button>
                  {activeDropdown === client.id && (
                    <ul className="dropdown-menu show">
                      <li>
                        <button className="dropdown-item" onClick={() => handleViewDetails(client)}>
                          👁 <strong>View & Edit</strong>
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleRemoveClient(client.id)}>
                          🗑 <strong>Remove Client</strong>
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
        <button className="btn btn-outline-secondary import-btn" onClick={handleExportClients}>
          ⬆ Export as PDF
        </button>
      </div>
      <br />
      {renderTable()}
      <AddClientContact
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          fetchClients();
        }}
      />
      {renderDetailsPopup()}
    </div>
  );
};

export default Client;