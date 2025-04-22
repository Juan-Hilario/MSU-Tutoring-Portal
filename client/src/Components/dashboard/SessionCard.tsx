import { useState, useEffect } from "react";
interface TA {
  id: string;
  Profiles: { fname: string; lname: string };
}

interface Session {
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

interface SessionCardProps {
  session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const [studentCount, setStudentCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const params = new URLSearchParams({
          sessionId: session.id,
        });
        const res = await fetch(
          `http://localhost:4000/api/studentCount?${params.toString()}`,
        );

        if (!res.ok) throw new Error("failed to fetch student count");

        const data = await res.json();
        setStudentCount(data.count ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };
    fetchStudentCount();
  }, [session.id]);

  return (
    <>
      <div className="dashboardSession">
        <div className="dashboardSessionTop">
          <div className="sessionInfo">
            <h2>
              {session.title}-{session.section}
            </h2>
            <h3>{session.courseName}</h3>
            <h3>
              {"TA(s): "}
              {session.tas.map((ta, index) => (
                <span key={ta.id}>
                  {ta.Profiles.fname} {ta.Profiles.lname}
                  {index !== session.tas.length - 1 && ","}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              {studentCount !== null ? <>{studentCount}</> : <></>}
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
        </div>
        <div className="sessionOptions">
          <button>View Attendance Record</button>
          {/* <button>option</button>
                                <button>option</button> */}
        </div>
      </div>
    </>
  );
};

export default SessionCard;
