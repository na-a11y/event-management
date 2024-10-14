import React, { useState } from 'react';
import { database } from '../appwrite'; // Import Appwrite setup
import './AddData.css'; // AddData styles

const AddData = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventOrganizer: '',
    eventDate: '',
    eventDescription: '',
    eventStartTime: '',
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
      alert('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event.');
    }
  };

  return (
    <div className="add-data-container">
      <br></br>
      <br></br>
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit} className="data-form">
        <input
          type="text"
          name="eventName"
          placeholder="Event Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="eventOrganizer"
          placeholder="Event Organizer"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="eventDate"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="eventDescription"
          placeholder="Event Description"
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="eventStartTime"
          onChange={handleChange}
          required
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddData;