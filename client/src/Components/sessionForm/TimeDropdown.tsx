import { useState } from "react";
import "../../styles/StartEndTimeDropdown.css";
import moment from "moment";

interface StartEndTimeDropdownProps {
  times: string[];
  name: string;
  label: string;
  formHandleChange: (name: string, value: string) => void;
}
const StartEndTimeDropdown: React.FC<StartEndTimeDropdownProps> = ({
  times,
  name,
  label,

  formHandleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pastInputs, setPastInputs] = useState([""]);
  // const [times, setTimes] = useState(times);

  const handleChange = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setPastInputs: React.Dispatch<React.SetStateAction<string[]>>,
    pastInputs: string[],
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
  };

  const handleButtonClick = (time: string) => {
    setInput(time);
    handleChange(time, setInput, setPastInputs, pastInputs);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* START TIME INPUT */}
      <div className="dropdownContainer">
        <label htmlFor={name}>{label}</label>
        <div className="textInput">
          <input
            type="text"
            name={name}
            required
            onChange={(e) => {
              handleChange(
                e.target.value,
                setInput,
                setPastInputs,
                pastInputs,
                true,
              );
              formHandleChange(name, e.target.value);
            }}
            value={input}
            size={5}
            maxLength={5}
          />
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "\u25B2" : "\u25BC"}
          </button>
        </div>
        {isOpen ? (
          <div className="optionMenu">
            {times.map((time) => (
              <button
                onClick={() => {
                  handleButtonClick(time);
                  formHandleChange(name, time);
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
