import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import instance from "./api/api";
import BoxPlot from "./BoxPlot";
import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Home(props) {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentMail, setStudentMail] = useState("");
  const sum = userData
    ? userData.C431_12_1 +
      userData.C431_12_2 +
      userData.C431_12_3 +
      userData.C431_12_4
    : 0;
  const { isLoggedIn } = props;

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, []);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        // alert(studentName)
        // alert(studentMail)
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
        // console.log(userData);
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
        // console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);
  // console.log(users);

  var obj3;

  if (userData) {
    obj3 = [
      {
        name: "T1",
        marks: userData.T1,
        attendance: getRandomAttendance(),
      },
      {
        name: "T2",
        marks: userData.T2,
        attendance: getRandomAttendance(),
      },
      {
        name: "T3",
        marks: userData.T3,
        attendance: getRandomAttendance(),
      },
    ];
  }

  function getRandomAttendance() {
    return Math.floor(Math.random() * (100 - 55 + 1)) + 55;
  }

  return (
    <main className={`main-container `}>
      <div className="main-title">
        <h3>{userData ? ` ${userData.Name} ${userData.Batch}` : ""}</h3>
      </div>

      <div>
        <label htmlFor="userDropdown" className={``}>
          Select a user:{""}
        </label>
        <select
          style={{ padding: "2px", borderRadius: "4px" }}
          id="userDropdown"
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedUser = users[selectedIndex];
            // console.log(selectedUser);

            setStudentName(selectedUser.Name);
            setStudentMail(selectedUser.email);
          }}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.Name}
            </option>
          ))}
        </select>
      </div>

      <div className={`main-cards `}>
        <div className={`card `}>
          <div className="card-inner">
            <h3>T1</h3>
          </div>
          <h1>{userData ? `${userData.T1}/20` : "N/A"}</h1>
        </div>
        <div className={`card `}>
          <div className="card-inner">
            <h3>T2</h3>
          </div>
          <h1>{userData ? `${userData.T2}/20` : "N/A"}</h1>
        </div>
        <div className={`card `}>
          <div className="card-inner">
            <h3>T3</h3>
          </div>
          <h1>{userData ? `${userData.T3}/35` : "N/A"}</h1>
        </div>
        <div className={`card `}>
          <div className="card-inner">
            <h3>TA</h3>
          </div>
          <h1>{userData ? `${userData.TA}/25` : "N/A"}</h1>
        </div>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BoxPlot></BoxPlot>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <CanvasJSChart options={options} />
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <div className="line-chart">
            {userData && (
              <LineChart
                width={400}
                height={400}
                data={obj3}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  unit="%"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="marks"
                  name="Marks"
                  unit=""
                  stroke="#82ca9d"
                />
              </LineChart>
            )}
          </div>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={10} height={20} data={obj3}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="marks" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
