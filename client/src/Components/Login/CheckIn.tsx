import SearchSelect from "../Search/SearchSelect";
import { useState } from "react";

import "../../styles/Login.css";

function CheckIn() {
  const msgsArray = [
    "Learn Something New!",
    "Practice Makes Perfect!",
    "Exam? Cook, Don't Be Cooked!",
    "Stuck? You're In the Right Place!",
  ];

  const [msg, setMsg] = useState(Math.floor(Math.random() * msgsArray.length));

  return (
    <>
      <div className="loginTop">
        <h1>Welcome to the Tutoring Portal</h1>
        <h4>{msgsArray[msg]}</h4>
      </div>
      <div className="loginContainer">
        <div className="loginSection">
          <form action="">
            <h2>Student Check In</h2>
            <div className="loginInput">
              <label htmlFor="fname">First Name</label>
              <input autoComplete="off" name="fname" type="text" />
            </div>
            <div className="loginInput">
              <label htmlFor="lname">Last Name</label>
              <input autoComplete="off" name="lname" type="text" />
            </div>
            <SearchSelect
              name="course"
              label="Course"
              route="sessions"
              displayField="full_course_title"
              multiSelect={false}
            />
            <button className="formButton" type="submit">
              Check In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CheckIn;
