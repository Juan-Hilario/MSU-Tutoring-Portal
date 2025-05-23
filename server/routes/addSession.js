const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const moment = require("moment");

const today = moment().format("YYYY-MM-DD");

router.post("/api/add-session", async (req, res) => {
  // const token = req.cookies.access_token;
  // if (!token) return res.status(401).json({ error: "Unauthorized" });
  // const { data: tokenData, error: tokenError } =
  //   await supabase.auth.getuser(token);
  // if (tokenError) return res.status(401).json({ error: "Invalid token" });

  const { title, section, courseName, days, start, end, location, profId } =
    req.body.formData;
  const tas = req.body.tas;

  const { data: semesters, error: semesterError } = await supabase
    .from("semesters")
    .select("id")
    .lte("start_date", today)
    .gte("end_date", today);

  if (semesterError)
    return res.status(404).json({ error: "Semester not found" });

  const semesterId = semesters[0].id;

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert([
      {
        title,
        section,
        courseName,
        days,
        start,
        end,
        location,
        semesterId,
        profId,
      },
    ])
    .select();

  if (sessionError) {
    console.log("Session Adding Error:", sessionError.message);
    return res.status(400).json({ error: sessionError.message });
  }

  const updateResults = await Promise.all(
    tas.map(async (ta) => {
      const { data: updatedTA, error: taError } = await supabase
        .from("TAs")
        .update({ sessionId: session[0].id })
        .eq("id", ta.id);

      if (taError) {
        console.error(`Failed to update TA with id ${ta.id}:`, taError.message);
        return { success: false, id: ta.id, error: taError.message };
      }

      return { success: true, id: ta.id };
    }),
  );

  const failedUpdates = updateResults.filter((r) => !r.success);

  if (failedUpdates.length > 0) {
    return res.status(500).json({
      message: "Session created, but some TAs failed to update.",
      failedTAs: failedUpdates,
    });
  }

  // All updates succeeded
  res.status(201).json({ message: "Session Created and TA Column Updated" });
});

module.exports = router;
