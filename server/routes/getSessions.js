const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const moment = require("moment");

const today = moment().format("YYYY-MM-DD");
const day = moment().format("dddd");

router.get("/api/sessions", async (req, res) => {
  const { data: semesters, error: semesterError } = await supabase
    .from("semesters")
    .select("id")
    .lte("start_date", today)
    .gte("end_date", today);

  if (semesterError)
    return res.status(404).json({ error: "Semester not found" });

  const semesterId = semesters[0].id;

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("*")
    .eq("semesterId", semesterId);

  if (sessionsError)
    return res.status(500).json({ error: "Sessions not found" });

  res.json(sessions || []);
});

router.get("/api/todaysSessions", async (req, res) => {
  const { data: semesters, error: semesterError } = await supabase
    .from("semesters")
    .select("id")
    .lte("start_date", today)
    .gte("end_date", today)
    .contains("days", [day]);

  if (semesterError)
    return res.status(404).json({ error: "Semester not found" });

  const semesterId = semesters[0].id;

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("*")
    .eq("semesterId", semesterId);

  if (sessionsError)
    return res.status(500).json({ error: "Sessions not found" });

  res.json(sessions || []);
});

router.get("/api/userSessions", async (req, res) => {
  const userId = req.query.userId;
  const role = req.query.role;

  if (role === "TA") {
    const { data: session, error: sessionError } = await supabase
      .from("TAs")
      .select("sessionId")
      .eq("id", userId)
      .single();

    if (sessionError)
      return res.status(500).json({ error: "Session not found" });

    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, title, section, courseName, days, start, end, location")
      .eq("id", session.sessionId);

    if (sessionsError)
      return res.status(500).json({ error: "Session not found" });

    console.log(sessions);
    return res.json(sessions);
  } else if (role === "Prof") {
    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, title, section, courseName, days, start, end, location")
      .eq("profId", userId);

    if (sessionsError)
      return res.status(500).json({ error: "Session not found" });

    const sessionsWithTAs = await Promise.all(
      sessions.map(async (session) => {
        const { data: tas, error: taInfoError } = await supabase
          .from("TAs")
          .select("id, Profiles(fname, lname)")
          .eq("sessionId", session.id);

        if (taInfoError) {
          console.error(
            `Failed to fetch TAs for session ${session.id}:`,
            taInfoError.message,
          );
          return { ...session, tas: [], error: taInfoError.message };
        }

        return { ...session, tas };
      }),
    );

    return res.json(sessionsWithTAs);
  }
});

module.exports = router;
