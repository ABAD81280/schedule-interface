import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const AddStudent = () => {
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";
  const [student, setStudent] = useState({
    id: "",
    name: "",
    academicNumber: "",
    subjects: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // هنا تعريف dropdownOpen

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        console.log("Fetching subjects...");
        const response = await axios.get(`${API_URL}/get-subjects`);
        console.log("Subjects fetched:", response.data.subjects);
        setSubjects(response.data.subjects || []);
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
    console.log(`Updating field ${name} with value ${value}`);
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting student:", student);
    try {
      const studentData = {
        ...student,
        subjects: selectedSubjects.map((sub) => sub.id), // المواد المختارة يدويًا
      };

      const response = await axios.post(`${API_URL}/add-student`, studentData);
      console.log("Student added:", response.data);

      setMessage({
        type: "success",
        text: `Student added successfully! ID: ${response.data.student.id}`,
      });

      setStudent({
        id: "",
        name: "",
        academicNumber: "",
        subjects: [],
      });
      setSelectedSubjects([]);
    } catch (err) {
      console.error("Error adding student:", err);
      setMessage({
        type: "error",
        text: "Failed to add student. Please try again.",
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);
      console.log("Parsed rows from Excel:", rows);

      const filteredStudents = rows
        .filter(
          (row) =>
            row["طريقة التدريب"] === "صباحي" && row["المرحلة"] === "دبلوم"
        )
        .map((row) => ({
          id: row["رقم السجل المدني"],
          name: row["الاسم عربي"],
          academicNumber: row["الرقم الاكاديمي"],
          subjects: [11, 12, 13, 14, 15],
        }));
      console.log("Filtered students:", filteredStudents);

      uploadBulkStudents(filteredStudents);
    };

    reader.readAsArrayBuffer(file);
  };

  const uploadBulkStudents = async (students) => {
    try {
      console.log("Uploading students one by one...");
      let successCount = 0;
      let failCount = 0;

      for (const student of students) {
        try {
          console.log("Sending student:", student); // تتبع البيانات المرسلة
          const response = await axios.post(`${API_URL}/add-student`, student);
          console.log(`Student added successfully: ${response.data.student.id}`);
          successCount++;
        } catch (error) {
          console.error(
            `Failed to add student: ${student.id}`,
            error.response?.data || error.message
          );
          failCount++;
        }
      }

      setMessage({
        type: "success",
        text: `${successCount} students added successfully! ${failCount} failed.`,
      });
    } catch (error) {
      console.error("Error uploading students:", error);
      setMessage({
        type: "error",
        text: "Failed to upload students. Please try again.",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Student</h1>
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
          <label>Student ID:</label>
          <input
            type="text"
            name="id"
            value={student.id}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Academic Number:</label>
          <input
            type="text"
            name="academicNumber"
            value={student.academicNumber}
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
                    checked={selectedSubjects.some((sub) => sub.id === subject.id)}
                    onChange={() =>
                      setSelectedSubjects((prev) =>
                        prev.find((sub) => sub.id === subject.id)
                          ? prev.filter((sub) => sub.id !== subject.id)
                          : [...prev, subject]
                      )
                    }
                    style={{ marginRight: "10px" }}
                  />
                  {subject.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Add Student
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <label>Upload Excel File:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default AddStudent;
