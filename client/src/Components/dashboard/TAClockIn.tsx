import { User } from "../../App";
import Clock from "./Clock";
import Loading from "../Loading";
import "../../styles/ClockIn.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";

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

interface TAClockInProps {
  user: User;
  userSessions: UserSession[];
}
const TAClockIn: React.FC<TAClockInProps> = ({ user, userSessions }) => {
  const session = userSessions[0];
  const [msg, setMsg] = useState("");
  const [time, setTime] = useState(moment());
  const [clocked, setClocked] = useState<"in" | "out" | "idle">("idle");
  const [loading, setLoading] = useState(true);
  const [late, setLate] = useState(false);
  const [isToday, setIsToday] = useState(true);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Changes msg based on time
  useEffect(() => {
    if (!userSessions || userSessions.length === 0) return;

    const start = session.start;
    const startTime = moment(start, "HH:mm");

    const isSessionToday = session.days.includes(moment().format("dddd"));
    setIsToday(true);

    if (!isSessionToday) {
      setMsg("No Tutoring Session Today");
    } else if (
      startTime.diff(time) > 0 &&
      startTime.diff(time, "minutes") <= 30
    ) {
      // Early
      setMsg(`You're ${startTime.diff(time, "minutes")} minutes early!`);
    } else if (startTime.diff(time) > 0) {
      setMsg("You're too early!");
    } else if (startTime.diff(time) < 0) {
      setMsg(
        `You're ${Math.abs(startTime.diff(time, "minutes"))} minutes late.`,
      );
      setLate(true);
    }
  }, [userSessions, time]);

  useEffect(() => {
    if (user) {
      const getTaAttendanceStatus = async () => {
        try {
          const params = new URLSearchParams({
            TaId: user.user.id,
          });
          const res = await fetch(
            `http://localhost:4000/api/TaAttendanceStatus?${params.toString()}`,
          );

          if (!res.ok) throw new Error("failed to fetch status");

          const data = await res.json();

          setClocked(data.clockStatus);
          console.log("clockStatus:", data.clockStatus);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      getTaAttendanceStatus();
    }
  }, [user]);

  const clockIn = async () => {
    const payload = { TaId: user.user.id };
    try {
      const res = await fetch("http://localhost:4000/api/TaClockIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      alert("Error: " + err.message);
    }

    setClocked("in");
  };

  const clockOut = async () => {
    const payload = { TaId: user.user.id };
    try {
      const res = await fetch("http://localhost:4000/api/TaClockOut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setClocked("out");
  };

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
      {loading ? (
        <Loading />
      ) : (
        <div
          className={
            clocked === "in"
              ? "clockIn clocked"
              : late
                ? "clockIn late"
                : clocked === "out"
                  ? "clockIn out"
                  : "clockIn"
          }
        >
          <button className="clockInLogout" onClick={() => handleLogout()}>
            Log out
          </button>
          <h1>TA Clock In</h1>
          {clocked === "out" ? (
            <h2>You've clocked out, have a great day!</h2>
          ) : (
            <h2>Welcome, {user.user.fname}</h2>
          )}

          {session ? (
            <>
              <h1 className="clock">
                <Clock />
              </h1>
              <h2>
                <br />
                {msg}
              </h2>
              <p>
                {`Session: ${session.title}-${session.section}:
            ${session.courseName}`}
              </p>

              {!isToday ? null : clocked === "in" ? (
                <button className="clockBtn out" onClick={() => clockOut()}>
                  Clock Out
                </button>
              ) : clocked === "idle" ? (
                <button className="clockBtn in" onClick={() => clockIn()}>
                  Clock In
                </button>
              ) : null}
            </>
          ) : (
            <p>No Session Assigned Yet.</p>
          )}
        </div>
      )}
    </>
  );
};

export default TAClockIn;
