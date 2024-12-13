import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubjectInf = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";

  // Fetch subjects data
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-subjects`);
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Open the modal to edit subject data
  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setEditData(subject);
    setShowModal(true);
  };

  // Update subject data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/update-subject/${selectedSubject.id}`, editData);
      setMessage(response.data.message);
      setShowModal(false);
      fetchSubjects(); // Refresh subject list
    } catch (error) {
      console.error("Error updating subject:", error);
      setMessage("Failed to update subject.");
    }
  };

  // Delete a subject
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-subject/${id}`);
        if (response.data.success) {
          setMessage("Subject deleted successfully.");
          setSubjects(subjects.filter((subject) => subject.id !== id)); // Update local subject list
        } else {
          setMessage("Failed to delete subject.");
        }
      } catch (error) {
        console.error("Error deleting subject:", error);
        setMessage("Failed to delete subject.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Subjects List</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.id}</td>
              <td>{subject.name}</td>
              <td>{subject.time}</td>
              <td>
                <button onClick={() => handleEdit(subject)}>Edit</button>
                <button onClick={() => handleDelete(subject.id)}>Delete</button>
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
          <h2>Edit Subject</h2>
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
              <label>Time:</label>
              <input
                type="number"
                value={editData.time}
                onChange={(e) => setEditData({ ...editData, time: e.target.value })}
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

export default SubjectInf;
