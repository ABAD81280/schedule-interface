import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentInf = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-students`);
      setStudents(response.data.students);
      setFilteredStudents(response.data.students); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching students:", error);
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
    const filtered = students.filter((student) =>
      student.academicNumber?.toString().includes(value)
    );
    setFilteredStudents(filtered);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditData(student);
    setSelectedSubjects(
      student.subjects?.map((subjectId) =>
        subjects.find((subject) => subject.id === subjectId)
      ) || []
    );
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedStudent = {
        ...editData,
        subjects: selectedSubjects.map((subject) => Number(subject.id)),
      };

      const response = await axios.put(
        `${API_URL}/update-student/${selectedStudent.id}`,
        updatedStudent
      );
      setMessage(response.data.message);
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      setMessage("Failed to update student.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-student/${id}`);
        if (response.data.success) {
          setMessage("Student deleted successfully.");
          setStudents(students.filter((student) => student.id !== id));
          setFilteredStudents(
            filteredStudents.filter((student) => student.id !== id)
          );
        } else {
          setMessage("Failed to delete student.");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        setMessage("Failed to delete student.");
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
      <h1>Students List</h1>
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
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.academicNumber}</td>
              <td>
                {student.subjects
                  ?.map((id) =>
                    subjects.find((subject) => subject.id === id)?.name
                  )
                  .join(", ") || "N/A"}
              </td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
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
          <h2>Edit Student</h2>
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

export default StudentInf;
