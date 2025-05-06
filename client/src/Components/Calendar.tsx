import { useState, useEffect } from "react";
import SearchSelect from "./Search/SearchSelect";

import "../styles/Calendar.css";
import moment from "moment";

const today = moment().format("YYYY-MM-DD");

const getWeekDates = (offset = 0) => {
  const startOfWeek = moment()
    .startOf("week")
    .add(offset * 7, "days");
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.clone().add(i, "days");
    weekDates.push({
      date: date.format("YYYY-MM-DD"),
      day: date.format("dddd"),
    });
  }
  weekDates.shift();
  weekDates.pop();
  return weekDates;
};

interface attendance {
  Attendance: [];
  Profiles: { fname: string; lname: string };
  id: string;
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
}

const Calendar = () => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Session | undefined>(
    undefined,
  );
  // const [TAs, setTAs] = useState([]);
  const [attendance, setAttendance] = useState<attendance[]>([]);
  const [sessionDate, setSessionDate] = useState<string>();
  const [weeksFromToday, setWeeksFromToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session>({
    id: "",
    title: "",
    section: "",
    courseName: "",
    days: [],
    start: "",
    end: "",
    location: "",
  });

  // fetches TA attendance data from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/TaAttendanceStatus")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setAttendance(data))
      .catch((error) => {
        console.error("Error loading attendance:", error);
        setAttendance([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchTAsAttendance = async (sessionId: string) => {
    const query = sessionId;
    try {
      const res = await fetch(
        `http://localhost:4000/api/TaAttendance?sessionId=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setAttendance(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const weekDates = getWeekDates(weeksFromToday);
  //console.log(sessions[0].days[0] === weekDates[2].day);
  // console.log(sessions);
  console.log(attendance);

  return (
    <>
      <>
        {sessionInfo && sessionDate && (
          <div className={`infoPopup ${moreInfo === true ? "shown" : " "}`}>
            <div className="topContent">
              <h2 style={{ marginLeft: "10px" }}>{sessionInfo.title}</h2>
              <button onClick={() => setMoreInfo(false)}>x</button>
            </div>
            <div className="popupContent">
              <h3 style={{ marginBottom: "2px" }}>TA Attendance</h3>
              {attendance.map((TA) => (
                <div>
                  <h4 style={{ marginTop: 0 }}>
                    {`${TA.Profiles.fname} ${TA.Profiles.lname}: `}
                    <span
                      className={`taStatus ${TA.Attendance.length > 0 ? "present" : "absent"}`}
                    >{`${TA.Attendance.length > 0 ? "Present" : "Absent"}`}</span>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="calendar">
          <div className="sideNav">
            {/*Calendar Controls */}
            <div className="calendarControls">
              <button onClick={() => setWeeksFromToday(0)}>Today</button>
              <button
                className="arrowButtons"
                onClick={() => setWeeksFromToday(weeksFromToday - 1)}
              >
                {"<"}
              </button>
              <button
                className="arrowButtons"
                onClick={() => setWeeksFromToday(weeksFromToday + 1)}
              >
                {">"}
              </button>
            </div>
            <SearchSelect
              name="course"
              label="Course"
              route="sessions"
              labelKey="full_course_title"
              multi={false}
              toForm={setSession}
            />
          </div>

          <div className="wrapper">
            <div className="weekWrapper">
              {weekDates.map((day) => (
                <div
                  key={day.day}
                  id={day.day}
                  className={`weekRow ${day.date === today ? "highlighted" : ""} `}
                >
                  <div className="day">
                    <div className="dayText">{day.day}</div>
                    <div className="dateText">{day.date}</div>
                  </div>
                  {session.days && session.days.length > 0 ? (
                    session.days.includes(day.day) ? (
                      <div className="session">
                        <div
                          className="sessionInfo"
                          key={session.id}
                          onClick={() => {
                            if (day.day === today) {
                              setMoreInfo(true);
                              setSessionInfo(session);
                              setSessionDate(day.date);
                              fetchTAsAttendance(session.id);
                            }
                          }}
                        >
                          <h3>
                            {session.title}_{session.section}
                          </h3>
                          <span>{session.courseName}</span>
                          <span>
                            {session.start}-{session.end}
                          </span>
                          <span> {session.location}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="noSessions"> No Session</div>
                    )
                  ) : (
                    <div className="noSessions">No Sessions</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default Calendar;
