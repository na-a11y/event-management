// src/components/ShowData.js
import React, { useState, useEffect } from 'react';
import { database } from '../appwrite'; // Import Appwrite services
import './ShowData.css'; // Import CSS for styling

const ShowData = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the row being edited
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    city: '',
  });

  // Fetch all documents from the Appwrite collection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await database.listDocuments(
          '670ce7790018824faa22', // Database ID
          '670ce788000d3b49762d'  // Collection ID
        );
        setData(response.documents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle deleting a document
  const handleDelete = async (id) => {
    try {
      await database.deleteDocument('670ce7790018824faa22', '670ce788000d3b49762d', id);
      setData(data.filter((doc) => doc.$id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  // Start editing a row by populating the form with its data
  const handleEditClick = (doc) => {
    setEditingId(doc.$id);
    setEditFormData({
      firstName: doc.firstName,
      lastName: doc.lastName,
      dob: doc.dob,
      city: doc.city,
    });
  };

  // Handle changes in the edit form inputs
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Save the edited data by updating the document in Appwrite
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await database.updateDocument(
        '670ce7790018824faa22', // Database ID
        '670ce788000d3b49762d', // Collection ID
        editingId,              // Document ID
        editFormData            // Updated data
      );
      alert('Data updated successfully!');

      // Update local state to reflect changes
      setData(data.map((doc) => (doc.$id === editingId ? { ...doc, ...editFormData } : doc)));

      // Clear edit state
      setEditingId(null);
      setEditFormData({ firstName: '', lastName: '', dob: '', city: '' });
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update data.');
    }
  };

  return (
    <div className="show-data-container">
      <h2>User Data</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOB</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doc) => (
            <tr key={doc.$id}>
              <td>{doc.firstName}</td>
              <td>{doc.lastName}</td>
              <td>{doc.dob}</td>
              <td>{doc.city}</td>
              <td>
                <button onClick={() => handleEditClick(doc)}>Edit</button>
                <button onClick={() => handleDelete(doc.$id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingId && (
        <div className="edit-form-container">
          <h3>Edit Data</h3>
          <form onSubmit={handleEditSubmit} className="edit-form">
            <input
              type="text"
              name="firstName"
              value={editFormData.firstName}
              onChange={handleEditChange}
              required
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={editFormData.lastName}
              onChange={handleEditChange}
              required
              placeholder="Last Name"
            />
            <input
              type="date"
              name="dob"
              value={editFormData.dob}
              onChange={handleEditChange}
              required
            />
            <input
              type="text"
              name="city"
              value={editFormData.city}
              onChange={handleEditChange}
              required
              placeholder="City"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShowData;
