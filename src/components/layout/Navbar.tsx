import { LogIn, Menu, Scissors, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationBell } from '@/features/notifications/NotificationBell';

export function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Inicio' },
    ...(role === 'client'
      ? [
          { to: '/client-dashboard', label: 'Agendar' },
          { to: '/client-dashboard', label: 'Mis citas' },
          { to: '/crear-barberia', label: 'Crear barbería' },
        ]
      : []),
    ...(role === 'admin' ? [{ to: '/admin-dashboard', label: 'Admin' }] : []),
    ...(role === 'superadmin' ? [{ to: '/superadmin-dashboard', label: 'Superadmin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink/85 text-cream backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-3" to="/">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-gold-300 transition-all duration-300 group-hover:border-gold-500/40 group-hover:bg-gold-500/10">
            <Scissors aria-hidden size={18} />
          </span>
          <div className="leading-tight">
            <span className="eyebrow block text-cream/55">Barber Flow</span>
            <span className="font-display block text-lg font-semibold tracking-tight text-cream">
              Reservas premium
            </span>
          </div>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-cream text-ink shadow-soft'
                    : 'text-cream/70 hover:bg-white/8 hover:text-cream',
                ].join(' ')
              }
              key={`${item.to}-${item.label}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <ProfileMenu />
            </>
          ) : (
            <Link className="hidden sm:block" to="/login">
              <Button aria-label="Iniciar sesión" size="sm" variant="outline">
                <LogIn aria-hidden size={16} />
                Entrar
              </Button>
            </Link>
          )}

          <button
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
          <nav aria-label="Navegación móvil" className="mx-auto grid max-w-[1200px] gap-2">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    'rounded-2xl border px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'border-cream bg-cream text-ink'
                      : 'border-white/10 bg-white/5 text-cream/78 hover:bg-white/8 hover:text-cream',
                  ].join(' ')
                }
                key={`mobile-${item.to}-${item.label}`}
                onClick={() => setIsMobileMenuOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}

            {!isAuthenticated ? (
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/login">
                <Button className="mt-2 w-full" size="md" variant="outline">
                  <LogIn aria-hidden size={16} />
                  Iniciar sesión
                </Button>
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
