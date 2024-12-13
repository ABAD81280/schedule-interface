import React, { useState,useEffect  } from "react";
import axios from "axios";

const AddClassroom = () => {
  const API_URL ="https://schedule-api-22-3050f7fc0fc1.herokuapp.com"
  const [classroom, setClassroom] = useState({
    id: "",
    name: "",
    capacity: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!classroom.id || !classroom.name || !classroom.capacity) {
        setMessage({
          type: "error",
          text: "Please fill out all fields.",
        });
        return;
      }

      const classroomData = {
        id: Number(classroom.id), // تأكد من أن الـ ID رقم
        name: classroom.name,
        capacity: Number(classroom.capacity), // السعة كرقم
      };

      const response = await axios.post(
        `${API_URL}/add-classroom`,
        classroomData
      );

      setMessage({
        type: "success",
        text: `Classroom added successfully! ID: ${response.data.classroom.id}`,
      });

      // إعادة تعيين الحقول
      setClassroom({
        id: "",
        name: "",
        capacity: "",
      });
    } catch (err) {
      console.error("Error adding classroom:", err);
      setMessage({
        type: "error",
        text: "Failed to add classroom. Please try again.",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Classroom</h1>
      {message && (
        <div
          style={{
            color: message.type === "success" ? "green" : "red",
            marginBottom: "10px",
          }}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Classroom ID:</label>
          <input
            type="text"
            name="id"
            value={classroom.id}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Classroom Name:</label>
          <input
            type="text"
            name="name"
            value={classroom.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={classroom.capacity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Add Classroom
        </button>
      </form>
    </div>
  );
};

export default AddClassroom;
