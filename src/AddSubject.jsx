import React, { useState } from "react";
import axios from "axios";

const AddSubject = () => {
  const API_URL ="https://schedule-api-22-3050f7fc0fc1.herokuapp.com"
  const [subject, setSubject] = useState({
    id: "",
    name: "",
    time: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!subject.id || !subject.name || !subject.time) {
        setMessage({
          type: "error",
          text: "Please fill out all fields.",
        });
        return;
      }

      const subjectData = {
        id: Number(subject.id), // تحويل ID إلى رقم
        name: subject.name,
        time: Number(subject.time), // عدد الساعات كرقم
      };

      const response = await axios.post(
        `${API_URL}/add-subject`,
        subjectData
      );

      setMessage({
        type: "success",
        text: `Subject added successfully! ID: ${response.data.subject.id}`,
      });

      // إعادة تعيين الحقول
      setSubject({
        id: "",
        name: "",
        time: "",
      });
    } catch (err) {
      console.error("Error adding subject:", err);
      setMessage({
        type: "error",
        text: "Failed to add subject. Please try again.",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Subject</h1>
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
          <label>Subject ID:</label>
          <input
            type="text"
            name="id"
            value={subject.id}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Subject Name:</label>
          <input
            type="text"
            name="name"
            value={subject.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Number of Hours:</label>
          <input
            type="number"
            name="time"
            value={subject.time}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Add Subject
        </button>
      </form>
    </div>
  );
};

export default AddSubject;
