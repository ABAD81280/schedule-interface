import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddStudent from "./AddStudant.jsx";
import AddSubject from "./AddSubject.jsx";
import AddTeacher from "./AddTeacher.jsx";
import CreateSchedules from "./CreateSchedules.jsx";
import AddClassroom from "./AddClassroom.jsx";
import StudantInf from "./StudantInf.jsx";
import TeacherInf from "./TeacherInf.jsx";
import SubjectInf from "./SubjectInf.jsx";
import ClassroomInf from "./ClassroomInf.jsx";

const App = () => {
  const [activeMenu, setActiveMenu] = useState(null); // التحكم في القائمة النشطة

  const buttonStyle = (isActive) => ({
    textDecoration: "none",
    padding: "12px 25px",
    backgroundColor: isActive ? "#4caf50" : "#3a3a3a",
    color: "white",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    margin: "10px",
  });

  return (
    <Router style={{
      
    }}>
      <div style={{ padding: "20px", fontFamily: "'Roboto', sans-serif" }}>
        {/* Navigation Bar */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#2d2d2d",
            padding: "15px 0",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <li>
              <Link
                to="/"
                style={buttonStyle(false)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#4caf50")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#3a3a3a")}
              >
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === "add" ? null : "add")
                }
                style={buttonStyle(activeMenu === "add")}
              >
                Add
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === "edit" ? null : "edit")
                }
                style={buttonStyle(activeMenu === "edit")}
              >
                Edit or Delete
              </button>
            </li>
            <li>
              <Link
                to="/create-schedules"
                style={buttonStyle(false)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#4caf50")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#3a3a3a")}
              >
                Create Schedules
              </Link>
            </li>
          </ul>
        </nav>

        {/* Add Links */}
        {activeMenu === "add" && (
          <div
            style={{
              marginTop: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              backgroundColor: "#2d2d2d",
            }}
          >
            <Link to="/add-teacher" style={buttonStyle(false)}>
              Add Teacher
            </Link>
            <Link to="/add-student" style={buttonStyle(false)}>
              Add Student
            </Link>
            <Link to="/add-subject" style={buttonStyle(false)}>
              Add Subject
            </Link>
            <Link to="/add-classroom" style={buttonStyle(false)}>
              Add Classroom
            </Link>
          </div>
        )}

        {/* Edit and Delete Links */}
        {activeMenu === "edit" && (
          <div
            style={{
              marginTop: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
              backgroundColor: "#2d2d2d",
            }}
          >
            <Link to="/teacher-inf" style={buttonStyle(false)}>
              Teacher Info
            </Link>
            <Link to="/studant-inf" style={buttonStyle(false)}>
              Student Info
            </Link>
            <Link to="/subject-inf" style={buttonStyle(false)}>
              Subject Info
            </Link>
            <Link to="/classroom-inf" style={buttonStyle(false)}>
              Classroom Info
            </Link>
          </div>
        )}

        {/* Routes */}
        <div
          style={{
            maxWidth: "800px",
            margin: "150px auto", // يجعل الهوامش العلوية 150 بكسل، والهوامش الجانبية تلقائية
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#2f3e46",
            minHeight: "calc(100vh - 150px)", // الحد الأدنى للارتفاع
            display: "flex",
            justifyContent: "center", // محاذاة العناصر في الوسط أفقياً
            alignItems: "center", // محاذاة العناصر في الوسط عمودياً
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <h1 style={{ textAlign: "center", color: "#f8f9fa" }}>
                  نظام ذكي لإدارة الجداول الزمنية، الطلاب، المعلمين، والفصول بكل سهولة وفعالية!
                </h1>
              }
            />
            <Route path="/create-schedules" element={<CreateSchedules />} />
            <Route path="/add-teacher" element={<AddTeacher />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/add-subject" element={<AddSubject />} />
            <Route path="/add-classroom" element={<AddClassroom />} />
            <Route path="/studant-inf" element={<StudantInf />} />
            <Route path="/teacher-inf" element={<TeacherInf />} />
            <Route path="/subject-inf" element={<SubjectInf />} />
            <Route path="/classroom-inf" element={<ClassroomInf />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
