import { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import axiosInstance from "../../api/axios";
import SearchBar from "../../components/Searchbar";
import { useRatings } from "../../auth/RatingsContext";

interface Store {
  id: number;
  name: string;
  address: string;
  rating: number;
}

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const { filter } = useRatings();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axiosInstance.get("/stores/get-all-stores");
        setStores(res.data.data);
        setFilteredStores(res.data.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };

    fetchStores();
  }, []);

  const sortedStores = [...filteredStores].sort((a, b) => {
    if (filter === "High Rated") {
      return b.rating - a.rating; // highest rating first
    }
    if (filter === "Least Rated") {
      return a.rating - b.rating; // highest rating first
    }
    return 0; // no sorting
  });

  return (
    <>
      <div className="flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-4xl p-6">
          <h2 className="text-xl font-bold mb-4 bg-black text-white text-center py-2 rounded">
            All Stores
          </h2>

          <SearchBar stores={stores} onFilter={setFilteredStores} />

          <div className="space-y-4 w-full">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="p-4 border rounded shadow bg-white flex items-center justify-between w-full"
              >
                <div className="grid grid-cols-2 gap-8 flex-1">
                  <span className="font-semibold">
                    {store.name.charAt(0).toUpperCase() + store.name.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {store.address.replace(
                      /(^\s*\d*\s*)(\w)/,
                      (_, p1, p2) => p1 + p2.toUpperCase()
                    )}
                  </span>
                </div>

                <div className="flex flex-col items-center ml-6">
                  <RatingStars storeId={store.id} readonly={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreList;
