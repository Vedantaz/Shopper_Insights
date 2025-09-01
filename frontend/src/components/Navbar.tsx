import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 bg-blue-600 items-center text-white p-4 flex justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-white text-blue-600 font-bold">
          L
        </div>

        <div className="space-x-4">
          <Link to="/user/stores">Home</Link>
        </div>

        {/* Right section */}

        <div className="flex items-center space-x-4">
          <>
            <Link
              to="/user/stores"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
            >
              Stores
            </Link>
            <Link
              to="/user/profile"
              className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
            >
              Profile
            </Link>
          </>
        </div>
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
