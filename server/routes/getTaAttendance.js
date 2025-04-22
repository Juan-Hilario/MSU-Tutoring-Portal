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

module.exports = router;
