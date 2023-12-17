import React, { useState } from "react";
import "./Login.css";
import instance from "../api/api";

export default function SignInPage() {
  const [enroll, setEnroll] = useState("");
  const [password, setPass] = useState("");

  async function loginUser(e) {
    e.preventDefault();
    try {
      const response = await instance.post("/api/login", {
        enroll,
        password,
      });

      console.log(response.data);
      if (response.data.user) {
        localStorage.setItem("token", response.data.user);
        alert("Login successful");
        window.location.assign("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="text-center m-5-auto">
        <form>
          <p>
            <label> Enrollment number </label>
            <br />
            <input
              type="email"
              name="email"
              value={enroll}
              onChange={(e) => {
                setEnroll(e.target.value);
              }}
              placeholder="Enter your enrollment number"
              required
            />
          </p>
          <p>
            <label>Password</label>
            <br />
            <input
              type="password"
              value={password}
              name="password"
              onChange={(e) => {
                setPass(e.target.value);
              }}
              placeholder="Enter your password"
              required
            />
          </p>
          <p>
            <div className="btn-login" onClick={loginUser}>
              Login
            </div>
          </p>
        </form>
      </div>
    </>
  );
}
