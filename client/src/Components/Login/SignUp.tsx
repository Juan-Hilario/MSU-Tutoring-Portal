import "../../styles/Login.css";
import { useState } from "react";

function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("User created! ID: " + data.userId);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <div style={{ display: "grid" }}>
        <div className="loginTop">
          <h1>Welcome to the Tutoring Portal</h1>
        </div>
        <div className="loginContainer">
          <div className="loginSection">
            <form onSubmit={handleSubmit}>
              <h2>Sign Up</h2>
              <div className="loginInput">
                <label htmlFor="fname">First Name</label>
                <input type="text" name="fname" onChange={handleChange} />
              </div>

              <div className="loginInput">
                <label htmlFor="lname">Last Name</label>
                <input type="text" name="lname" onChange={handleChange} />
              </div>

              <div className="loginInput">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" onChange={handleChange} />
              </div>

              <div className="loginInput">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>

              <button className="formButton" type="submit">
                Sign up
              </button>
            </form>
          </div>
          <div className="loginBottom">
            <h4>
              If you're a student <a href="/checkin">check in</a>{" "}
            </h4>
            <h4>
              If you already have an account <a href="/login">login</a>{" "}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
