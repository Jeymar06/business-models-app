import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RegisterPage } from '@/pages/RegisterPage';
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
            {/* Public routes */}
            <Route element={<LandingPage />} path="/" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />

            {/* Client routes */}
            <Route element={<ProtectedRoute requiredRole="client" />}>
              {/* Booking pages will go here - Fase 3 */}
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              {/* Admin dashboard pages will go here - Fase 2 */}
            </Route>

            {/* Super Admin routes */}
            <Route element={<ProtectedRoute requiredRole="superadmin" />}>
              {/* Super admin pages will go here - Fase 5 */}
            </Route>

            {/* 404 */}
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
