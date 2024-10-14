import React, { useState, useEffect } from 'react';
import { database } from '../appwrite'; // Import Appwrite services
import './ShowData.css'; // Import CSS for styling

const ShowData = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the event being edited
  const [editFormData, setEditFormData] = useState({
    eventName: '',
    eventOrganizer: '',
    eventDate: '',
    eventDescription: '',
    eventStartTime: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await database.listDocuments(
          '670ce7790018824faa22', // Database ID
          '670ce788000d3b49762d'  // Collection ID
        );
        setData(response.documents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await database.deleteDocument('670ce7790018824faa22', '670ce788000d3b49762d', id);
      setData(data.filter((doc) => doc.$id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditClick = (doc) => {
    setEditingId(doc.$id);
    setEditFormData({
      eventName: doc.eventName,
      eventOrganizer: doc.eventOrganizer,
      eventDate: doc.eventDate,
      eventDescription: doc.eventDescription,
      eventStartTime: doc.eventStartTime,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await database.updateDocument(
        '670ce7790018824faa22', // Database ID
        '670ce788000d3b49762d', // Collection ID
        editingId,
        editFormData
      );
      alert('Event updated successfully!');
      setData(data.map((doc) => (doc.$id === editingId ? { ...doc, ...editFormData } : doc)));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
    }
  };

  return (
    <div className="show-data-container">
      <h2>Event Data</h2>
      <div className="cards-container">
        {data.map((doc) => (
          <div key={doc.$id} className="card">
            <h3>{doc.eventName}</h3>
            <p><strong>Organizer:</strong> {doc.eventOrganizer}</p>
            <p><strong>Date:</strong> {doc.eventDate}</p>
            <p><strong>Description:</strong> {doc.eventDescription}</p>
            <p><strong>Start Time:</strong> {doc.eventStartTime}</p>
            <div className="button-container">
              <button onClick={() => handleEditClick(doc)}>Edit</button>
              <button onClick={() => handleDelete(doc.$id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="edit-form-container">
          <form onSubmit={handleEditSubmit} className="edit-form">
            <h3>Edit Event</h3>
            <input
              type="text"
              name="eventName"
              value={editFormData.eventName}
              onChange={handleEditChange}
              required
              placeholder="Event Name"
            />
            <input
              type="text"
              name="eventOrganizer"
              value={editFormData.eventOrganizer}
              onChange={handleEditChange}
              required
              placeholder="Event Organizer"
            />
            <input
              type="date"
              name="eventDate"
              value={editFormData.eventDate}
              onChange={handleEditChange}
              required
            />
            <input
              type="text"
              name="eventDescription"
              value={editFormData.eventDescription}
              onChange={handleEditChange}
              required
              placeholder="Event Description"
            />
            <input
              type="time"
              name="eventStartTime"
              value={editFormData.eventStartTime}
              onChange={handleEditChange}
              required
            />
            <div className="form-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShowData;
