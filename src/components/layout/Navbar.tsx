import { LogIn, Scissors } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const navItems = [
    { to: '/', label: 'Inicio' },
    ...(isAuthenticated ? [{ to: '/client-dashboard', label: 'Agendar' }] : []),
    ...(role === 'client' ? [{ to: '/client-dashboard', label: 'Mis citas' }, { to: '/crear-barberia', label: 'Crear mi barberia' }] : []),
    ...(role === 'admin' ? [{ to: '/admin-dashboard', label: 'Admin' }] : []),
    ...(role === 'superadmin' ? [{ to: '/admin-dashboard', label: 'Admin' }, { to: '/superadmin-dashboard', label: 'Superadmin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 font-semibold text-ink" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white">
            <Scissors aria-hidden size={20} />
          </span>
          <span>Barber App</span>
        </Link>

        <nav aria-label="Navegacion principal" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-slate-100 text-ink' : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                ].join(' ')
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <Link to="/login">
            <Button aria-label="Iniciar sesion" size="sm" variant="secondary">
              <LogIn aria-hidden size={16} />
              Entrar
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
