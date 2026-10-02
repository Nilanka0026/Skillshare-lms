import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export function RoleBasedRoute({ allowedRoles }) {
  const { authLoading, isAuthenticated, user } = useAuth();

  if (authLoading) {
    return <div className="px-5 py-20 text-center font-semibold text-gray-600">Loading your account...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
