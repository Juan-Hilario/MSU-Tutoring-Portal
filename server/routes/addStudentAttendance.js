const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/api/add-studentAttendance", async (req, res) => {
  console.log("HERE: ", req.body);
  const { fname, lname, sessionId, start } = req.body;
  const { data, error } = await supabase.from("studentAttendance").insert([
    {
      fname,
      lname,
      sessionId,
      start,
    },
  ]);

  if (error) {
    console.error("Adding Student Attendance Error:", error.message);

    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ message: "Student Attendance Record Created" });
});

module.exports = router;
