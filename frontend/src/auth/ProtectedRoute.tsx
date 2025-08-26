import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactElement } from 'react';

export default function ProtectedRoute({ children, role }: { children: ReactElement; role?: string}) {
  const token = localStorage.getItem('token');
  const { user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user && !role.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
