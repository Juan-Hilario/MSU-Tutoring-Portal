import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import "../../styles/StartEndTimeDropdown.css";

interface Item {
  id: string;
  label: string;
}
interface Session {
  id: string;
  title: string;
  section: string;
  courseName: string;
  days: string[];
  start: string;
  end: string;
  location: string;
}

interface SearchSelectProps {
  name: string;
  label: string;
  route: string;
  labelKey: string;
  multi: boolean;
  toForm: Dispatch<SetStateAction<Item[]>> | Dispatch<SetStateAction<Session>>;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  name,
  label,
  route,
  labelKey,
  multi,
  toForm,
}) => {
  // text input
  const [searchValue, setSearchValue] = useState("");

  // The options from menu
  const [searchResults, setSearchResults] = useState<[]>([]);

  // the selected options
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  // Whether the dropdown is open
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Searches Database for query
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);

    if (query === "") {
      setDropdownOpen(false);
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/search/${route}?query=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setSearchResults(data);
      setDropdownOpen(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // When result is selected
  const handleSelectItem = (item: any) => {
    const isSession =
      "title" in item &&
      "section" in item &&
      "courseName" in item &&
      "days" in item &&
      "start" in item &&
      "end" in item;

    if (isSession) {
      (toForm as Dispatch<SetStateAction<Session>>)(item);
    } else {
      const formattedItem = { id: item.id, label: item[labelKey] };
      const newSelection = multi
        ? [...selectedItems, formattedItem]
        : [formattedItem];

      setSelectedItems(newSelection);
    }

    setSearchValue("");
    setDropdownOpen(false);
  };

  // When selected result button is clicked
  const handleRemoveItem = (id: string) => {
    if (multi) {
      const updated = selectedItems.filter((item) => item.id !== id);
      setSelectedItems(updated);
    } else {
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    const firstItem = selectedItems[0];
    if (firstItem && "label" in firstItem) {
      (toForm as Dispatch<SetStateAction<Item[]>>)(selectedItems);
    }
  }, [selectedItems]);

  return (
    <>
      <div className="dropdownContainer">
        {/* Selected Result */}
        <div className="selectedSearchResultContainer">
          {selectedItems.map((item) => (
            <button
              key={item.id}
              className="selectedSearchResult"
              type="button"
              onClick={() => handleRemoveItem(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* Text Field */}
        <>
          <div className="loginInput">
            <label htmlFor={name}>{label}</label>
            <input
              type="text"
              name={name}
              onChange={handleSearchChange}
              placeholder={`Search ${label}`}
              autoComplete="off"
              value={searchValue}
            />
          </div>
          {dropdownOpen && (
            <div className="optionMenu">
              {searchResults.length > 0 &&
                searchResults.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                  >
                    {(item as any)[labelKey]}
                  </button>
                ))}
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default SearchSelect;
