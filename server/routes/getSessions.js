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

router.get("/api/userSessions", async (req, res) => {
  const userId = req.query.userId;
  const role = req.query.role;

  if (role === "TA") {
    const { data: sessionId, error: sessionIdError } = await supabase
      .from("TA")
      .select("sessionId")
      .eq("id", userId)
      .single();

    if (sessionIdError)
      return res.status(500).json({ error: "Session not found" });

    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, title, section, courseName, days, start, end, location")
      .eq("id", sessionId);

    if (sessionsError)
      return res.status(500).json({ error: "Session not found" });

    return res.json([sessions]);
  } else if (role === "Prof") {
    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, title, section, courseName, days, start, end, location")
      .eq("profId", userId);

    if (sessionsError)
      return res.status(500).json({ error: "Session not found" });

    return res.json(sessions);
  }
});

module.exports = router;
