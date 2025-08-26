import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4 space-y-2">
        <p>Total Users: 120</p>
        <p>Total Stores: 30</p>
        <p>Total Ratings: 450</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
