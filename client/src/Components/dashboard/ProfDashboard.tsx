import { User } from "../../App";
import "../../styles/Dashboard.css";
import SessionCard from "./SessionCard";
import ReportForm from "./ReportForm";
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProfDashboard: React.FC<ProfDashboardProps> = ({
  user,
  userSessions,
  setUser,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<"Sessions" | "Generate Report">("Sessions");

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to logout");
      } else {
        setUser(null);
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
          <div className="headerLeft">
            <h2>Tutoring Portal Dashboard</h2>
            <button onClick={() => setPage("Sessions")}>Sessions</button>
            <button onClick={() => setPage("Generate Report")}>
              Generate Report
            </button>
          </div>

          <div className="headerRight">
            Logged in as {user.user.fname}{" "}
            <button onClick={() => handleLogout()}>Log out</button>
          </div>
        </div>
        {page === "Sessions" ? (
          <div className="dashboardSessions">
            <h2>Your Tutoring Sessions</h2>
            {userSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
            <div>
              <button onClick={() => navigate("/add")}>Add Session</button>
            </div>
          </div>
        ) : page === "Generate Report" ? (
          <div>
            <h2>Generate Report</h2>
            <ReportForm />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ProfDashboard;
