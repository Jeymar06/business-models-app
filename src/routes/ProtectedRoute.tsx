import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UserRole } from '@/types/supabase.types';

interface ProtectedRouteProps {
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-500">Cargando sesión...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(role as UserRole)
      : role === requiredRole;

    if (!hasRequiredRole) {
      return <Navigate replace to={getRoleRedirect(role)} />;
    }
  }

  return <Outlet />;
}

function getRoleRedirect(role: string | null) {
  if (role === 'superadmin') return '/superadmin-dashboard';
  if (role === 'admin') return '/admin-dashboard';
  return '/client-dashboard';
}
