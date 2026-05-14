import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { BrandSignature } from '@/components/layout/BrandSignature';
import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationBell } from '@/features/notifications/NotificationBell';

export function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Inicio' },
    ...(role === 'client'
      ? [
          { to: '/client-dashboard', search: '', label: 'Agendar' },
          { to: '/client-dashboard', search: '?view=mis-citas', label: 'Mis citas' },
          { to: '/crear-barberia', label: 'Crear barberia' },
        ]
      : []),
    ...(role === 'admin' ? [{ to: '/admin-dashboard', label: 'Admin' }] : []),
    ...(role === 'superadmin' ? [{ to: '/superadmin-dashboard', label: 'Superadmin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink/85 text-cream backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <BrandSignature subtitle="Edicion editorial" />
        </div>

        <nav aria-label="Navegacion principal" className="hidden min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 lg:px-4',
                  ((item.to === '/client-dashboard' && location.pathname === item.to && location.search === (item.search ?? ''))
                    || (item.to !== '/client-dashboard' && isActive))
                    ? 'bg-cream text-ink shadow-soft'
                    : 'text-cream/70 hover:bg-white/8 hover:text-cream',
                ].join(' ')
              }
              key={`${item.to}-${item.label}`}
              to={{ pathname: item.to, search: item.search ?? '' }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-2 lg:gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <ProfileMenu />
            </>
          ) : (
            <Link className="hidden sm:block" to="/login">
              <Button aria-label="Iniciar sesion" size="sm" variant="outline">
                <LogIn aria-hidden size={16} />
                Entrar
              </Button>
            </Link>
          )}

          <button
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream transition hover:bg-white/10 md:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            type="button"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-white/8 bg-ink/96 px-4 py-4 md:hidden">
          <nav aria-label="Navegacion movil" className="mx-auto grid max-w-[1200px] gap-2">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    'rounded-2xl border px-4 py-3 text-sm font-medium transition',
                    ((item.to === '/client-dashboard' && location.pathname === item.to && location.search === (item.search ?? ''))
                      || (item.to !== '/client-dashboard' && isActive))
                      ? 'border-cream bg-cream text-ink'
                      : 'border-white/10 bg-white/5 text-cream/78 hover:bg-white/8 hover:text-cream',
                  ].join(' ')
                }
                key={`mobile-${item.to}-${item.label}`}
                onClick={() => setIsMobileMenuOpen(false)}
                to={{ pathname: item.to, search: item.search ?? '' }}
              >
                {item.label}
              </NavLink>
            ))}

            {!isAuthenticated ? (
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/login">
                <Button className="mt-2 w-full" size="md" variant="outline">
                  <LogIn aria-hidden size={16} />
                  Iniciar sesion
                </Button>
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
