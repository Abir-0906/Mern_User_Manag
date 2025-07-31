// src/components/UserFormFields.jsx
import React from 'react';

function UserFormFields({ formData, handleChange }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Enter FirstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Enter LastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="tel"
          placeholder="Enter Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <div className="flex items-center gap-4">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select...</option>
          <option value="Active">Active</option>
          <option value="InActive">InActive</option>
        </select>

        <input
          type="file"
          name="profile"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Enter Your Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
    </>
  );
}

export default UserFormFields;
