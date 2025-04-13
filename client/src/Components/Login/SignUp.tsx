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
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">First Name</label>
          <input type="text" name="fname" onChange={handleChange} />

          <label htmlFor="lname">Last Name</label>
          <input type="text" name="lname" onChange={handleChange} />

          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" onChange={handleChange} />

          <button type="submit">Sign up</button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
