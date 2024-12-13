import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import amiriFont from "./fonts/Amiri-Regular.ttf";

const CreateSchedules = () => {
  const API_URL = "https://schedule-api-22-3050f7fc0fc1.herokuapp.com";
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.post(`${API_URL}/create-schedules`);
        if (response.data && response.data.schedules) {
          setSchedules(response.data.schedules);
        } else {
          setSchedules([]);
          setError("No schedules found");
        }
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError("Failed to fetch schedules. Please check the API and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const downloadPDF = async () => {
    const doc = new jsPDF();

    try {
      const response = await fetch(amiriFont);
      const fontData = await response.arrayBuffer();
      const fontBase64 = btoa(
        new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      doc.addFileToVFS("Amiri-Regular.ttf", fontBase64);
      doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
      doc.setFont("Amiri");

      doc.text("جدول المواعيد", 105, 10, { align: "center" });

      const tableData = Object.entries(schedules).map(([key, schedule]) => [
        key,
        schedule.student?.name || "N/A",
        schedule.student?.academicNumber || "N/A",
        schedule.subject?.name || "N/A",
        schedule.teacher?.name || "N/A",
        schedule.classroom?.name || "N/A",
        schedule.section?.timeSlots?.join(", ") || "N/A",
      ]);

      doc.autoTable({
        head: [
          [
            "رقم الجدول",
            "الطالب",
            "الرقم الأكاديمي",
            "المادة",
            "المعلم",
            "القاعة",
            "الأوقات",
          ],
        ],
        body: tableData,
        styles: {
          font: "Amiri",
          halign: "right",
          valign: "middle",
          fontSize: 12,
        },
        headStyles: {
          fillColor: [0, 122, 204],
          textColor: "#fff",
          fontSize: 14,
          fontStyle: "bold",
        },
        startY: 20,
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 15 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 15 },
          6: { cellWidth: 60 },
        },
      });

      doc.save("جدول_المواعيد.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>جدول المواعيد</h1>
      {schedules.length === 0 ? (
        <p>No schedules available.</p>
      ) : (
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "right",
          }}
        >
          <thead>
            <tr>
              <th>رقم الجدول</th>
              <th>اسم الطالب</th>
              <th>الرقم الأكاديمي</th>
              <th>المادة</th>
              <th>المعلم</th>
              <th>الغرفة</th>
              <th>الأوقات</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedules).map(([key, schedule]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{schedule.student?.name || "N/A"}</td>
                <td>{schedule.student?.academicNumber || "N/A"}</td>
                <td>{schedule.subject?.name || "N/A"}</td>
                <td>{schedule.teacher?.name || "N/A"}</td>
                <td>{schedule.classroom?.name || "N/A"}</td>
                <td>{schedule.section?.timeSlots?.join(", ") || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        تحميل الجدول كـ PDF
      </button>
    </div>
  );
};

export default CreateSchedules;
