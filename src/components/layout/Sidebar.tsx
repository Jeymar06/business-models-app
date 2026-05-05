import { LayoutDashboard, PanelsTopLeft, Shapes } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  { to: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { to: '/models', label: 'Modelos', icon: Shapes },
  { to: '/canvas', label: 'Canvas', icon: PanelsTopLeft },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-20 grid gap-1" aria-label="Secciones de trabajo">
        {sidebarLinks.map(({ icon: Icon, ...item }) => (
          <NavLink
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-white text-ink shadow-sm' : 'text-slate-600 hover:bg-white hover:text-ink',
              ].join(' ')
            }
            key={item.to}
            to={item.to}
          >
            <Icon aria-hidden size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
