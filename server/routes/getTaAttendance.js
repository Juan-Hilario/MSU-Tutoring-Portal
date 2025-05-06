const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const moment = require("moment");

const today = moment().format("YYYY-MM-DD");

router.get("/api/TaAttendanceStatus", async (req, res) => {
  const { TaId } = req.query;

  if (!TaId) {
    return res.status(400).json({ error: "Missing TaId parameter" });
  }

  const { data, error } = await supabase
    .from("taAttendance")
    .select("*")
    .eq("date", today)
    .eq("taId", TaId)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
  console.log("Attendance record:", data);

  if (data === null) {
    return res.json({ clockStatus: "idle" });
  } else if (data.end === null) {
    return res.json({ clockStatus: "in" });
  } else if (data.end != null) {
    return res.json({ clockStatus: "out" });
  }
});

router.get("/api/TaAttendance", async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing SessionId parameter" });
  }

  const { data: TAs, error: TAsError } = await supabase
    .from("TAs")
    .select(
      `id,
      Profiles(fname, lname),
      Attendance: taAttendance(taId, date)`,
    )
    .eq("sessionId", sessionId)
    .eq("taAttendance.date", today);

  if (TAsError) {
    console.error("Supabase error:", TAsError);
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.json(TAs);
});

module.exports = router;
