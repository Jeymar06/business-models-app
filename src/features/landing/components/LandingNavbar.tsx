import { Menu, Scissors, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

const navItems = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#funciones', label: 'Funciones' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#planes', label: 'Planes' },
  { href: '#contacto', label: 'Contacto' },
];

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0B]/88 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#inicio">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/6 text-gold shadow-glow">
            <Scissors aria-hidden size={18} />
          </span>
          <div>
            <span className="block text-sm font-semibold tracking-[0.18em] text-white/62">BARBER FLOW</span>
            <span className="block text-base font-semibold text-white">Plataforma para barberias</span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a className="text-sm font-medium text-white/72 transition hover:text-white" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button size="sm" variant="ghost">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Crear cuenta</Button>
          </Link>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#0B0B0B] px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-[1200px] gap-2">
            {navItems.map((item) => (
              <a
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/78 transition hover:bg-white/8 hover:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="mt-2 grid gap-2">
              <Link onClick={() => setIsOpen(false)} to="/login">
                <Button className="w-full" size="md" variant="outline">
                  Entrar
                </Button>
              </Link>
              <Link onClick={() => setIsOpen(false)} to="/register">
                <Button className="w-full" size="md">
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}