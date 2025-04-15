import { useState, useEffect } from "react";
import { Session } from "../sessionType";
import { Attendance } from "../taAttendanceType";
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

interface CalendarProps {
  sessions: Session[];
}

const Calendar: React.FC<CalendarProps> = ({ sessions }) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Session | undefined>(
    undefined,
  );
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [sessionDate, setSessionDate] = useState<string>();
  const [weeksFromToday, setWeeksFromToday] = useState(0);

  // fetches TA attendance data from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/taAttendance")
      .then((response) => response.json())
      .then((data) => setAttendance(data))
      .catch((error) => console.error("Error loading attendance:", error));
  }, []);

  const weekDates = getWeekDates(weeksFromToday);
  //console.log(sessions[0].days[0] === weekDates[2].day);
  console.log(sessions);

  return (
    <>
      {sessionInfo && sessionDate && (
        <div className={`infoPopup ${moreInfo === true ? "shown" : " "}`}>
          <div className="topContent">
            <h2>{sessionInfo.title}</h2>
            <button onClick={() => setMoreInfo(false)}>x</button>
          </div>
          {/* checks to see if there is sessionInfo before displaying */}
          <div className="popupContent">
            <div>{sessionInfo.id}</div>
            {sessionInfo.TAs.map((TA) => (
              <div>
                {`${TA.name} `}
                <span
                  className={`taStatus ${
                    attendance.find(
                      (record) =>
                        record.taId === TA.id && record.date === sessionDate,
                    )?.status === "Present"
                      ? "present"
                      : "absent"
                  }`}
                >
                  {attendance.find(
                    (record) =>
                      record.taId === TA.id && record.date === sessionDate,
                  )?.status === "Present"
                    ? "present"
                    : "absent"}
                </span>
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
                {sessions.filter((e) => e.days.includes(day.day)).length !=
                0 ? (
                  sessions
                    .filter((e) => e.days.includes(day.day))
                    .map((e) => (
                      <div className="events">
                        <div
                          className="event"
                          key={e.id}
                          onClick={() => {
                            setMoreInfo(true);
                            setSessionInfo(e);
                            setSessionDate(day.date);
                          }}
                        >
                          <h3>
                            {e.title}_{e.section}
                          </h3>
                          <span>Course Name: {e.courseName}</span>
                          <span>
                            {e.start}-{e.end}
                          </span>
                          <span> {e.location}</span>
                          {/* You can also display other session details like start time, end time, etc. */}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="noSessions">No Sessions</div>
                )}{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Calendar;
