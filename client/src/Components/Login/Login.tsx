import { useState } from "react";
import "../../styles/Login.css";
import { Navigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("token", data.session.access_token);
      alert(
        "Logged in " +
          data.user.email +
          " Session_Token: " +
          data.session.access_token,
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <div style={{ display: "grid", backgroundColor: "" }}>
        <div className="loginTop">
          <h1>Welcome to the Tutoring Portal</h1>
          <h4>Supplemental Instruction</h4>
        </div>
        <div className="loginContainer">
          <div className="loginSection">
            <form onSubmit={handleSubmit} action="">
              <h2>Login</h2>
              <div className="loginInput">
                <label htmlFor="email">Email</label>
                <input
                  onChange={handleChange}
                  autoComplete="off"
                  name="email"
                  type="email"
                />
              </div>
              <div className="loginInput">
                <label htmlFor="password">Password</label>
                <input
                  onChange={handleChange}
                  autoComplete="off"
                  name="password"
                  type="password"
                />
              </div>
              <button className="formButton" type="submit">
                Log in
              </button>
            </form>
            <h3>OR</h3>
            <button className="formButton">FACE RECOGNITON</button>
          </div>
        </div>
        <div className="loginBottom">
          <h4>
            If you're a student check in <a href="/checkin">here</a>{" "}
          </h4>
        </div>
      </div>
    </>
  );
}

export default Login;
