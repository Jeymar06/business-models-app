import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Cargando sesion...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate replace state={{ from: location }} to="/" />;
}
