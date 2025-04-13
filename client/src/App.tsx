import { useState, useEffect } from "react";
import "./App.css";
import AttendanceManager from "./Components/AttendanceManager";
import Calendar from "./Components/Calendar";
import EventForm from "./Components/EventForm";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import CheckIn from "./Components/Login/CheckIn";
import ProfDashboard from "./Components/dashboard/ProfDashboard";
import TADashboard from "./Components/dashboard/TADashboard";
import Loading from "./Components/Loading";

import { Session, DayString, TimeString, TAInfo } from "./sessionType";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export interface User {
  user: { id: string; email: string };
  role: "Prof" | "TA" | "User";
}

function App() {
  const [rawSessions, setRawSessions] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //const [events, setEvents] = useState<Event[]>(sessions);

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

  // Fetch User data
  useEffect(() => {
    fetch("http://localhost:4000/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.role) {
          setUser({ user: data.user, role: data.role });
          console.log(data.role);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Fetch sessions from database
  const fetchJson = () => {
    fetch("http://localhost:4000/api/sessions")
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
        <Route path="add" element={<EventForm />} />

        <Route path="signup" element={<SignUp />} />
        <Route path="LOADTEMP" element={<Loading />} />

        <Route path="login" element={<Login setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={
            loading ? (
              <div>
                <Loading />
              </div>
            ) : user?.role === "Prof" ? (
              <ProfDashboard />
            ) : user?.role === "TA" ? (
              <TADashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="checkin" element={<CheckIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
