import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { BookingPage } from '@/pages/BookingPage';
import { ClientDashboard } from '@/pages/ClientDashboard';
import { CreateBarberiaPage } from '@/pages/CreateBarberiaPage';
import { SuperAdminDashboard } from '@/pages/SuperAdminDashboard';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <BrowserRouter>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-sm text-slate-500">Cargando sesión...</div>
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route element={<LandingPage />} path="/" />
            <Route element={<AuthCallbackPage />} path="/auth/callback" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />

            <Route element={<ProtectedRoute requiredRole={['client', 'admin', 'superadmin']} />}>
              <Route element={<BookingPage />} path="/booking" />
            </Route>

            <Route element={<ProtectedRoute requiredRole="client" />}>
              <Route element={<ClientDashboard />} path="/client-dashboard" />
              <Route element={<CreateBarberiaPage />} path="/crear-barberia" />
            </Route>

            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<AdminDashboard />} path="/admin-dashboard" />
            </Route>

            <Route element={<ProtectedRoute requiredRole="superadmin" />}>
              <Route element={<SuperAdminDashboard />} path="/superadmin-dashboard" />
            </Route>

            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
