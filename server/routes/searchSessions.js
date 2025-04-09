const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.get("/api/search/sessions", async (req, res) => {
  const { query } = req.query;

  const { data, error } = await supabase
    .from("sessions")
    .select("full_course_title")
    .or(
      `title.ilike.%${query}%, full_course_title.ilike.%${query}%, courseName.ilike.%${query}%`,
    );
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
