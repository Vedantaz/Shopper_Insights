import React, { useState } from "react";
import RatingStars from "../../components/RatingStars";

const StoreList = () => {
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});
  const stores = [
    { id: 1, name: "Store A", address: "Mumbai", rating: 4.2 },
    { id: 2, name: "Store B", address: "Pune", rating: 3.8 },
  ];

  const handleRate = (storeId: number, value: number) => {
    setUserRatings((prev) => ({ ...prev, [storeId]: value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Stores</h2>
      <div className="mt-4 space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{store.name}</h3>
            <p>{store.address}</p>
            <p>Overall Rating: {store.rating}</p>
            <p>Your Rating:</p>
            <RatingStars
              rating={userRatings[store.id] || 0}
              onRate={(val) => handleRate(store.id, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
