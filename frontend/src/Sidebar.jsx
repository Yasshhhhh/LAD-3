import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsFileBarGraphFill,
} from "react-icons/bs";
import { MdAutoGraph, MdDashboard } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? `sidebar-responsive ` : ""}
    >
      <div className={``}>
        <div className="sidebar-title">
          <div className="sidebar-brand">
            {" "}
            <MdDashboard className="icon" /> LAD
          </div>
          <span className="icon close_icon" onClick={OpenSidebar}>
            X
          </span>
        </div>

        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link
              to="/"
              style={{ textDecoration: "none", color: "#yourColor" }}
            >
              <GoGraph className="icon" /> Overview
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link
              to="/batch"
              style={{ textDecoration: "none", color: "#yourColor" }}
            >
              <BsFileBarGraphFill className="icon" /> Batch Analytics
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link
              to="/students"
              style={{ textDecoration: "none", color: "#yourColor" }}
            >
              <MdAutoGraph className="icon" /> Student Analytics
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
