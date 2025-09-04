// context/RatingsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type FilterType = "High Rated" | "Least Rated" | null;

interface RatingsContextType {
  ratings: Record<number, number>; // storeId -> rating
  getRating: (storeId: number) => number | null;
  setRating: (storeId: number, rating: number) => void;
  filter: FilterType;
  setFilter: (f: FilterType) => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

export const RatingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState<FilterType>(null);

  const setRating = (storeId: number, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [storeId]: rating, // update or add
    }));
  };

  const getRating = (storeId: number) => {
    return ratings[storeId] ?? null;
  };

  return (
    <RatingsContext.Provider
      value={{ ratings, getRating, setRating, filter, setFilter }}
    >
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = (): RatingsContextType => {
  const ctx = useContext(RatingsContext);
  if (!ctx) throw new Error("useRatings must be used inside RatingsProvider");
  return ctx;
};
