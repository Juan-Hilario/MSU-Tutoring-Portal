const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const moment = require("moment");

const today = moment().format("YYYY-MM-DD");

router.get("/api/studentCount", async (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId parameter" });
  }

  try {
    const { count, error } = await supabase
      .from("studentAttendance")
      .select("*", { count: "exact", head: true })
      .eq("date", today)
      .eq("sessionId", sessionId);

    if (error) {
      console.error("Error Fetching Count:", error.message);
      return res.status(500).json({ error: "Failed to fetch count" });
    }

    res.json({ count });
  } catch (error) {
    console.error("Unexpected erro:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/studentAttendance", async (req, res) => {
  const { data: attendance, error: attendanceError } = await supabase
    .from("studentAttendance")
    .select("*");

  if (attendanceError)
    return res.status(500).json({ error: attendanceError.message });

  res.json(attendance);
});

module.exports = router;
