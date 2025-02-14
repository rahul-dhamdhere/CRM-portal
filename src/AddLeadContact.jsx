import React, { useState } from "react";
import "./AddLeadContact.css";

const AddLeadContact = ({ isOpen, onClose }) => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Add Lead Contact Info</h2>
        <form>
          <div className="form-grid">
            <div className="form-group">
              <label>Salutation</label>
              <select>
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
              <input type="text" placeholder="e.g. John Doe" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="e.g. johndoe@example.com" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Lead Owner</label>
              <input type="text" value="Sahil Deshpande" disabled />
            </div>
            <div className="form-group">
              <label>Deal Name *</label>
              <input type="text" placeholder="e.g. John Doe" required />
            </div>
            <div className="form-group">
              <label>Pipeline *</label>
              <select>
                <option>Sales Pipeline</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Deal Stages *</label>
              <select>
                <option>Generated</option>
                <option>Qualified</option>
                <option>Initial Contact</option>
                <option>Schedule Appointment</option>
                <option>Proposal Sent</option>
                <option>Loss</option>
                <option>in progess</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deal Value *</label>
              <input type="number" placeholder="INR (₹) 0" required />
            </div>
            <div className="form-group">
              <label>Close Date *</label>
              <input type="date" required />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Products</label>
              <select>
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
                <input type="text" placeholder="e.g. Acme Corporation" />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="text" placeholder="e.g. https://www.example.com" />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input type="text" placeholder="e.g. 1234567890" />
              </div>
              <div className="form-group">
                <label>Office Phone Number</label>
                <input type="text" placeholder="" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select>
                  <option>--</option>
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" placeholder="e.g. California, Rajasthan, Dubai" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="e.g. New York, Jaipur, Dubai" />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" placeholder="e.g. 90250" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea placeholder="e.g. 132, My Street, Kingston, New York 12401"></textarea>
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
