import React from "react";

const AdminStores = () => {
  const stores = [
    { id: 1, name: "Store A", email: "storea@mail.com", address: "Mumbai", rating: 4.2 },
    { id: 2, name: "Store B", email: "storeb@mail.com", address: "Pune", rating: 3.9 },
  ];

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
          {stores.map((store) => (
            <tr key={store.id} className="border">
              <td className="p-2">{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStores;
