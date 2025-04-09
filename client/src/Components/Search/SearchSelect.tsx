import { useState } from "react";
import "../../styles/StartEndTimeDropdown.css";

interface SearchSelectProps {
  name: string;
  label: string;
  route: string;
  displayField: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  name,
  label,
  route,
  displayField,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");
  // const [pastInputs, setPastInputs] = useState([""]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [isHover, setIsHover] = useState(false);

  const handleOnChange = async (e) => {
    const value = e.target.value;

    if (value === "") {
      setIsOpen(false);
      setResults([]);
      return;
    } else {
      fetch(
        `http://localhost:3000/api/search/${route}?query=${encodeURIComponent(value)}`,
      )
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error(err));
    }
  };

  // const handleButtonClick = () = {
  //
  // }

  return (
    <>
      <div className="dropdownContainer">
        {/* Selected Result */}
        <div className="selectedSearchResultContainer">
          {selectedResults.map((sResult) => (
            <button
              className="selectedSearchResult"
              type="button"
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {sResult}
              {/* {isHover ? ( */}
              {/*   <> */}
              {/*     <button style={{ margin: 0 }} type="button"> */}
              {/*       x */}
              {/*     </button> */}
              {/*     <div className="notShown">{sResult}</div> */}
              {/*   </> */}
              {/* ) : ( */}
              {/*   <div>{sResult}</div> */}
              {/* )} */}
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
            }}
            placeholder={`Search ${label}`}
            autoComplete="off"
          />
          {/* )} */}
        </div>

        {/* Options Menu */}
        {isOpen ? (
          <div className="optionMenu">
            {results.map((result) => (
              <button
                type="button"
                onClick={() => {
                  // setInput(result[displayField]);
                  selectedResults.push(result[displayField]);
                  setIsOpen(false);
                }}
              >
                {result[displayField]}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SearchSelect;
