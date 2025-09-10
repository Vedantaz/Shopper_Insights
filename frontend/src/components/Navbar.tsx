import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  let target = "/user/stores";
  if (user?.role === "OWNER") target = "/owner/stores";
  else if (user?.role === "ADMIN") target = "/admin/stores";

  let targetProfile = "/user/profile";

  let targetDashboard = "/owner/dashboard";
  if (user?.role === "ADMIN") targetDashboard = "/admin/dashboard";

  return (
    <nav className="sticky top-0 bg-blue-600 items-center text-white p-4 flex justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-white text-blue-600 font-bold">
          L
        </div>

        <div className="space-x-4">
          <Link to={targetDashboard}>Home</Link>
        </div>

        <div className="flex items-center space-x-4">
          <>
            <Link
              to={target}
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
            >
              Stores
            </Link>
            {user?.role === "USER" && (
              <Link
                to={targetProfile}
                className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
              >
                Profile
              </Link>
            )}
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
