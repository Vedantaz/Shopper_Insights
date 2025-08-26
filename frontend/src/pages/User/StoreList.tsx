import { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import axiosInstance from "../../api/axios";

interface Store{
  id: number;
  name: string;
  address: string;
  rating: number;
  userRating?: number;
}

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});
  // const stores = [
  //   { id: 1, name: "Store A", address: "Mumbai", rating: 4.2 },
  //   { id: 2, name: "Store B", address: "Pune", rating: 3.8 },
  // ];

useEffect(() => {
  const fetchStores = async () => {
    try {
      const res = await axiosInstance.get("/stores/get-all-stores");
      setStores(res.data.data);
      console.log("Fetched stores:", res.data.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  fetchStores(); 
}, []);

  const submitRating = async(storeId:number, rating:number)=>{
    await axiosInstance.post(`/ratings/${storeId}/give-rating`, {value:rating})
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId ? { ...s, userRating: rating } : s
      )
    );
  }

  const handleRate = (storeId: number, value: number) => {
    setUserRatings((prev) => ({ ...prev, [storeId]: value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">All Stores</h2>
      <div className="mt-4 space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{store.name}</h3>
            <p>{store.address}</p>
            <p>Overall Rating: {store.rating}</p>
            <p>Your Rating:</p>
            <RatingStars
              rating={store.userRating || 0}
              onRate={(val) => submitRating(store.id, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
