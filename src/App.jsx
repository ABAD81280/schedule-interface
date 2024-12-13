import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddStudent from "./AddStudant.jsx"; // صفحة إضافة طالب
import AddSubject from "./AddSubject.jsx"; // صفحة إضافة مادة
import AddTeacher from "./AddTeacher.jsx"; // صفحة إضافة معلم
import CreateSchedules from "./CreateSchedules.jsx";
import AddClassroom from "./AddClassroom.jsx";

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* قائمة الروابط للتنقل بين الصفحات */}
        <nav style={{ marginBottom: "20px" }}>
          <ul
            style={{
              listStyleType: "none",
              display: "flex",
              justifyContent: "space-around",
              padding: 0,
            }}
          >
            <li>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  padding: "10px 20px",
                  backgroundColor: "#22333b",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/add-teacher"
                style={{
                  textDecoration: "none",
                  padding: "10px 20px",
                  backgroundColor: "#22333b",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Add Teacher
              </Link>
            </li>
            <li>
              <Link
                to="/add-student"
                style={{
                  textDecoration: "none",
                  padding: "10px 20px",
                  backgroundColor: "#22333b",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Add Student
              </Link>
            </li>
            <li>
              <Link
                to="/add-subject"
                style={{
                  textDecoration: "none",
                  padding: "10px 20px",
                  backgroundColor: "#22333b",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Add Subject
              </Link>
            </li>
            <li>
              <Link
                to="/create-schedules"
                style={{
                  textDecoration: "none",
                  padding: "10px 20px",
                  backgroundColor: "#22333b",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Create Schedules
              </Link>
            </li>
            <li>
              <Link
                to="/add-classroom"
                style={{
                  textDecoration: "none",
                  padding: "10px 20px",
                  backgroundColor: "#22333b",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Add Classroom 
              </Link>
            </li>
          </ul>
        </nav>

        {/* تعريف المسارات (Routes) */}
        <Routes>
          <Route path="/" element={<h1>Welcome to the App</h1>} />
          <Route path="/create-schedules" element={<CreateSchedules />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/add-classroom" element={<AddClassroom />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
