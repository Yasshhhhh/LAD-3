import React, { useEffect, useState } from "react";
import instance from "./api/api";

const BatchAnalytics = (props) => {
  const [users, setUsers] = useState([]);
  const [uniqueBatches, setUniqueBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

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
    const batches = Array.from(new Set(users.map((user) => user.Batch)));
    setUniqueBatches(batches);
  }, [users]);

  const handleBatchChange = (e) => {
    const selectedBatch = e.target.value;
    setSelectedBatch(selectedBatch);
  };

  let filteredUsers = users;

  if (selectedBatch !== "all") {
    filteredUsers = users.filter((user) => user.Batch === selectedBatch);
  }

  filteredUsers = filteredUsers.sort((a, b) => b.T3 - a.T3);

  const calculateStats = (field) => {
    const batchMarks = filteredUsers.map((user) => user[field]);
    const batchAverage =
      batchMarks.reduce((sum, mark) => sum + mark, 0) / batchMarks.length;
    const sortedBatchMarks = [...batchMarks].sort((a, b) => a - b);
    const batchMedian =
      batchMarks.length % 2 === 0
        ? (sortedBatchMarks[batchMarks.length / 2 - 1] +
            sortedBatchMarks[batchMarks.length / 2]) /
          2
        : sortedBatchMarks[Math.floor(batchMarks.length / 2)];
    return { average: batchAverage.toFixed(2), median: batchMedian };
  };

  const statsT1 = calculateStats("T1");
  const statsT2 = calculateStats("T2");
  const statsT3 = calculateStats("T3");

  return (
    <div
      style={{
        margin: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
      className={``}
    >
      <h2 style={{ marginBottom: "16px" }}>Batch Analytics Page</h2>
      <label htmlFor="userDropdown" style={{ marginRight: "8px" }}>
        Select a batch:
      </label>
      <select
        id="userDropdown"
        onChange={handleBatchChange}
        value={selectedBatch}
        style={{ padding: "2px", borderRadius: "4px" }}
      >
        <option value="">Select Batch: </option>
        <option value="all">All Students</option>
        {uniqueBatches.map((batch, index) => (
          <option key={index} value={batch}>
            {batch}
          </option>
        ))}
      </select>

      {selectedBatch && (
        <div style={{ marginTop: "20px" }} className="main-batch">
          <h3 style={{ marginBottom: "12px" }}>
            Users in {selectedBatch === "all" ? "All Batches" : selectedBatch}:
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Name</th>
                <th>T1</th>
                <th>T2</th>
                <th>T3</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center", padding: "4px" }}>
                    {index + 1}
                  </td>
                  <td style={{ textAlign: "center" }}>{user.Name}</td>
                  <td style={{ textAlign: "center" }}>{user.T1}</td>
                  <td style={{ textAlign: "center" }}>{user.T2}</td>
                  <td style={{ textAlign: "center" }}>{user.T3}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Batch Statistics</h3>
            <p>Average T1 Marks: {statsT1.average}</p>
            <p>Median T1 Marks: {statsT1.median}</p>
            <p>Average T2 Marks: {statsT2.average}</p>
            <p>Median T2 Marks: {statsT2.median}</p>
            <p>Average T3 Marks: {statsT3.average}</p>
            <p>Median T3 Marks: {statsT3.median}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchAnalytics;
