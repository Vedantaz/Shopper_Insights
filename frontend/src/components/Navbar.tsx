import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeBtn, setActiveBtn] = useState(location.pathname || "");
  let target = "/user/stores";
  if (user?.role === "OWNER") target = "/owner/stores";
  else if (user?.role === "ADMIN") target = "/admin/stores";

  let targetProfile = "/user/profile";

  let targetDashboard = "/owner/dashboard";
  if (user?.role === "ADMIN") targetDashboard = "/admin/dashboard";

  useEffect(() => {
    setActiveBtn(location.pathname);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 bg-gray-800 items-center text-white p-4 flex justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-white text-blue-600 font-bold">
          L
        </div>

        <div className="flex items-center space-x-4">
          {user?.role !== "USER" && (
            <Link
              to={targetDashboard}
              className={` px-3 py-1 rounded ${
                activeBtn === targetDashboard
                  ? "bg-gray-600 hover:bg-indigo-800"
                  : "bg-indigo-600 hover:bg-indigo-800"
              } transition-colors duration-200`}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <>
            <Link
              to={target}
              className={` px-3 py-1 rounded ${
                activeBtn === target
                  ? "bg-gray-600 hover:bg-indigo-800"
                  : "bg-indigo-600 hover:bg-indigo-800"
              } transition-colors duration-200`}
            >
              Stores
            </Link>
            {user?.role === "USER" && (
              <Link
                to={targetProfile}
                className={` px-3 py-1 rounded ${
                  activeBtn === targetProfile
                    ? "bg-gray-600 hover:bg-indigo-800"
                    : "bg-indigo-600 hover:bg-indigo-800"
                } transition-colors duration-200`}
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
