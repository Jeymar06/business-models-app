import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AdminCitasPage } from '@/pages/AdminCitasPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { BookingPage } from '@/pages/BookingPage';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { ClientDashboard } from '@/pages/ClientDashboard';
import { CreateBarberiaPage } from '@/pages/CreateBarberiaPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SuperAdminDashboard } from '@/pages/SuperAdminDashboard';
import { SupportPage } from '@/pages/SupportPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <BrowserRouter>
        <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 text-center text-sm text-white/72">
          Cargando sesion...
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppShell isAuthenticated={isAuthenticated} />
    </BrowserRouter>
  );
}

function AppShell({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();
  const isPublicLanding = location.pathname === '/' && !isAuthenticated;

  return (
    <div className="app-shell flex min-h-screen flex-col">
      {isPublicLanding ? null : <Navbar />}
      <main className={isPublicLanding ? 'w-full flex-1' : 'mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8'}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<AuthCallbackPage />} path="/auth/callback" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />

          <Route element={<ProtectedRoute requiredRole="client" />}>
            <Route element={<BookingPage />} path="/booking/:barberia_id" />
            <Route element={<ClientDashboard />} path="/client-dashboard" />
            <Route element={<ClientDashboard />} path="/dashboard/client" />
            <Route element={<CreateBarberiaPage />} path="/crear-barberia" />
          </Route>

          <Route element={<ProtectedRoute requiredRole={['client', 'admin', 'superadmin']} />}>
            <Route element={<ProfilePage />} path="/profile" />
            <Route element={<ChangePasswordPage />} path="/change-password" />
            <Route element={<SupportPage />} path="/support" />
          </Route>

          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route element={<AdminDashboard />} path="/admin-dashboard" />
            <Route element={<AdminCitasPage />} path="/admin-dashboard/citas" />
          </Route>

          <Route element={<ProtectedRoute requiredRole="superadmin" />}>
            <Route element={<SuperAdminDashboard />} path="/superadmin-dashboard" />
            <Route element={<SuperAdminDashboard />} path="/dashboard/superadmin" />
          </Route>

          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </main>
      {isPublicLanding ? null : <Footer />}
    </div>
  );
}