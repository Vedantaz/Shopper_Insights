import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/">Home</Link>
        {user?.role === "ADMIN" && <Link to="/admin/dashboard">Admin</Link>}
        {user?.role === "OWNER" && <Link to="/owner/dashboard">Owner</Link>}
        {user?.role === "USER" && <Link to="/user/stores">Stores</Link>}
      </div>

      <div>
        {user ? (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
