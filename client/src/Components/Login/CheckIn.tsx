import SearchSelect from "../Search/SearchSelect";
import TimeDropdown from "../sessionForm/TimeDropdown";
import { useState } from "react";
import "../../styles/Login.css";

interface Item {
  id: string;
  label: string;
}

function CheckIn() {
  const msgsArray = [
    "Learn Something New!",
    "Practice Makes Perfect!",
    "Exam? Cook, Don't Be Cooked!",
    "Stuck? You're In the Right Place!",
  ];

  const [msg, setMsg] = useState(Math.floor(Math.random() * msgsArray.length));
  const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
  const mins = ["00", "15", "30", "45"];
  const timeOptions = hours.flatMap((hour) =>
    mins.map((min) => `${hour}:${min}`),
  );

  const [selectedSession, setSelectedSession] = useState<Item[]>([]);

  const [formData, setFormData] = useState<{
    fname: string;
    lname: string;
    sessionId: string;
    start: string | null;
  }>({ fname: "", lname: "", sessionId: "", start: null });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [formKey, setFormKey] = useState(0);
  const selectedId = selectedSession.length > 0 ? selectedSession[0].id : "";
  console.log(selectedId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSession.length === 0 || !selectedSession[0].id) {
      alert("Please select a session.");
      return;
    }

    const payload = {
      ...formData,
      sessionId: selectedSession[0].id,
    };

    try {
      const res = await fetch(
        "http://localhost:4000/api/add-studentAttendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`You are all checked in ${formData.fname}!`);
      //clears form
      setFormData({
        fname: "",
        lname: "",
        sessionId: "",
        start: null,
      });
      setFormKey((prev) => prev + 1);
      e.target.reset();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  console.log(formData);

  return (
    <>
      <div className="login">
        <div className="loginTop">
          <h1>Welcome to the Tutoring Portal</h1>
          <h4>{msgsArray[msg]}</h4>
        </div>
        <div className="loginContainer">
          <div className="loginFormSection">
            <form onSubmit={handleSubmit} action="">
              <h2>Student Check In</h2>
              <div className="loginInput">
                <label htmlFor="fname">First Name</label>
                <input
                  onChange={(e) => handleInputChange("fname", e.target.value)}
                  required
                  autoComplete="off"
                  name="fname"
                  type="text"
                />
              </div>
              <div className="loginInput">
                <label htmlFor="lname">Last Name</label>
                <input
                  onChange={(e) => handleInputChange("lname", e.target.value)}
                  required
                  autoComplete="off"
                  name="lname"
                  type="text"
                />
              </div>
              <SearchSelect
                name="course"
                label="Course"
                route="todaysSessions"
                labelKey="full_course_title"
                multi={false}
                toForm={setSelectedSession}
                key={formKey}
              />
              <div style={{ marginTop: "20px" }}>
                <TimeDropdown
                  times={timeOptions}
                  name="start"
                  label="Choose time in advance"
                  formHandleChange={handleInputChange}
                  key={formKey}
                />
              </div>
              <button className="formButton" type="submit">
                Check In
              </button>
            </form>
          </div>
        </div>
        <div className="loginBottom">
          <h4>
            If you already have an account <a href="/login">login</a>{" "}
          </h4>
          <h4>
            Need to make an account? <a href="/signup">signup</a>{" "}
          </h4>
        </div>
      </div>
    </>
  );
}

export default CheckIn;
