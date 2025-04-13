const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.get("/api/sessions", async (req, res) => {
  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("*");

  if (sessionsError)
    return res.status(500).json({ error: "Sessions not found" });

  res.json(sessions);
});

module.exports = router;
