import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    name: string;
  };
  rating?: number;
}

const AdminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axiosInstance.get("/stores/get-all-stores");
        setStores(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching stores", error);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Stores</h2>
      <table className="table-auto w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr key={store.id} className="border">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.email}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.rating ? store.rating : "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No stores found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStores;
