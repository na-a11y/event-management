// src/components/AddData.js
import React, { useState, useEffect } from 'react';
import { database} from '../appwrite'; // Import Appwrite setup
import './AddData.css'; // AddData styles

const AddData = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await database.createDocument(
        '670ce7790018824faa22', // Replace with Database ID
        '670ce788000d3b49762d', // Replace with Collection ID
        'unique()',
        formData
      );
      alert('Data added successfully!');
    } catch (error) {
      console.error('Error adding data:', error);
      alert('Failed to add data.');
    }
  };

  return (
    <div className="add-data-container">
      <h2>Add User Data</h2>
      <form onSubmit={handleSubmit} className="data-form">
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="dob" onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleChange} required />
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};

export default AddData;
