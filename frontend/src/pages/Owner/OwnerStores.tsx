import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

interface Store {
  id?: number;
  name: string;
  email: string;
  address: string;
  ownerId?: number;
  owner?: {
    name?: string;
  };
}

export default function OwnerStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const { user } = useAuth();
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const res = await axiosInstance.post("/stores/create", form);
      const newStore = res.data.data;
      setStores((prev) => [...prev, newStore]);

      setForm({ name: "", email: "", address: "" });
    } catch (error) {
      console.error("Error catching store: ", error);
    }
  };

  useEffect(() => {
    const fetchOwnerStores = async () => {
      const res = await axiosInstance.get(
        `/stores/${user?.id}/get-owner-stores`
      );
      setStores(res.data.data);
    };
    fetchOwnerStores();
  }, []);

  const handleSaveEdit = async () => {
    if (!editingStore) return;

    try {
      if (!editingStore.id) {
        // ADD feature
        const res = await axiosInstance.post("/stores/create", {
          name: editingStore.name,
          email: editingStore.email,
          address: editingStore.address,
        });
        const newStore = res.data.data;
        setStores((prev) => [...prev, newStore]);
      } else {
        await axiosInstance.patch(`/stores/update/${editingStore.id}`, {
          editingStore,
        });

        setStores((prev) =>
          prev.map((s) => (s.id === editingStore.id ? editingStore : s))
        );
        setEditingStore(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    setStores((prev) => prev.filter((store) => store.id !== id));

    axiosInstance
      .delete(`/stores/delete/${id}`)
      .then(() => console.log("Deleted"))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <button
        onClick={() =>
          setEditingStore({
            name: "",
            email: "",
            address: "",
          })
        }
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        ➕ Add Store
      </button>

      <div className="overflow-x-auto mt-4 mx-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Id</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Owner</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => {
              return (
                <tr key={store.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {store.ownerId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {store.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {store.address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {store.owner?.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {store.email}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => setEditingStore(store)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store?.id || 0)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editingStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingStore?.id ? "Edit Store" : "Add Store"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                value={editingStore.name}
                onChange={(e) =>
                  setEditingStore({ ...editingStore, name: e.target.value })
                }
                className="border rounded px-3 py-2"
                placeholder="Store Name"
              />
              <input
                type="email"
                value={editingStore.email}
                onChange={(e) =>
                  setEditingStore({ ...editingStore, email: e.target.value })
                }
                className="border rounded px-3 py-2"
                placeholder="Email"
              />
              <input
                type="text"
                value={editingStore.address}
                onChange={(e) =>
                  setEditingStore({ ...editingStore, address: e.target.value })
                }
                className="border rounded px-3 py-2"
                placeholder="Address"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
