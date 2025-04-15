import React, { useState } from "react";
import axios from "axios";
import "./AddLeadContact.css";

const AddLeadContact = ({ isOpen, onClose, onAddLead }) => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [formData, setFormData] = useState({
    salutation: "",
    name: "",
    email: "",
    dealName: "",
    pipeline: "Sales Pipeline",
    dealStage: "Generated",
    dealValue: "",
    closeDate: "",
    product: "",
    companyName: "",
    website: "",
    mobile: "",
    officePhone: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when the user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.dealName) newErrors.dealName = "Deal name is required.";
    if (!formData.dealValue) newErrors.dealValue = "Deal value is required.";
    if (!formData.closeDate) newErrors.closeDate = "Close date is required.";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newLead = {
      id: Date.now(),
      name: formData.name,
      owner: "Rahul Dhamdhere", // Example owner
      addedBy: "Sahil Deshpande", // Example addedBy
      created: new Date().toISOString().split("T")[0], // Current date
    };
    onAddLead(newLead); // Pass the new lead to the parent component
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Add Lead Contact Info</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Salutation</label>
              <select name="salutation" value={formData.salutation} onChange={handleChange}>
                <option>--</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Miss</option>
                <option>Dr.</option>
                <option>Sir</option>
                <option>Madam</option>
              </select>
            </div>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. johndoe@example.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Lead Owner</label>
              <input type="text" value="Rahul Dhamdhere" disabled />
            </div>
            <div className="form-group">
              <label>Deal Name *</label>
              <input
                type="text"
                name="dealName"
                value={formData.dealName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={errors.dealName ? "error" : ""}
                required
              />
              {errors.dealName && <span className="error-message">{errors.dealName}</span>}
            </div>
            <div className="form-group">
              <label>Pipeline *</label>
              <select name="pipeline" value={formData.pipeline} onChange={handleChange}>
                <option>Sales Pipeline</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Deal Stages *</label>
              <select name="dealStage" value={formData.dealStage} onChange={handleChange}>
                <option>Generated</option>
                <option>Qualified</option>
                <option>Initial Contact</option>
                <option>Schedule Appointment</option>
                <option>Proposal Sent</option>
                <option>Loss</option>
                <option>In Progress</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deal Value *</label>
              <input
                type="number"
                name="dealValue"
                value={formData.dealValue}
                onChange={handleChange}
                placeholder="INR (₹) 0"
                className={errors.dealValue ? "error" : ""}
                required
              />
              {errors.dealValue && <span className="error-message">{errors.dealValue}</span>}
            </div>
            <div className="form-group">
              <label>Close Date *</label>
              <input
                type="date"
                name="closeDate"
                value={formData.closeDate}
                onChange={handleChange}
                className={errors.closeDate ? "error" : ""}
                required
              />
              {errors.closeDate && <span className="error-message">{errors.closeDate}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Products</label>
              <select name="product" value={formData.product} onChange={handleChange}>
                <option>Select Product</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deal Watcher</label>
              <input type="text" value="Sahil Deshpande" disabled />
            </div>
          </div>

          <div className="company-details-toggle" onClick={() => setShowCompanyDetails(!showCompanyDetails)}>
            <h3>Company Details {showCompanyDetails ? "▲" : "▼"}</h3>
          </div>
          {showCompanyDetails && (
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corporation"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g. https://www.example.com"
                />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 1234567890"
                  className={errors.mobile ? "error" : ""}
                />
                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
              </div>
              <div className="form-group">
                <label>Office Phone Number</label>
                <input
                  type="text"
                  name="officePhone"
                  value={formData.officePhone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option>--</option>
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. California, Rajasthan, Dubai"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. New York, Jaipur, Dubai"
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 90250"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 132, My Street, Kingston, New York 12401"
                ></textarea>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary">Save & Add More</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadContact;