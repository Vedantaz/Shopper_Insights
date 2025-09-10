import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  avgRating?: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        console.log(res.data.data);
        setStats(res.data.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users/get-all-users");
        setUsers(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4 space-y-2">
        <p>Total Users: {stats.totalUsers}</p>

        <p>Total Stores: {stats.totalStores}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.address}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2">
                      {user.avgRating !== undefined
                        ? user.avgRating.toFixed(1)
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
