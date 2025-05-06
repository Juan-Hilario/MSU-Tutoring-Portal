const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

const moment = require("moment");

router.post("/api/AttendanceReportData", async (req, res) => {
  const { course, from, to } = req.body;

  try {
    // Get all semesters
    const { data: semesters, error: semestersError } = await supabase
      .from("semesters")
      .select("id, name, start_date, end_date");

    if (semestersError) throw semestersError;

    const sortedSemesters = semesters.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date),
    );

    const fromSemester =
      from === "First"
        ? sortedSemesters[0]
        : semesters.find((s) => s.name.toUpperCase() === from.toUpperCase());

    const toSemester =
      to === "Last"
        ? sortedSemesters[sortedSemesters.length - 1]
        : semesters.find((s) => s.name.toUpperCase() === to.toUpperCase());

    if (!fromSemester || !toSemester) {
      throw new Error("Invalid semester range");
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, title, semesterId, semesters(start_date, end_date)");

    if (sessionsError) throw sessionsError;

    const filteredSessions = sessions.filter((session) => {
      const sDate = new Date(session.semesters.start_date);
      const eDate = new Date(session.semesters.end_date);
      const fromDate = new Date(fromSemester.start_date);
      const toDate = new Date(toSemester.end_date);
      return sDate >= fromDate && eDate <= toDate;
    });

    // Filter by course if needed
    const matchingSessions =
      course === "All"
        ? filteredSessions
        : filteredSessions.filter((s) => s.title === course);

    const sessionIds = matchingSessions.map((s) => s.id);
    if (sessionIds.length === 0)
      return res.json({ attendance: [], summary: [] });

    // Get attendance
    const { data: attendance, error: attendanceError } = await supabase
      .from("studentAttendance")
      .select(
        `
        id,
        fname,
        lname,
        date,
        start,
        sessionId,
        sessions (
          title,
          semesters (
            name
          )
        )
      `,
      )
      .in("sessionId", sessionIds);

    if (attendanceError) throw attendanceError;

    // Format result
    const result = attendance.map((record) => ({
      name: `${record.fname} ${record.lname}`,
      date: record.date,
      time: record.start,
      course: record.sessions.title,
      semester: record.sessions.semesters.name,
    }));

    const timeSlots = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    // Generate time summary
    const timeSummaryMap = Object.fromEntries(timeSlots.map((t) => [t, 0]));

    for (const record of result) {
      const [hourStr] = record.time.split(":");
      const bucket = `${hourStr.padStart(2, "0")}:00`;
      if (timeSummaryMap.hasOwnProperty(bucket)) {
        timeSummaryMap[bucket]++;
      }
    }

    const timeSummary = timeSlots.map((slot) => ({
      time: slot,
      count: timeSummaryMap[slot],
    }));

    const allMonths = moment.months(); // ["January", "February", ..., "December"]

    // Step 2: Count attendance per month
    const monthMap = {};

    result.forEach((record) => {
      const monthLabel = moment(record.date).format("MMMM"); // Just the month name
      monthMap[monthLabel] = (monthMap[monthLabel] || 0) + 1;
    });

    // Step 3: Make a summary with all 12 months
    const monthSummary = allMonths.map((month) => ({
      month,
      count: monthMap[month] || 0,
    }));

    res.json({ attendance: result, timeSummary, monthSummary, course: course });
  } catch (error) {
    console.error("Error getting report data:", error);
    res.status(500).json({ error: "Failed to get report data" });
  }
});

module.exports = router;
