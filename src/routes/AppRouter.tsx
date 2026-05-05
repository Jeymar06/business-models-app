import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CanvasPage } from '@/pages/CanvasPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { HomePage } from '@/pages/HomePage';
import { ModelDetailPage } from '@/pages/ModelDetailPage';
import { ModelsPage } from '@/pages/ModelsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<DashboardPage />} path="/dashboard" />
              <Route element={<ModelsPage />} path="/models" />
              <Route element={<ModelDetailPage />} path="/models/:modelId" />
              <Route element={<CanvasPage />} path="/canvas" />
              <Route element={<NotFoundPage />} path="*" />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
