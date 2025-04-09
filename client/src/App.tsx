import { useState, useEffect } from "react";
import "./App.css";
import AttendanceManager from "./Components/AttendanceManager";
import Calendar from "./Components/Calendar";
import EventForm from "./Components/EventForm";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import CheckIn from "./Components/Login/CheckIn";
import { Session, DayString, TimeString, TAInfo } from "./sessionType";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [rawSessions, setRawSessions] = useState([]);
  //const [events, setEvents] = useState<Event[]>(sessions);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const transformRawSession = (session: any): Session => ({
    id: session.id,
    title: session.title,
    section: session.section,
    courseName: session.courseName,
    days: session.days as DayString[], // Assert as DayString[]
    start: session.start as TimeString, // Type assertion for TimeString
    end: session.end as TimeString, // Type assertion for TimeString
    TAs: session.TAs as TAInfo[], // Convert TAInfo object to array
    location: session.location,
  });

  // Transform the JSON data

  // Fetch the JSON data from the public directory
  const fetchJson = () => {
    fetch("http://localhost:3000/sessions")
      .then((response) => response.json()) // Parse JSON
      .then((data) => {
        setRawSessions(data);
      }) // Set the state with the data
      .catch((error) => console.error("Error loading sessions:", error)); // Handle any errors
  };

  useEffect(() => {
    fetchJson();
  }, []);

  const sessions: Session[] = rawSessions.map(transformRawSession);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Calendar sessions={sessions} /> <AttendanceManager />
            </>
          }
        />
        {/* <Route path="add" element={ token? <EventForm token={token}/>: <Navigate to="/login" replace} /> */}
        <Route path="add" element={<EventForm token={token} />} />

        <Route path="signup" element={<SignUp />} />

        <Route path="login" element={<Login />} />

        <Route path="checkin" element={<CheckIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
