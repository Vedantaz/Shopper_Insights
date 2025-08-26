import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axiosInstance.get("/admin/stats");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4 space-y-2">
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Stores: {stats.totalStores}</p>
        <p>Total Ratings: {stats.totalRatings}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
