import { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import BatchAnalytics from "./BatchAnalytics";
import StudentAnalyticsPage from "./StudentAnalytics";
import MockLogin from "./Login/MockLogin";

function App() {
  const [currPath, setCurrPath] = useState(window.location.pathname);

  useEffect(() => {
    setCurrPath(window.location.pathname);
  }, []);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const isLoggedIn = localStorage.getItem("token");
  // const isLoggedIn = true;

  return (
    <Router>
      <div className="grid-container">
        {currPath !== "/login" && [
          <Header OpenSidebar={OpenSidebar} />,
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
          />,
        ]}

        <Routes>
          <Route exact path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route
            exact
            path="/batch"
            element={<BatchAnalytics isLoggedIn={isLoggedIn} />}
          />
          <Route
            exact
            path="/students"
            element={<StudentAnalyticsPage isLoggedIn={isLoggedIn} />}
          />
          <Route exact path="/login" element={<MockLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
