import { User } from "../../App";
import "../../styles/Dashboard.css";

interface UserSession {
  id: string;
  title: string;
  section: string;
  courseName: string;
  days: string[];
  start: string;
  end: string;
  location: string;
}
interface ProfDashboardProps {
  user: User;
  userSessions: UserSession[];
}
const ProfDashboard: React.FC<ProfDashboardProps> = ({
  user,
  userSessions,
}) => {
  return (
    <>
      <div>
        <div className="header">
          <h1>Tutoring Portal Dashboard</h1>
          <div className="headerRight">
            Logged in as {user.user.fname} <button>Log out</button>
          </div>
        </div>
        <div className="dashboardSessions">
          {userSessions.map((session) => (
            <div className="dashboardSession">
              <h2>
                {session.title}-{session.section}
              </h2>
              <h3>{session.courseName}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfDashboard;
