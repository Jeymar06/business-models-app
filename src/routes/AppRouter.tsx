import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { ToastProvider } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

/* Code-split: each route loaded lazily for smaller initial bundle */
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })));
const BookingPage = lazy(() => import('@/pages/BookingPage').then((m) => ({ default: m.BookingPage })));
const ClientDashboard = lazy(() => import('@/pages/ClientDashboard').then((m) => ({ default: m.ClientDashboard })));
const CreateBarberiaPage = lazy(() => import('@/pages/CreateBarberiaPage').then((m) => ({ default: m.CreateBarberiaPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })));
const SupportPage = lazy(() => import('@/pages/SupportPage').then((m) => ({ default: m.SupportPage })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminCitasPage = lazy(() => import('@/pages/AdminCitasPage').then((m) => ({ default: m.AdminCitasPage })));
const SuperAdminDashboard = lazy(() => import('@/pages/SuperAdminDashboard').then((m) => ({ default: m.SuperAdminDashboard })));
const CanvasPage = lazy(() => import('@/pages/CanvasPage').then((m) => ({ default: m.CanvasPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="space-y-3 text-center">
        <p className="eyebrow text-gold-300">Barber Flow</p>
        <p className="font-display text-2xl tracking-tight text-cream">Cargando…</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <BrowserRouter>
        <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-center">
          <div className="space-y-3">
            <p className="eyebrow text-gold-300">Barber Flow</p>
            <p className="font-display text-2xl tracking-tight text-cream">Cargando sesión…</p>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell isAuthenticated={isAuthenticated} />
      </ToastProvider>
    </BrowserRouter>
  );
}

function AppShell({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();
  const isPublicLanding = location.pathname === '/' && !isAuthenticated;

  const isCanvasPage = location.pathname === '/modelo-de-negocio';

  return (
    <div className="app-shell flex min-h-screen flex-col">
      {isPublicLanding || isCanvasPage ? null : <Navbar />}
      <main
        className={
          isPublicLanding || isCanvasPage
            ? 'w-full flex-1'
            : 'mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10'
        }
      >
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<AuthCallbackPage />} path="/auth/callback" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />
            <Route element={<CanvasPage />} path="/modelo-de-negocio" />

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
        </Suspense>
      </main>
      {isPublicLanding || isCanvasPage ? null : <Footer />}
    </div>
  );
}
