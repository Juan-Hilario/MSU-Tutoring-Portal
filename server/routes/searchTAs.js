const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.get("/api/search/TAs", async (req, res) => {
  const { query } = req.query;

  const { data, error } = await supabase
    .from("Profiles")
    .select("full_name")
    .eq("role", "TA")
    .ilike("full_name", `%${query}%`);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
