import { useState, useEffect } from "react";
import "./App.css";
import AttendanceManager from "./Components/AttendanceManager";
import Calendar from "./Components/Calendar";
import EventForm from "./Components/EventForm";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import CheckIn from "./Components/Login/CheckIn";
import ProfDashboard from "./Components/dashboard/ProfDashboard";
import TAClockIn from "./Components/dashboard/TAClockIn";
import Loading from "./Components/Loading";

import { Session, DayString, TimeString, TAInfo } from "./sessionType";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FaceClockInGuard from "./Components/dashboard/FaceClockInGuard";
import FaceClockIn from "./Components/dashboard/FaceClockIn";

export interface User {
    user: { fname: string; lname: string; id: string; email: string };
    role: "Prof" | "TA" | "User";
}

function App() {
    const [rawSessions, setRawSessions] = useState([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userSessions, setUserSessions] = useState([]);

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
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    // Fetch User's sessions
    useEffect(() => {
        if (user) {
            const fetchSessions = async () => {
                try {
                    const params = new URLSearchParams({
                        userId: user.user.id,
                        role: user.role,
                    });
                    const res = await fetch(
                        `http://localhost:4000/api/userSessions?${params.toString()}`
                    );

                    if (!res.ok) throw new Error("failed to fetch sessions");

                    const data = await res.json();
                    setUserSessions(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSessions();
        }
    }, [user]);

    // Fetch sessions from database
    const fetchJson = () => {
        fetch("http://localhost:4000/api/sessions")
            .then((res) => res.json()) // Parse JSON
            .then((data) => {
                setRawSessions(data);
            }) // Set the state with the data
            .catch((error) => console.error("Error loading sessions:", error)); // Handle any errors
    };

    useEffect(() => {
        fetchJson();
    }, []);

    function RedirectWithAlert() {
        useEffect(() => {
            alert("Account not Validated by Admin.");
        }, []);

        return <Navigate to="/login" />;
    }
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
                <Route
                    path="/add"
                    element={
                        loading ? (
                            <div>
                                <Loading />
                            </div>
                        ) : user?.role === "Prof" ? (
                            <EventForm user={user} />
                        ) : (
                            <>
                                <Navigate to="/login" />
                            </>
                        )
                    }
                />

                <Route path="/signup" element={<SignUp />} />

                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route
                    path="/dashboard"
                    element={
                        loading ? (
                            <div>
                                <Loading />
                            </div>
                        ) : user?.role === "Prof" ? (
                            <ProfDashboard user={user} userSessions={userSessions} />
                        ) : user?.role === "TA" ? (
                            <TAClockIn user={user} userSessions={userSessions} />
                        ) : user?.role === "User" ? (
                            <RedirectWithAlert />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route path="checkin" element={<CheckIn />} />
                <Route
                    path="/clockin_TempAuth"
                    element={
                        <FaceClockInGuard>
                            <FaceClockIn />
                        </FaceClockInGuard>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
