import { useState } from "react";
import "../../styles/StartEndTimeDropdown.css";
import moment from "moment";

interface StartEndTimeDropdownProps {
  times: string[];
  name1: string;
  name2: string;
  label1: string;
  label2: string;
  formHandleChange: (name: string, value: string) => void;
}
const StartEndTimeDropdown: React.FC<StartEndTimeDropdownProps> = ({
  times,
  name1,
  name2,
  label1,
  label2,
  formHandleChange,
}) => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [pastInputs1, setPastInputs1] = useState([""]);
  const [pastInputs2, setPastInputs2] = useState([""]);
  const [startTimes, setStartTimes] = useState(times);
  const [endTimes, setEndTimes] = useState(times);

  const handleChange = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setPastInputs: React.Dispatch<React.SetStateAction<string[]>>,
    pastInputs: string[],

    isStartTime: boolean = false,
  ) => {
    const newValue = input;
    setInput(newValue);

    // Keeps track of previous and current input
    setPastInputs((prev) => {
      const updated = [...prev, newValue];
      return updated.length > 2 ? updated.slice(1) : updated;
    });

    // Places ':' after two accepted characters are typed, allows characters to be deleted
    if (
      pastInputs.length >= 2 &&
      pastInputs[0].length < pastInputs[1].length &&
      newValue.length === 2
    ) {
      setInput(newValue + ":");
    }

    if (isStartTime && newValue.length === 5) {
      const filteredEndTimes = times.filter((time) => {
        return moment(time, "HH:mm").isAfter(moment(newValue, "HH:mm"));
      });
      setEndTimes(filteredEndTimes);
    } else if (newValue.length === 5) {
      const filteredEndTimes = times.filter((time) => {
        return moment(time, "HH:mm").isBefore(moment(newValue, "HH:mm"));
      });
      setStartTimes(filteredEndTimes);
    }
  };

  const handleButtonClick1 = (time: string) => {
    setInput1(time);
    handleChange(time, setInput1, setPastInputs1, pastInputs1, true);
    setIsOpen1(!isOpen1);
  };

  const handleButtonClick2 = (time: string) => {
    setInput2(time);
    handleChange(time, setInput2, setPastInputs2, pastInputs2, false);
    setIsOpen2(!isOpen2);
  };

  return (
    <>
      {/* START TIME INPUT */}
      <div className="dropdownContainer">
        <label htmlFor={name1}>{label1}</label>
        <div className="textInput">
          <input
            type="text"
            name={name1}
            required
            onChange={(e) => {
              handleChange(
                e.target.value,
                setInput1,
                setPastInputs1,
                pastInputs1,
                true,
              );
              formHandleChange(name1, e.target.value);
            }}
            value={input1}
            size={5}
            maxLength={5}
          />
          <button
            type="button"
            onClick={() => {
              setIsOpen1(!isOpen1);
            }}
          >
            {isOpen1 ? "\u25B2" : "\u25BC"}
          </button>
        </div>
        {isOpen1 ? (
          <div className="optionMenu">
            {startTimes.map((time) => (
              <button
                onClick={() => {
                  handleButtonClick1(time);
                  formHandleChange(name1, time);
                }}
              >
                {time}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div>to</div>

      {/* END TIME INPUT */}

      <div className="dropdownContainer">
        <label htmlFor={name2}>{label2}</label>
        <div className="textInput">
          <input
            type="text"
            name={name2}
            required
            onChange={(e) => {
              handleChange(
                e.target.value,
                setInput2,
                setPastInputs2,
                pastInputs2,
                false,
              );
              formHandleChange(name2, e.target.value);
            }}
            value={input2}
            size={5}
            maxLength={5}
          />
          <button type="button" onClick={() => setIsOpen2(!isOpen2)}>
            {isOpen2 ? "\u25B2" : "\u25BC"}
          </button>
        </div>
        {isOpen2 ? (
          <div className="optionMenu">
            {endTimes.map((time, index) => (
              <button
                onClick={(e) => {
                  handleButtonClick2(time);

                  formHandleChange(name2, time);
                }}
              >
                {time}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};
export default StartEndTimeDropdown;
