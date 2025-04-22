const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const moment = require("moment");
const today = moment().format("YYYY-MM-DD");

router.post("/api/TaClockIn", async (req, res) => {
  const { TaId } = req.body;

  const { data, error } = await supabase
    .from("taAttendance")
    .insert([
      {
        taId: TaId,
        start: moment().format("HH:mm:ss"),
        date: today,
      },
    ])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

router.post("/api/TaClockOut", async (req, res) => {
  const { TaId } = req.body;

  const { data, error } = await supabase
    .from("taAttendance")
    .update({ end: moment().format("HH:mm:ss") })
    .eq("taId", TaId)
    .eq("date", today)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  console.log(data);

  res.status(201).json(data);
});

module.exports = router;
