import { useEffect, useRef, useState } from "react";
import { useRatings } from "../auth/RatingsContext";

interface Store {
  id: number;
  name: string;
  address: string;
  rating: number;
  userRatings?: number;
}

interface SearchBarProps {
  stores: Store[];
  onFilter: (filtered: Store[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ stores, onFilter }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Store[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { setFilter } = useRatings();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      onFilter(stores);
    } else {
      const matches = stores.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matches);
      onFilter(matches);
    }
  }, [query, stores, onFilter]);

  const handleSuggestionClick = (store: Store) => {
    setQuery(store.name);
    setSuggestions([]);
    onFilter(stores);
  };

  return (
    <div ref={dropdownRef} className="relative mb-4 max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search for stores..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClick={() => setOpen(!open)}
        className="w-full p-2 border rounded"
      />

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFilter("Highly Rated");
                setOpen(false);
              }}
            >
              Highly Rated
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFilter("Least Rated");
                setOpen(false);
              }}
            >
              Least Rated
            </li>
          </ul>
        </div>
      )}
      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow z-10">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(s)}
            >
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
