import { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import axiosInstance from "../../api/axios";
import SearchBar from "./Searchbar";

interface Store {
  id: number;
  name: string;
  address: string;
  rating: number;
  userRating?: number;
}

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});
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

  useEffect(() => {
    console.log("Updated userRatings:", userRatings);
  }, [userRatings]);

  const submitRating = async (storeId: number, rating: number) => {
    try {
      await axiosInstance.post(`/ratings/${storeId}/give-rating`, {
        value: rating,
      });

      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, userRating: rating } : s))
      );

      setUserRatings((prev) => ({
        ...prev,
        [storeId]: rating,
      }));
    } catch (err) {
      console.error("Failed to submit rating:", err);
    }
  };
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
                <div className="grid grid-cols-3 gap-8 flex-1">
                  <span className="font-semibold">{store.name}</span>
                  <span className="text-sm text-gray-500">{store.address}</span>
                  <span className="text-sm">
                    Overall Rating: {store.rating}
                  </span>
                </div>

                <div className="flex flex-col items-center ml-6">
                  <RatingStars
                    rating={store.userRating || 0}
                    onRate={(val) => submitRating(store.id, val)}
                  />
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
