import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import instance from "./api/api";
import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function StudentAnalytics(props) {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentMail, setStudentMail] = useState("");
  const [t1Mark, setT1Mark] = useState("");
  const [t2Mark, setT2Mark] = useState("");
  const [predictedT3, setPredictedT3] = useState(null);

  const { isLoggedIn } = props;

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          "http://localhost:5000/api/getUser",
          {
            params: {
              studentName,
              studentMail,
            },
          }
        );
        const { token, userData } = response.data;

        setToken(token);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };

    fetchData();
  }, [studentName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          "http://localhost:5000/api/getAllUsers"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Function to handle T3 prediction
    const predictT3 = async () => {
      try {
        const response = await instance.get("http://localhost:5000/api/predictT3", {
          params: {
            T1: t1Mark,
            T2: t2Mark,
          },
        });

        const { T3Prediction } = response.data;
        setPredictedT3(T3Prediction);
        console.log(predictedT3);
      } catch (error) {
        console.error("Error predicting T3:", error);
      }
    };

    // Trigger T3 prediction when t1Mark or t2Mark changes
    if (t1Mark !== "" && t2Mark !== "") {
      predictT3();
    }
  }, [t1Mark, t2Mark]);

  const sum = userData
    ? userData.C431_12_1 +
      userData.C431_12_2 +
      userData.C431_12_3 +
      userData.C431_12_4
    : 0;

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Course Outcome Breakup",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: userData
          ? [
              { y: (userData.C431_12_1 * 100) / sum, label: "CO1" },
              { y: (userData.C431_12_2 * 100) / sum, label: "CO2" },
              { y: (userData.C431_12_3 * 100) / sum, label: "CO3" },
              { y: (userData.C431_12_4 * 100) / sum, label: "CO4" },
            ]
          : [],
      },
    ],
  };

  const omittedColumns = [
    "_id",
    "C431_12_1",
    "C431_12_2",
    "C431_12_3",
    "C431_12_4",
    "C431_12_5",
    "A_C431_12_1",
    "A_C431_12_2",
    "A_C431_12_3",
    "A_C431_12_4",
    "A_C431_12_5",
    "password",
  ];

  const renderTable = () => {
    const filteredUserData = Object.fromEntries(
      Object.entries(userData).filter(([key]) => !omittedColumns.includes(key))
    );

    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ background: "black" }}>
            <th style={tableHeaderStyle}></th>
            <th style={tableHeaderStyle}></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(filteredUserData).map(([key, value]) => (
            <tr key={key} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tableCellStyle}>{key}</td>
              <td style={tableCellStyle}>
                {typeof value === "number" ? value : value}
              </td>
            </tr>
          ))}
          {predictedT3 !== null && (
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tableCellStyle}>Expected T3</td>
              <td style={tableCellStyle}>{predictedT3}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const tableHeaderStyle = {
    padding: "12px",
    textAlign: "left",
  };

  const tableCellStyle = {
    padding: "8px",
    textAlign: "left",
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>{userData ? ` ${userData.Name} ${userData.Batch}` : ""}</h3>
      </div>

      <div>
        <label htmlFor="userDropdown">Select a user: </label>
        <select
          style={{ padding: "2px", borderRadius: "4px" }}
          id="userDropdown"
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedUser = users[selectedIndex - 1];
            setT1Mark(selectedUser.T1);
            setT2Mark(selectedUser.T2);
            setStudentName(selectedUser.Name);
            setStudentMail(selectedUser.email);
          }}
        >
          <option value="">Select Student</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.Name}
            </option>
          ))}
        </select>
      </div>
      <br></br>
      <br></br>
      {userData && renderTable()}
      <ResponsiveContainer width="100%" height="100%">
        <CanvasJSChart options={options} />
      </ResponsiveContainer>
    </main>
  );
}

export default StudentAnalytics;
