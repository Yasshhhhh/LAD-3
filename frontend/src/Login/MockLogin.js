import React, { useState } from "react";
import instance from "../api/api";
// import "./index.scss";
import "./Login.css";

function MockLogin() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loginUser(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await instance.post(
        "http://localhost:5000/api/teacher/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.data.status === "ok") {
        localStorage.setItem("token", response.data.user);
        console.log(response);
        window.location.assign("/");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="wrapper">
        <div className="content">
          <header>
            <h1>Welcome back</h1>
          </header>
          <section>
            <form onSubmit={loginUser} className="login-form">
              <div className="input-group">
                <label className="username">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="input-group">
                <label className="password">Password</label>
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
              </div>
              <div className="input-group">
                <br></br>
                <button type="submit" disabled={loading} className="login-btn">
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            {error && <p>Error: {error}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}

export default MockLogin;
