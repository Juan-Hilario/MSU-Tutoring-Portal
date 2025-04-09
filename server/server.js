const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const cors = require("cors");
const moment = require("moment");
const express = require("express");
const supabase = require("./supabaseClient");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

authRoutes = require("./routes/auth");
app.use("/", authRoutes);

searchSessions = require("./routes/searchSessions");
app.use("/", searchSessions);

searchTAs = require("./routes/searchTAs");
app.use("/", searchTAs);

const dataFolder = path.join(__dirname, "data");

// GET request for attendance.json
app.get("/api/taAttendance", (req, res) => {
  fs.readFile(
    path.join(dataFolder, "taAttendance.json"),
    "utf8",
    (err, data) => {
      if (err) {
        res.status(500).json({ error: "Failed to read file" });
      } else {
        res.json(JSON.parse(data));
      }
    },
  );
});

// GET request for sessions.json
app.get("/api/sessions", (req, res) => {
  fs.readFile(path.join(dataFolder, "sessions.json"), "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read file" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// GET request for tas.json
app.get("/api/tas", (req, res) => {
  fs.readFile(path.join(dataFolder, "tas.json"), "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read file" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//GET request for TAs supabaseClient.js
app.get("/tas", async (req, res) => {
  const { data, err } = await supabase.from("TAs").select("*");
  if (err) return res.status(500).json({ error: err.message });
  res.json(data);
  console.log("Fetched:", data);
});

//GET request for sessions supabaseClient.js
app.get("/sessions", async (req, res) => {
  const { data, err } = await supabase.from("sessions").select("*");
  if (err) return res.status(500).json({ error: err.message });
  res.json(data);
  console.log("Fetched:", data);
});

// Automatically adds Attendance record for the events of the day
const today = moment().format("dddd");
const date = moment().format("YYYY-MM-DD");
const sessions = async () => {
  try {
    const data = await fsp.readFile(
      path.join(dataFolder, "sessions.json"),
      "utf-8",
    );
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Add Attendance Record from Sessions array
const addAttendanceRecord = async (sessionArr) => {
  for (const session of sessionArr) {
    console.log("No record for today's sessions");
    for (const ta of session.TAs) {
      const id = (await getLastRecordId()) + 1;
      const newRecord = {
        id: id,
        sessionId: session.id,
        taId: ta.id,
        date: date,
        time: "",
        status: "Absent",
      };

      console.log("Json Data:");
      console.log(newRecord);

      let existingData = [];
      try {
        const fileData = await fsp.readFile(
          path.join(dataFolder, "taAttendance.json"),
          "utf-8",
        );
        existingData = JSON.parse(fileData);
      } catch (err) {
        if (err.code != "ENOENT") throw err;
      }
      existingData.push(newRecord);

      await fsp.writeFile(
        path.join(dataFolder, "taAttendance.json"),
        JSON.stringify(existingData, null, 2),
        "utf-8",
      );
    }
  }
};

const attendanceRecords = async () => {
  try {
    const data = await fsp.readFile(
      path.join(dataFolder, "taAttendance.json"),
      "utf-8",
    );
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getLastRecordId = async () => {
  try {
    const data = await fsp.readFile(
      path.join(dataFolder, "taAttendance.json"),
      "utf-8",
    );
    const jsonData = JSON.parse(data);
    return jsonData[jsonData.length - 1].id;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

(async () => {
  const sessionsArr = await sessions();

  const todaysSessionsArr = sessionsArr.filter((session) =>
    session.days.includes(today),
  );

  console.log(`Today's Sessions: ${todaysSessionsArr}`);

  const attendanceRecordsArr = await attendanceRecords();
  const todaysAttendanceRecordsArr = attendanceRecordsArr.filter((record) =>
    record.date.includes(date),
  );

  console.log(`Today's Records: ${todaysAttendanceRecordsArr}`);
  // handles 4 cases: If there are no sessions, if there are no records for that day, if there are records but none for some session today, and if all records for today are added
  if (todaysSessionsArr.length != 0) {
    let missingSessionRecords = todaysSessionsArr.filter(
      (session) =>
        !todaysAttendanceRecordsArr.some(
          (record) => record.sessionId === session.id,
        ),
    );
    console.log("Missing Sessions:");
    console.log(missingSessionRecords);

    await addAttendanceRecord(missingSessionRecords);
  } else if (todaysSessionsArr.length === 0)
    console.log("There are no sessions today");
  else if (todaysSessionsArr.length === todaysAttendanceRecordsArr.length)
    console.log("All sessions have records");
})();

app.get("/", (req, res) => {
  res.send("This is the backend");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
