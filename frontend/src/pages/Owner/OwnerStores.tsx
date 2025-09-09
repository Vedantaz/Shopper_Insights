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
        const storeWithOwner = {
          ...newStore,
          owner: { name: user?.name },
        };
        console.log(user?.name, user);
        setStores((prev) => [...prev, storeWithOwner]);
        setEditingStore(null);
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
      <div className="flex h-16 items-center justify-end px-4 mt-4 ">
        <button
          onClick={() =>
            setEditingStore({
              name: "",
              email: "",
              address: "",
            })
          }
          className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="overflow-x-auto mx-4 mt-6">
        <table className="min-w-full border-collapse text-sm text-gray-200">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="border border-gray-700 px-4 py-2 text-left">Id</th>
              <th className="border border-gray-700 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-700 px-4 py-2 text-left">
                Address
              </th>
              <th className="border border-gray-700 px-4 py-2 text-left">
                Owner
              </th>
              <th className="border border-gray-700 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-700 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, idx) => (
              <tr
                key={store.id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } hover:bg-gray-700 transition-colors duration-200`}
              >
                <td className="border border-gray-700 px-4 py-3 text-gray-200">
                  {store.ownerId}
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-200">
                  {store.name}
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-200">
                  {store.address}
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-200">
                  {store.owner?.name}
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-200">
                  {store.email}
                </td>
                <td className="border border-gray-700 px-4 py-3 flex justify-center gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => setEditingStore(store)}
                    className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white transition-colors duration-200"
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(store?.id || 0)}
                    className="bg-red-600 hover:bg-red-500 p-2 rounded text-white transition-colors duration-200"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg w-96">
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
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Store Name"
              />

              <input
                type="email"
                value={editingStore.email}
                onChange={(e) =>
                  setEditingStore({ ...editingStore, email: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email"
              />

              <input
                type="text"
                value={editingStore.address}
                onChange={(e) =>
                  setEditingStore({ ...editingStore, address: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Address"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* {editingStore && (
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
      )} */}
    </>
  );
}
