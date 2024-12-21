import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherInf = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-teachers`);
      setTeachers(response.data.teachers);
      setFilteredTeachers(response.data.teachers); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-subjects`);
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const filtered = teachers.filter((teacher) =>
      teacher.academicNumber?.toString().includes(value)
    );
    setFilteredTeachers(filtered);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setEditData(teacher);
    setSelectedSubjects(
      teacher.subjects?.map((subjectId) =>
        subjects.find((subject) => subject.id === subjectId)
      ) || []
    );
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedTeacher = {
        ...editData,
        subjects: selectedSubjects.map((subject) => Number(subject.id)),
      };

      const response = await axios.put(
        `${API_URL}/update-teacher/${selectedTeacher.id}`,
        updatedTeacher
      );
      setMessage(response.data.message);
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error);
      setMessage("Failed to update teacher.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-teacher/${id}`);
        if (response.data.success) {
          setMessage("Teacher deleted successfully.");
          setTeachers(teachers.filter((teacher) => teacher.id !== id));
          setFilteredTeachers(
            filteredTeachers.filter((teacher) => teacher.id !== id)
          );
        } else {
          setMessage("Failed to delete teacher.");
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        setMessage("Failed to delete teacher.");
      }
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) => {
      if (prev.find((sub) => sub.id === subject.id)) {
        return prev.filter((sub) => sub.id !== subject.id);
      } else {
        return [...prev, subject];
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Teachers List</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <input
        type="text"
        placeholder="Search by Academic Number"
        value={searchValue}
        onChange={handleSearch}
        style={{
          padding: "8px",
          marginBottom: "10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Academic Number</th>
            <th>Subjects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.academicNumber}</td>
              <td>
                {teacher.subjects
                  ?.map((id) =>
                    subjects.find((subject) => subject.id === id)?.name
                  )
                  .join(", ") || "N/A"}
              </td>
              <td>
                <button onClick={() => handleEdit(teacher)}>Edit</button>
                <button onClick={() => handleDelete(teacher.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          <h2>Edit Teacher</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Academic Number:</label>
              <input
                type="text"
                value={editData.academicNumber}
                onChange={(e) =>
                  setEditData({ ...editData, academicNumber: e.target.value })
                }
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
                    backgroundColor: "#001219",
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
            <button type="submit" style={{ marginRight: "10px" }}>
              Save
            </button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherInf;