import { User } from "../../App";
import StudentIcon from "../../assets/personIcon.svg";
import "../../styles/Dashboard.css";
import { useNavigate, Navigate } from "react-router-dom";

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
            <div className="dashboardSession">
              <div className="dashboardSessionTop">
                <div className="sessionInfo">
                  <h2>
                    {session.title}-{session.section}
                  </h2>
                  <h3>{session.courseName}</h3>
                  <h3>
                    TA(s):
                    {session.tas.map((ta) => (
                      <span>
                        {ta.Profiles.fname} {ta.Profiles.lname}
                      </span>
                    ))}
                  </h3>
                  <p>
                    <strong>Time:</strong> {session.start}-{session.end}
                  </p>
                  <p>
                    <strong>Location:</strong> {session.location}
                  </p>
                </div>
                <div className="attendanceStatus">
                  <svg
                    fill="#000000"
                    width="35px"
                    height="35px"
                    viewBox="-3.5 0 22.167 22.167"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M14.603 14.973v2.217a1.482 1.482 0 0 1 -1.478 1.478h-11.083a1.482 1.482 0 0 1 -1.478 -1.478v-2.217A3.705 3.705 0 0 1 4.258 11.278h6.65a3.705 3.705 0 0 1 3.695 3.695M3.808 6.393A3.775 3.775 0 1 1 7.583 10.17a3.775 3.775 0 0 1 -3.775 -3.775z" />
                  </svg>
                </div>
              </div>
              <div className="sessionOptions">
                <button>View Attendance Record</button>
                {/* <button>option</button>
                                <button>option</button> */}
              </div>
            </div>
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
