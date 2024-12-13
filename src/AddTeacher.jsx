import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTeacher = () => {
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";
  const [teacher, setTeacher] = useState({
    id: "",
    name: "",
    academicNumber: "",
    subjects: [],
  });
  const [subjects, setSubjects] = useState([]); // قائمة المواد
  const [selectedSubjects, setSelectedSubjects] = useState([]); // المواد المختارة
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // حالة القائمة المنسدلة

  useEffect(() => {
    // Fetch subjects from the API
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-subjects`);
        setSubjects(response.data.subjects || []); // تخزين قائمة المواد
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setMessage({
          type: "error",
          text: "Failed to fetch subjects. Please try again later.",
        });
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) => {
      if (prev.find((sub) => sub.id === subject.id)) {
        // إذا كانت المادة موجودة، أزلها
        return prev.filter((sub) => sub.id !== subject.id);
      } else {
        // إذا لم تكن المادة موجودة، أضفها
        return [...prev, subject];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSubjects.length === 0) {
        setMessage({
          type: "error",
          text: "Please select at least one subject.",
        });
        return;
      }

      const teacherData = {
        ...teacher,
        subjects: selectedSubjects.map((subject) => Number(subject.id)), // تحويل المواد إلى أرقام
      };

      const response = await axios.post(`${API_URL}/add-teacher`, teacherData);

      setMessage({
        type: "success",
        text: `Teacher added successfully! ID: ${response.data.teacher.id}`,
      });

      // إعادة تعيين الحقول
      setTeacher({
        id: "",
        name: "",
        academicNumber: "",
        subjects: [],
      });
      setSelectedSubjects([]);
    } catch (err) {
      console.error("Error adding teacher:", err);
      setMessage({
        type: "error",
        text: "Failed to add teacher. Please try again.",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Teacher</h1>
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
          <label>Teacher ID:</label>
          <input
            type="text"
            name="id"
            value={teacher.id}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={teacher.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Academic Number:</label>
          <input
            type="text"
            name="academicNumber"
            value={teacher.academicNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px", position: "relative" }}>
          <label>Subjects:</label>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedSubjects.length > 0
              ? selectedSubjects.map((sub) => sub.name).join(", ")
              : "Select subjects"}
          </div>
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                border: "1px solid #ccc",
                backgroundColor: "black",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "scroll",
              }}
            >
              {subjects.map((subject) => (
                <label
                  key={subject.id}
                  style={{
                    display: "block",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    value={subject.id}
                    checked={selectedSubjects.some(
                      (sub) => sub.id === subject.id
                    )}
                    onChange={() => handleSubjectToggle(subject)}
                    style={{ marginRight: "10px" }}
                  />
                  {subject.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Add Teacher
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
