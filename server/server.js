const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const cors = require("cors");
const moment = require("moment");
const express = require("express");
const supabase = require("./supabaseClient");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

authRoutes = require("./routes/auth");
app.use("/", authRoutes);

getSessions = require("./routes/getSessions");
app.use("/", getSessions);

searchSessions = require("./routes/searchSessions");
app.use("/", searchSessions);

addSession = require("./routes/addSession");
app.use("/", addSession);

addStudentAttendance = require("./routes/addStudentAttendance");
app.use("/", addStudentAttendance);

getStudentAttendance = require("./routes/getStudentAttendance");
app.use("/", getStudentAttendance);

addTaAttendance = require("./routes/addTaAttendance");
app.use("/", addTaAttendance);

getTaAttendance = require("./routes/getTaAttendance");
app.use("/", getTaAttendance);

searchTAs = require("./routes/searchTAs");
app.use("/", searchTAs);

reports = require("./routes/reports");
app.use("/", reports);

// const dataFolder = path.join(__dirname, "data");

//  request for attendance.json
// app.get("/api/taAttendance", (req, res) => {
//     fs.readFile(path.join(dataFolder, "taAttendance.json"), "utf8", (err, data) => {
//         if (err) {
//             res.status(500).json({ error: "Failed to read file" });
//         } else {
//             res.json(JSON.parse(data));
//         }
//     });
// });

// GET request for tas.json
// app.get("/api/tas", (req, res) => {
//     fs.readFile(path.join(dataFolder, "tas.json"), "utf8", (err, data) => {
//         if (err) {
//             res.status(500).json({ error: "Failed to read file" });
//         } else {
//             res.json(JSON.parse(data));
//         }
//     });
// });

//GET request for TAs supabaseClient.js
app.get("/tas", async (req, res) => {
  const { data, err } = await supabase.from("TAs").select("*");
  if (err) return res.status(500).json({ error: err.message });
  res.json(data);
  console.log("Fetched:", data);
});

app.get("/", (req, res) => {
  res.send("This is the backend");
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
