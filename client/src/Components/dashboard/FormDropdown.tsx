import { useState } from "react";
import "../../styles/FormDropdown.css";

interface FormDropdownProps {
  options: string[];
  name: string;
  formHandleChange: (name: string, value: string) => void;
}

const FormDropdown: React.FC<FormDropdownProps> = ({
  options,
  name,
  formHandleChange,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="dropdownContainer">
        <div className="dropdown">
          <div className="selected">{`${selected ? selected : options[0]}`}</div>
          <button type="button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "\u25B2" : "\u25BC"}
          </button>
        </div>
        {isOpen ? (
          <div className="optionMenu">
            {options.map((option) => (
              <button
                value={option}
                type="button"
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                  formHandleChange(name, option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default FormDropdown;
