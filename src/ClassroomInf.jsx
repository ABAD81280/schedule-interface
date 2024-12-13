import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassroomInf = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";

  // Fetch classrooms data
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-classrooms`);
      setClassrooms(response.data.classrooms || []);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  // Open the modal to edit classroom data
  const handleEdit = (classroom) => {
    setSelectedClassroom(classroom);
    setEditData(classroom);
    setShowModal(true);
  };

  // Update classroom data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/update-classroom/${selectedClassroom.id}`, editData);
      setMessage(response.data.message);
      setShowModal(false);
      fetchClassrooms(); // Refresh classroom list
    } catch (error) {
      console.error("Error updating classroom:", error);
      setMessage("Failed to update classroom.");
    }
  };

  // Delete a classroom
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-classroom/${id}`);
        if (response.data.success) {
          setMessage("Classroom deleted successfully.");
          setClassrooms(classrooms.filter((classroom) => classroom.id !== id)); // Update local classroom list
        } else {
          setMessage("Failed to delete classroom.");
        }
      } catch (error) {
        console.error("Error deleting classroom:", error);
        setMessage("Failed to delete classroom.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Classrooms List</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.id}>
              <td>{classroom.id}</td>
              <td>{classroom.name}</td>
              <td>{classroom.capacity}</td>
              <td>
                <button onClick={() => handleEdit(classroom)}>Edit</button>
                <button onClick={() => handleDelete(classroom.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#2f3e46",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2>Edit Classroom</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Capacity:</label>
              <input
                type="number"
                value={editData.capacity}
                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                required
              />
            </div>
            <button type="submit" style={{ marginRight: "10px" }}>Save</button>
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClassroomInf;
