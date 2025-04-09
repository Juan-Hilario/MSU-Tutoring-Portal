import { useState } from "react";
import "../styles/EventForm.css";
import StartEndTimeDropdown from "./sessionForm/StartEndTimeDropdown";
import { Session, TimeString, DayString, TAInfo } from "../sessionType";
import moment from "moment";
import SearchSelect from "./Search/SearchSelect";

const today = moment().format("YYYY-MM-DD");

const getWeekDates = (offset = 0) => {
    const startOfWeek = moment()
        .startOf("week")
        .add(offset * 7, "days");
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
        const date = startOfWeek.clone().add(i, "days");
        weekDates.push({
            date: date.format("YYYY-MM-DD"),
            day: date.format("dddd"),
        });
    }
    weekDates.shift();
    weekDates.pop();
    return weekDates;
};

function EventForm({ token }) {
    // const [time, setTime] = useState("");
    // const [endTime, setEndTime] = useState("");
    // const [startTime, setStartTime] = useState("");
    // const [session, setSession] = useState<Session>();
    // const [numOfTas, setNumOfTas] = useState(1);

    const [formData, setFormData] = useState<{
        title: string;
        section: string;
        courseName: string;
        days: string[];
        start: TimeString;
        end: TimeString;
        TAs: TAInfo[];
        location: string;
    }>({
        title: "",
        section: "",
        courseName: "",
        days: [],
        start: "00:00",
        end: "00:00",
        TAs: [],
        location: "",
    });

    const transformFormData = (session: any): Session => ({
        id: session.id,
        title: session.title,
        section: session.section,
        courseName: session.courseName,
        days: session.days as DayString[], // Assert as DayString[]
        start: session.start as TimeString, // Type assertion for TimeString
        end: session.end as TimeString, // Type assertion for TimeString
        TAs: session.TAs as TAInfo[], // Convert TAInfo object to array
        location: session.location,
    });

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            days: checked ? [...prev.days, value] : prev.days.filter((day) => day !== value),
        }));
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Drop Down options
    const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
    const mins = ["00", "15", "30", "45"];
    const timeOptions = hours.flatMap((hour) => mins.map((min) => `${hour}:${min}`));

    const handleSubmit = () => {};

    const weekDates = getWeekDates(0);

    return (
        <div className="container">
            <div>
                <form className="addSessionForm" onSubmit={handleSubmit}>
                    <h2 className="title">Add Session</h2>
                    <h3 className="formSubtitle">Course Information</h3>

                    <div className="courseTitleSection">
                        <div className="formInput">
                            <label htmlFor="">Title</label>
                            <input
                                className="textInput"
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                autoComplete="off"
                                name="title"
                                type="text"
                                placeholder="eg. CSIT431"
                                maxLength={10}
                                required
                            ></input>
                        </div>
                        <div
                            style={{
                                height: "50%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            -
                        </div>
                        <div className="formInput">
                            <label htmlFor="section">Section</label>
                            <input
                                className="textInput"
                                onChange={(e) => handleInputChange("section", e.target.value)}
                                autoComplete="off"
                                name="section"
                                type="text"
                                size={5}
                                maxLength={3}
                                required
                            ></input>
                        </div>
                    </div>

                    <div className="formInput">
                        <label htmlFor="courseName">Course Name</label>
                        <input
                            className="textInput"
                            onChange={(e) => handleInputChange("courseName", e.target.value)}
                            autoComplete="off"
                            name="courseName"
                            type="text"
                            placeholder="eg. Database Systems"
                            required
                        ></input>
                    </div>

                    <fieldset className="formInput selectDays">
                        <label htmlFor="">Select Days</label>
                        <div className="daysOptions">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                                <div key={day} className="checkboxContainer" id={day}>
                                    <input
                                        name="days"
                                        type="checkbox"
                                        value={day}
                                        onChange={handleCheckboxChange}
                                        required
                                    ></input>
                                    <span className="checkmark"></span>
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    <div className="selectTimes">
                        <StartEndTimeDropdown
                            times={timeOptions}
                            name1="start"
                            name2="end"
                            label1="Start Time"
                            label2="End Time"
                            formHandleChange={handleInputChange}
                        />
                    </div>

                    <div className="formInput">
                        <label htmlFor="location">Location</label>
                        <input
                            className="textInput"
                            autoComplete="off"
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            name="location"
                            type="text"
                            placeholder="eg. CCIS 324"
                            required
                        ></input>
                    </div>

                    <h3 className="formSubtitle">TA(s)</h3>
                    {/* SOME SEARCH AND ADD COMPONENT FOR TA */}
                    <SearchSelect
                        name="ta"
                        label="Select a TA"
                        route="TAs"
                        displayField="full_name"
                    />

                    <button type="submit">Add Session</button>
                </form>
            </div>

            {/* PREVIEW CALENDAR */}
            <div className="wrapper">
                <div className="preview">PREVIEW</div>
                <div className="weekWrapper">
                    {weekDates.map((day) => (
                        <div
                            key={day.day}
                            id={day.day}
                            className={`weekRow ${day.date === today ? "highlighted" : ""} `}
                        >
                            <div className="day">
                                <div className="dayText">{day.day}</div>
                            </div>
                            {formData.days.includes(day.day) ? (
                                <div className="events">
                                    <div className="event">
                                        <h3>
                                            {formData.title}_{formData.section}
                                        </h3>
                                        <span>Course Name: {formData.courseName}</span>
                                        <span>
                                            {formData.start}-{formData.end}
                                        </span>
                                        <span> {formData.location}</span>
                                        {/* You can also display other session details like start time, end time, etc. */}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: "#434242", fontWeight: "bold" }}>
                                    No Sessions
                                </div>
                            )}{" "}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventForm;
