const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const moment = require("moment");

const today = moment().format("YYYY-MM-DD");
const day = moment().format("dddd");

router.get("/api/search/sessions", async (req, res) => {
  const { query } = req.query;

  const { data: semesters, error: semesterError } = await supabase
    .from("semesters")
    .select("id")
    .lte("start_date", today)
    .gte("end_date", today);

  if (semesterError)
    return res.status(404).json({ error: "Semester not found" });

  const semesterId = semesters[0].id;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("semesterId", semesterId)
    .or(
      `title.ilike.%${query}%, full_course_title.ilike.%${query}%, courseName.ilike.%${query}%`,
    );
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

router.get("/api/search/todaysSessions", async (req, res) => {
  const { query } = req.query;

  const { data: semesters, error: semesterError } = await supabase
    .from("semesters")
    .select("id")
    .lte("start_date", today)
    .gte("end_date", today);

  if (semesterError)
    return res.status(500).json({ error: "Semester not found" });

  const semesterId = semesters[0].id;

  const baseQuery = supabase
    .from("sessions")
    .select("id, full_course_title")
    .eq("semesterId", semesterId)
    .ilike("days", `%${day}%`);

  const { data, error } = await baseQuery.or(
    `title.ilike.%${query}%, full_course_title.ilike.%${query}%, courseName.ilike.%${query}%`,
  );

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
