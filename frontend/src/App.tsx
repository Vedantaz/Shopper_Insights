import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminStores from "./pages/Admin/Stores";
import OwnerDashboard from "./pages/Owner/Dashboard";
import StoreList from "./pages/User/StoreList";
import UserProfilePage from "./pages/UserProfilePage";
import { RatingsProvider } from "./auth/RatingsContext";
import { AuthContext } from "./auth/AuthContext";
import { useContext } from "react";
import OwnerStores from "./pages/Owner/OwnerStores";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AppContent must be used within an AuthProvider");
  }
  const { user, loading } = auth;

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        {/* redirect to "/login" from "/" */}
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminStores />
            </ProtectedRoute>
          }
        />

        {/* Owner */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute role="OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/stores"
          element={
            <ProtectedRoute role="OWNER">
              <OwnerStores />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/user/stores"
          element={
            <ProtectedRoute role="USER">
              <RatingsProvider>
                <StoreList />
              </RatingsProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="USER">
              <RatingsProvider>
                <UserProfilePage />
              </RatingsProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
