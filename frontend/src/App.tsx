
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminStores from "./pages/Admin/Stores";
import OwnerDashboard from "./pages/Owner/Dashboard";
import StoreList from "./pages/User/StoreList";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
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

        {/* User */}
        <Route
          path="/user/stores"
          element={
            <ProtectedRoute role="USER">
              <StoreList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
