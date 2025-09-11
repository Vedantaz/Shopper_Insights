import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactElement } from "react";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: ReactElement;
  role?: string;
}) {
  const token = sessionStorage.getItem("token");
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;
  if (role && user && !role.includes(user.role))
    return <Navigate to="/login" replace />;
  return children;
}
