import React, { useState } from "react";
import axios from "axios";
import "./AddClientContact.css";

const AddClientContact = ({ isOpen, onClose, onAddClient }) => {
  const [formData, setFormData] = useState({
    salutation: "",
    clientName: "",
    email: "",
    country: "India",
    mobile: "",
    gender: "Male",
    language: "English",
    clientCategory: "",
    clientSubCategory: "",
    loginAllowed: "No",
    emailNotifications: "Yes",
    profilePicture: null,
    companyName: "",
    website: "",
    taxName: "",
    gstNumber: "",
    companyAddress: "",
    officePhoneNumber: "",
    city: "",
    state: "",
    postalCode: "",
    addedBy: "",
    shippingAddress: "",
    note: "",
    companyLogo: null,
  });
  const [errors, setErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (name === "profilePicture") {
            setProfilePreview(reader.result);
          } else if (name === "companyLogo") {
            setLogoPreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
        setFormData({ ...formData, [name]: file });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear errors when the user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "Client name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }
    if (!formData.companyName) newErrors.companyName = "Company name is required.";
    if (!formData.addedBy) newErrors.addedBy = "Added by is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const clientData = new FormData();
    clientData.append("name", formData.clientName);
    clientData.append("email", formData.email);
    clientData.append("phone", formData.mobile);
    clientData.append("companyName", formData.companyName);
    clientData.append("companyAddress", formData.companyAddress);
    clientData.append("salutation", formData.salutation);
    clientData.append("gender", formData.gender);
    clientData.append("language", formData.language);
    clientData.append("clientCategory", formData.clientCategory);
    clientData.append("clientSubCategory", formData.clientSubCategory);
    clientData.append("loginAllowed", formData.loginAllowed);
    clientData.append("emailNotifications", formData.emailNotifications);
    clientData.append("website", formData.website);
    clientData.append("taxName", formData.taxName);
    clientData.append("gstNumber", formData.gstNumber);
    clientData.append("officePhoneNumber", formData.officePhoneNumber);
    clientData.append("city", formData.city);
    clientData.append("state", formData.state);
    clientData.append("postalCode", formData.postalCode);
    clientData.append("addedBy", formData.addedBy);
    clientData.append("shippingAddress", formData.shippingAddress);
    clientData.append("note", formData.note);
    if (formData.profilePicture) clientData.append("profilePicture", formData.profilePicture);
    if (formData.companyLogo) clientData.append("companyLogo", formData.companyLogo);

    try {
        const response = await axios.post("http://localhost:5000/api/clients", clientData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        alert(response.data.message);
        onAddClient(response.data.client); // Notify parent component about the new client
        onClose(); // Close the popup
    } catch (error) {
        console.error("Error saving client:", error.response || error);
        alert(error.response?.data?.error || "Failed to save client.");
    }
};

  return (
    <div className="form-container show">
      <button className="btn-close" onClick={onClose}>X</button>
      <div className="page scrollable">
        <h2>Add Client</h2>

        <h3>Account Details</h3>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group-container">
            <div className="form-group">
              <label>Salutation</label>
              <select name="salutation" value={formData.salutation} onChange={handleChange}>
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
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                className={errors.clientName ? "error" : ""}
                required
              />
              {errors.clientName && <span className="error-message">{errors.clientName}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Country</label>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option>India</option>
                <option>USA</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mobile *</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                maxLength="10"
                className={errors.mobile ? "error" : ""}
                required
              />
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Change Language</label>
              <select name="language" value={formData.language} onChange={handleChange}>
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Client Category</label>
              <select name="clientCategory" value={formData.clientCategory} onChange={handleChange}>
                <option>--</option>
              </select>
            </div>
            <div className="form-group">
              <label>Client Sub Category</label>
              <select name="clientSubCategory" value={formData.clientSubCategory} onChange={handleChange}>
                <option>--</option>
              </select>
            </div>
            <div className="form-group">
              <label>Login Allowed?</label>
              <div>
                <input
                  type="radio"
                  name="loginAllowed"
                  value="Yes"
                  checked={formData.loginAllowed === "Yes"}
                  onChange={handleChange}
                /> Yes
                <input
                  type="radio"
                  name="loginAllowed"
                  value="No"
                  checked={formData.loginAllowed === "No"}
                  onChange={handleChange}
                /> No
              </div>
            </div>
            <div className="form-group">
              <label>Receive email notifications?</label>
              <div>
                <input
                  type="radio"
                  name="emailNotifications"
                  value="Yes"
                  checked={formData.emailNotifications === "Yes"}
                  onChange={handleChange}
                /> Yes
                <input
                  type="radio"
                  name="emailNotifications"
                  value="No"
                  checked={formData.emailNotifications === "No"}
                  onChange={handleChange}
                /> No
              </div>
            </div>
            <div className="form-group">
              <div className="profile-upload">
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleChange}
                  id="profileUpload"
                />
                <label htmlFor="profileUpload" className="upload-btn">Upload Profile Picture</label>
                {profilePreview && (
                  <img src={profilePreview} alt="Profile Preview" className="image-preview" style={{ width: "200px", height: "200px" }} />
                )}
              </div>
            </div>
          </div>

          <h3>
            Company Details
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setShowCompanyDetails(!showCompanyDetails)}
            >
              {showCompanyDetails ? "▲" : "▼"}
            </button>
          </h3>
          <br />
          {showCompanyDetails && (
            <div className="form-group-container">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={errors.companyName ? "error" : ""}
                  required
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>
              <div className="form-group">
                <label>Official Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                />
              </div>
              <div className="form-group">
                <label>Tax Name</label>
                <input
                  type="text"
                  name="taxName"
                  value={formData.taxName}
                  onChange={handleChange}
                  placeholder="Enter tax name"
                />
              </div>
              <div className="form-group">
                <label>GST/VAT Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST/VAT number"
                />
              </div>
              <div className="form-group">
                <label>Company Address</label>
                <textarea
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  placeholder="Enter company address"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Office Phone Number</label>
                <input
                  type="number"
                  name="officePhoneNumber"
                  value={formData.officePhoneNumber}
                  onChange={handleChange}
                  placeholder="Office Phone Number"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Pune"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="411005"
                />
              </div>
            </div>
          )}

          <h3>
            Additional Details
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
            >
              {showAdditionalDetails ? "▲" : "▼"}
            </button>
          </h3>
          <br />
          {showAdditionalDetails && (
            <div className="form-group-container">
              <div className="form-group">
                <label>Added By *</label>
                <input
                  type="text"
                  name="addedBy"
                  value={formData.addedBy}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={errors.addedBy ? "error" : ""}
                  required
                />
                {errors.addedBy && <span className="error-message">{errors.addedBy}</span>}
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="Enter shipping address"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Enter additional notes"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Company Logo</label>
                <div className="logo-upload">
                  <input
                    type="file"
                    name="companyLogo"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {logoPreview && (
                    <img src={logoPreview} alt="Company Logo Preview" className="image-preview" style={{ width: "200px", height: "200px" }} />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="btn-container">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientContact;