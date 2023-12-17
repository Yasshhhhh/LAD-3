import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";

function logOut() {
  localStorage.clear();
  window.location.href = "/login";
}

function Header({ OpenSidebar }) {
  return (
    <header className={`header `}>
      <div className={`menu-icon `}>
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left"></div>
      <div className="header-right">
        <button className={`logout-btn `} onClick={logOut}>
          {" "}
          Click here to logout{" "}
        </button>
      </div>
    </header>
  );
}

export default Header;
