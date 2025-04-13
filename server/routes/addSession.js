const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/api/add-session", async (req, res) => {
  // const token = req.cookies.access_token;
  // if (!token) return res.status(401).json({ error: "Unauthorized" });
  // const { data: tokenData, error: tokenError } =
  //   await supabase.auth.getuser(token);
  // if (tokenError) return res.status(401).json({ error: "Invalid token" });

  const { title, section, courseName, days, start, end, location } =
    req.body.formData;
  const tas = req.body.tas;

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
      },
    ])
    .select();

  if (sessionError) {
    console.log("Session Adding Error:", sessionError.message);
    return res.status(400).json({ error: sessionError.message });
  }

  // const sessionId = session[0]?.id;
  // if (!sessionId) {
  //   return res.status(500).json({ error: "Failed to retrieve session ID" });
  // }

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
