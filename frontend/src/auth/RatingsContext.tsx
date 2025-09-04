// context/RatingsContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axiosInstance from "../api/axios";

type FilterType = "High Rated" | "Least Rated" | null;

interface RatingsContextType {
  ratings: Record<number, { value: number; name?: string }>; // storeId -> rating
  getRating: (storeId: number) => { value: number; name: string } | null;
  setRating: (storeId: number, rating: number) => void;
  filter: FilterType;
  setFilter: (f: FilterType) => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

export const RatingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const fetchUserRatings = async () => {
      try {
        const res = await axiosInstance.get("/ratings/get-ratings-by-user");
        // backend should return something like [{storeId: 1, value: 4}, ...]
        const map: Record<number, { value: number; name: string }> = {};
        res.data.ratingsData.forEach((r: any) => {
          map[r.storeId] = { value: r.value, name: r.store.name };
        });
        setRatings(map);
      } catch (err) {
        console.error("Failed to fetch ratings", err);
      }
    };

    fetchUserRatings();
  }, []);

  const [ratings, setRatings] = useState<
    Record<number, { value: number; name: string }>
  >({});
  const [filter, setFilter] = useState<FilterType>(null);

  const setRating = (storeId: number, value: number, name?: string) => {
    setRatings((prev) => ({
      ...prev,
      [storeId]: { value, name: name ?? prev[storeId]?.name ?? "" },
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
