import { useEffect, useState } from "react";
import { useRatings } from "../../auth/RatingsContext";
import axiosInstance from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const OwnerDashboard = () => {
  const { ratings } = useRatings();
  const [stores, setStores] = useState<any[]>([]);
  const [ownerName, setOwnerName] = useState("Owner");
  const location = useLocation();
  const [activeBtn, setActiveBtn] = useState(location.pathname || "");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (path: string) => {
    if (location.pathname === path) return;
    console.log(activeBtn);
    navigate(path);
    setActiveBtn((prev) => (prev === path ? "" : path));
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axiosInstance.get(
          `/stores/${user?.id}/get-owner-stores`
        );
        setStores(res.data.data);
        const OwnerName = res.data.data[0].owner.name;
        setOwnerName(OwnerName.charAt(0).toUpperCase() + OwnerName.slice(1));
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchStores();
  }, []);

  const totalStores = stores.length;
  const totalRatings = Object.keys(ratings).length;
  const avgRating =
    totalRatings > 0
      ? (
          Object.values(ratings).reduce((acc, r) => acc + r.value, 0) /
          totalRatings
        ).toFixed(1)
      : "N/A";

  // Example chart data
  const chartData = [
    { month: "Jan", ratings: 4 },
    { month: "Feb", ratings: 5 },
    { month: "Mar", ratings: 3 },
  ];

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {ownerName}</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-white shadow rounded text-center">
            <h3 className="font-semibold">Total Stores</h3>
            <p className="text-xl">{totalStores}</p>
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <h3 className="font-semibold">Total Ratings</h3>
            <p className="text-xl">{totalRatings}</p>
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <h3 className="font-semibold">Avg Rating</h3>
            <p className="text-xl">{avgRating}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-4">Ratings Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ratings" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
