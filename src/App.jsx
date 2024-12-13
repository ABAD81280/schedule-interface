import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddStudent from "./AddStudant.jsx"; // صفحة إضافة طالب
import AddSubject from "./AddSubject.jsx"; // صفحة إضافة مادة
import AddTeacher from "./AddTeacher.jsx"; // صفحة إضافة معلم
import CreateSchedules from "./CreateSchedules.jsx";
import AddClassroom from "./AddClassroom.jsx";
import StudantInf from "./StudantInf.jsx"
import TeacherInf from "./TeacherInf.jsx"
import SubjectInf from "./SubjectInf.jsx"
import ClassroomInf from "./ClassroomInf.jsx"
const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        {/* قائمة الروابط للتنقل بين الصفحات */}
        <nav style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1e272e",
          padding: "10px 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}>
          <ul
            style={{
              listStyleType: "none",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              { path: "/", label: "Home" },
              { path: "/add-teacher", label: "Add Teacher" },
              { path: "/add-student", label: "Add Student" },
              { path: "/add-subject", label: "Add Subject" },
              { path: "/create-schedules", label: "Create Schedules" },
              { path: "/add-classroom", label: "Add Classroom" },
              { path: "/studant-inf", label: "Studant Inf" },
              { path: "/teacher-inf", label: "Teacher Inf" },
              { path: "/subject-inf", label: "Subject Inf" },
              { path: "/classroom-inf", label: "Classroom Inf" },
            ].map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  style={{
                    textDecoration: "none",
                    padding: "10px 20px",
                    backgroundColor: "#22333b",
                    color: "white",
                    borderRadius: "5px",
                    display: "inline-block",
                    textAlign: "center",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#345b63")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#22333b")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* تعريف المسارات (Routes) */}
        <div style={{
          maxWidth: "1200px",
          margin: "100px auto 0", // إضافة مساحة بسبب القائمة الثابتة
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          backgroundColor: "#2f3e46",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 150px)", // ضمان أن تكون البطاقة في المنتصف
        }}>
          <Routes>
            <Route path="/" element={<h1 style={{ textAlign: "center" }}>Welcome to the App</h1>} />
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
