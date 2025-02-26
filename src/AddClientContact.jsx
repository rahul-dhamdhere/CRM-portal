import React, { useState } from "react";
import "./AddClientContact.css";
import logo from "./assets/stoicsalamander_logo.jpeg";

const AddClientContact = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (e.target.name === "profilePicture") {
            setProfilePreview(reader.result);
          } else if (e.target.name === "companyLogo") {
            setLogoPreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className={`form-container ${isOpen ? "show" : ""}`}>
      <button className="btn-close" onClick={onClose}>X</button>
      <div className="page scrollable">
        <h2>Add Client</h2>
        
        <h3>Account Details</h3>
        <br/>
        <form>
          <div className="form-group-container">
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
              <input type="text" name="clientName" placeholder="Enter client name" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter email" onChange={handleChange} />
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
              <input type="text" name="mobile" placeholder="Enter mobile number" maxLength="10" onChange={handleChange} />
            </div>
            <div className="form-group">
          <label>Gender</label>
          <select name="gender" onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Change Language</label>
          <select name="language" onChange={handleChange}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
        <div className="form-group">
          <label>Client Category</label>
          <select name="clientCategory" onChange={handleChange}>
            <option>--</option>
          </select>
        </div>
        <div className="form-group">
          <label>Client Sub Category</label>
          <select name="clientSubCategory" onChange={handleChange}>
            <option>--</option>
          </select>
        </div>
        <div className="form-group">
          <label>Login Allowed?</label>
          <div>
            <input type="radio" name="loginAllowed" value="Yes" onChange={handleChange} /> Yes
            <input type="radio" name="loginAllowed" value="No" onChange={handleChange} defaultChecked /> No
          </div>
        </div>
        <div className="form-group">
          <label>Receive email notifications?</label>
          <div>
            <input type="radio" name="emailNotifications" value="Yes" onChange={handleChange} defaultChecked /> Yes
            <input type="radio" name="emailNotifications" value="No" onChange={handleChange} /> No
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
  {profilePreview && <img src={profilePreview} alt="Profile Preview" className="image-preview" style={{ width: "200px", height: "200px" }}/>}
</div>

              {/* <label>Profile Picture</label>
              <div className="profile-upload">
                <input type="file" name="profilePicture" accept="image/*" onChange={handleChange} />
                {profilePreview && <img src={profilePreview} alt="Profile Preview" className="image-preview" />}
              </div> */}
            </div>
          </div>
          
          <h3>Company Details</h3>
          <br/>

          <div className="form-group-container">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="companyName" placeholder="Enter company name" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Official Website</label>
              <input type="text" name="website" placeholder="Enter website URL" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tax Name</label>
              <input type="text" name="taxName" placeholder="Enter tax name" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GST/VAT Number</label>
              <input type="text" name="gstNumber" placeholder="Enter GST/VAT number" onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Company Address</label>
              <textarea name="companyAddress" placeholder="Enter company address" onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Office Phone Number</label>
              <input type="number" name="OfficePhoneNumber" placeholder="Office Phone Number" onChange={handleChange}></input>
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="City" placeholder="Pune" onChange={handleChange}></input>
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="State" placeholder="Maharashtra" onChange={handleChange}></input>
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="PostalCode" placeholder="411005" onChange={handleChange}></input>
            </div>
          </div>
          
          <h3>Additional Details</h3>
          <br/>

          <div className="form-group-container">
            <div className="form-group">
              <label>Added By</label>
              <input type="text" name="addedBy" placeholder="Enter your name" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea name="shippingAddress" placeholder="Enter shipping address" onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Note</label>
              <textarea name="note" placeholder="Enter additional notes" onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Company Logo</label>
              <div className="logo-upload">
                <input type="file" name="companyLogo" accept="image/*" onChange={handleChange} />
                {logoPreview && <img src={logoPreview} alt="Company Logo Preview" className="image-preview" style={{ width: "200px", height: "200px" }} />}
              </div>
            </div>
          </div>
          
          <div className="btn-container">
            <button type="button" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientContact;
