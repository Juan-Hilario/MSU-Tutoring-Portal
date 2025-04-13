import { useState } from "react";
import "../../styles/StartEndTimeDropdown.css";

interface SearchSelectProps {
  name: string;
  label: string;
  route: string;
  displayField: string;
  multiSelect: boolean;
  onSelectChange?: (selected: { id: string; name: string }[]) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  name,
  label,
  route,
  displayField,
  multiSelect,
  onSelectChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");

  const [selectedResults, setSelectedResults] = useState<
    { id: string; name: string }[]
  >([]);

  const [isHover, setIsHover] = useState(false);

  const handleOnChange = async (e) => {
    const value = e.target.value;

    if (value === "") {
      setIsOpen(false);
      setResults([]);
      return;
    } else {
      fetch(
        `http://localhost:4000/api/search/${route}?query=${encodeURIComponent(value)}`,
      )
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error(err));
    }
  };

  const handleSelect = (result: any) => {
    const selectedTA = {
      id: result.id,
      name: result[displayField],
    };

    let updatedSelection = multiSelect
      ? [...selectedResults, selectedTA]
      : [selectedTA];

    setSelectedResults(updatedSelection);
    setInput("");
    setIsOpen(false);

    onSelectChange?.(updatedSelection);
  };
  console.log("Selected: ", selectedResults);

  return (
    <>
      <div className="dropdownContainer">
        {/* Selected Result */}
        <div className="selectedSearchResultContainer">
          {selectedResults.map((sResult) => (
            <button
              key={sResult.id}
              className="selectedSearchResult"
              type="button"
              onClick={() => {
                const updated = selectedResults.filter(
                  (item) => item.id !== sResult.id,
                );
                setSelectedResults(updated);
                onSelectChange?.(updated);
              }}
            >
              {sResult.name}
            </button>
          ))}
        </div>

        {/* Text Field */}
        <div className="loginInput">
          <label htmlFor={name}>{label}</label>
          {/* {input != "" ? ( */}
          {/*   <input */}
          {/*     type="text" */}
          {/*     name={name} */}
          {/*     onChange={(e) => { */}
          {/*       handleOnChange(e); */}
          {/*       setIsOpen(true); */}
          {/*     }} */}
          {/*     placeholder={`Search ${label}`} */}
          {/*     autoComplete="off" */}
          {/*     value={input} */}
          {/*   /> */}
          {/* ) : ( */}
          <input
            type="text"
            name={name}
            onChange={(e) => {
              handleOnChange(e);
              setIsOpen(true);
              setInput(e.target.value);
            }}
            placeholder={`Search ${label}`}
            autoComplete="off"
            value={input}
          />
          {/* )} */}
        </div>

        {/* Options Menu */}
        {isOpen && (
          <div className="optionMenu">
            {results.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(result)}
              >
                {result[displayField]}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchSelect;
