import React, { useState } from "react";
import "./AddLeadContact.css";

const AddLeadContact = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Add Lead Contact Info</h2>
        <form>
          <label>Salutation</label>
          <select>
            <option>--</option>
          </select>

          <label>Name *</label>
          <input type="text" placeholder="e.g. John Doe" required />

          <label>Email</label>
          <input type="email" placeholder="e.g. johndoe@example.com" />

          <label>Lead Owner</label>
          <input type="text" value="Sahil Deshpande" disabled />

          <label>Deal Name *</label>
          <input type="text" placeholder="e.g. John Doe" required />

          <label>Pipeline *</label>
          <select>
            <option>Sales Pipeline</option>
          </select>

          <label>Deal Stages *</label>
          <select>
            <option>Generated</option>
          </select>

          <label>Deal Value *</label>
          <input type="number" placeholder="INR (₹) 0" required />

          <label>Close Date *</label>
          <input type="date" required />

          <label>Products</label>
          <select>
            <option>Select Product</option>
          </select>

          <label>Deal Watcher</label>
          <input type="text" value="Sahil Deshpande" disabled />

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
