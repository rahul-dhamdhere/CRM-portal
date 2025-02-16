import React, { useState } from "react";
import "./AddClientContact.css";
import logo from "./assets/stoicsalamander_logo.jpeg";

const AddClientContact = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`form-container ${isOpen ? "show" : ""}`}>
      <button className="btn-close" onClick={onClose}>X</button>
      {step === 1 && (
        <div className="page">
          <h2>Add Client - Account Details</h2>
          <form>
            <div className="form-group">
              <label>Salutation</label>
              <select name="salutation" onChange={handleChange}>
                <option>--</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Miss</option>
              </select>
            </div>
            <div className="form-group">
              <label>Client Name *</label>
              <input type="text" name="clientName" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select name="country" onChange={handleChange}>
                <option>India</option>
                <option>USA</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="text" name="mobile" onChange={handleChange} />
            </div>
            <div className="form-group">
              <button type="button" onClick={handleNext} className="btn btn-primary">Next</button>
              <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="page">
          <h2>Add Client - Company Details</h2>
          <form>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="companyName" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Official Website</label>
              <input type="text" name="website" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tax Name</label>
              <input type="text" name="taxName" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GST/VAT Number</label>
              <input type="text" name="gstNumber" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company Address</label>
              <textarea name="companyAddress" onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <button type="button" onClick={handleBack} className="btn btn-secondary">Back</button>
              <button type="button" onClick={handleNext} className="btn btn-primary">Next</button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="page">
          <h2>Add Client - Additional Details</h2>
          <form>
            <div className="form-group">
              <label>Added By</label>
              <input type="text" name="addedBy" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea name="shippingAddress" onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Note</label>
              <textarea name="note" onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Company Logo</label>
              <input type="file" name="companyLogo" onChange={handleChange} />
            </div>
            <div className="form-group">
              <button type="button" onClick={handleBack} className="btn btn-secondary">Back</button>
              <button type="button" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddClientContact;
