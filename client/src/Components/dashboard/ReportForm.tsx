import "../../styles/Dashboard.css";
import * as React from "react";
import FormDropdown from "./FormDropdown";
import { useState } from "react";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FormData {
  course: string;
  from: string;
  to: string;
}
function ReportForm() {
  const [formData, setFormData] = useState<FormData>({
    course: "All",
    from: "First",
    to: "Last",
  });
  const [courseOptions, setCourseOptions] = useState([
    "All",
    "CSIT379",
    "CSIT313",
  ]);
  const [fromOptions, setFromOptions] = useState([
    "First",
    "SPRING 2025",
    "FALL 2025",
  ]);
  const [toOptions, setToOptions] = useState([
    "Last",
    "SPRING 2025",
    "FALL 2025",
  ]);

  const [timeSummaryData, setTimeSummaryData] = useState<any[]>([]);
  const [monthSummaryData, setMonthSummaryData] = useState<any[]>([]);

  const [courseGenerated, setCourseGenerated] = useState<string>("");
  let mostPopular = null;
  let totalAttendance = null;
  if (timeSummaryData.length > 0) {
    mostPopular = timeSummaryData.reduce((max, current) =>
      current.count > max.count ? current : max,
    );
    totalAttendance = timeSummaryData.reduce(
      (sum, entry) => sum + entry.count,
      0,
    );
  }
  if (monthSummaryData.length > 0) {
    mostPopular = monthSummaryData.reduce((max, current) =>
      current.count > max.count ? current : max,
    );
    totalAttendance = timeSummaryData.reduce(
      (sum, entry) => sum + entry.count,
      0,
    );
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/api/AttendanceReportData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to generate report");

      const data = await response.json();
      setTimeSummaryData(data.timeSummary); // includes attendance and summary
      setMonthSummaryData(data.monthSummary);
      setCourseGenerated(data.course);
    } catch (err) {
      console.error("Error generating report:", err);
      // optionally show a message to the user
    }
  };
  console.log("Time Summary Data:", timeSummaryData);
  console.log("Month Summary Data:", monthSummaryData);

  return (
    <>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="reportFormInput">
            <label htmlFor="course"> Choose filter by Course</label>
            <FormDropdown
              options={courseOptions}
              name={"course"}
              formHandleChange={handleInputChange}
            />
          </div>

          <div className="reportFormInput">
            <label> Choose filter by Semester Range</label>
            <div className="reportSemester">
              <FormDropdown
                options={fromOptions}
                name={"from"}
                formHandleChange={handleInputChange}
              />
              <span>to</span>
              <FormDropdown
                options={toOptions}
                name={"to"}
                formHandleChange={handleInputChange}
              />
            </div>
          </div>
          <button className="reportSubmit" type="submit">
            Generate
          </button>
        </form>
        <hr />

        <div className="report">
          {timeSummaryData.length > 0 ? (
            <>
              <h3>Generated Report</h3>

              <div className="reportSection">
                <h4>Popular Student CheckIn Times</h4>
                <div className="mostPopularTimes">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={timeSummaryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          Number.isInteger(value) ? value : ""
                        }
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#d1190d"
                        activeBar={<Rectangle fill="white" stroke="black" />}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="chartInfo">
                    <p>
                      The most popular time for students to checkin for{" "}
                      <strong style={{ color: "crimson" }}>
                        {courseGenerated === "All"
                          ? `${courseGenerated} Courses`
                          : `${courseGenerated}`}
                      </strong>{" "}
                      is
                      <strong style={{ color: "crimson" }}>
                        {" "}
                        {mostPopular.time}
                      </strong>
                    </p>
                    <p>
                      <strong style={{ color: "crimson" }}>
                        {totalAttendance}
                      </strong>{" "}
                      students attended sessions for this course.
                    </p>
                  </div>
                </div>
              </div>
              <div className="reportSection">
                <h4>Student CheckIn by Month</h4>
                <div className="mostPopularTimes">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={monthSummaryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          Number.isInteger(value) ? value : ""
                        }
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#d1190d"
                        activeBar={<Rectangle fill="white" stroke="black" />}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="chartInfo">
                    <p>
                      The most popular month for students to checkin is
                      <strong style={{ color: "crimson" }}>
                        {" "}
                        {mostPopular.month}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default ReportForm;
