import React from "react";

const OwnerDashboard = () => {
  const ratings = [
    { id: 1, user: "John", rating: 4 },
    { id: 2, user: "Alice", rating: 5 },
  ];

  const avgRating =
    ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
      <p className="mt-2">Average Rating: {avgRating.toFixed(1)}</p>

      <h2 className="mt-4 font-semibold">User Ratings</h2>
      <ul className="list-disc pl-6 mt-2">
        {ratings.map((r) => (
          <li key={r.id}>
            {r.user}: {r.rating} ★
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerDashboard;
