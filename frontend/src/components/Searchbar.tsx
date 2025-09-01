import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      onFilter(stores); // reset list
    } else {
      const matches = stores.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matches);
      onFilter(matches); // live filter
    }
  }, [query, stores, onFilter]);

  const handleSuggestionClick = (store: Store) => {
    setQuery(store.name);
    setSuggestions([]);
    onFilter([store]); // show only selected store
  };

  return (
    // <div className="flex mb-4">
    //   <input
    //     type="text"
    //     placeholder="Search for stores..."
    //     value={query}
    //     onChange={(e) => setQuery(e.target.value)}
    //     className="flex-1 p-2 border rounded-l"
    //   />
    //   <button
    //     onClick={handleSearch}
    //     className="bg-blue-500 text-white px-4 rounded-r"
    //   >
    //     Search
    //   </button>
    // </div>

    <div className="relative mb-4 max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search for stores..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />

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
