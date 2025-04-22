import { User } from "../../App";
import "../../styles/Dashboard.css";
import SessionCard from "./SessionCard";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";

interface TA {
  id: string;
  Profiles: { fname: string; lname: string };
}

interface UserSession {
  id: string;
  title: string;
  section: string;
  courseName: string;
  days: string[];
  start: string;
  end: string;
  location: string;
  tas: TA[];
}

interface ProfDashboardProps {
  user: User;
  userSessions: UserSession[];
}

const ProfDashboard: React.FC<ProfDashboardProps> = ({
  user,
  userSessions,
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to logout");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <>
      <div className="dashboardContainer">
        <div className="header">
          <h2>Tutoring Portal Dashboard</h2>
          <div className="headerRight">
            Logged in as {user.user.fname}{" "}
            <button onClick={() => handleLogout()}>Log out</button>
          </div>
        </div>

        <div className="dashboardSessions">
          {userSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}

          {/* Add Session Button */}
          <div>
            <button onClick={() => navigate("/add")}>Add Session</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfDashboard;
