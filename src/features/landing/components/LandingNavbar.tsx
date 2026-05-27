import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { landingLogo } from '@/features/landing/data/landingMedia';

const navItems = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#funciones', label: 'Funciones' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#planes', label: 'Planes' },
  { href: '#contacto', label: 'Contacto' },
];

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed left-0 top-0 z-50 w-full text-cream backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
        scrolled
          ? 'border-b border-white/10 bg-ink/85 shadow-[0_18px_44px_rgba(0,0,0,0.4)]'
          : 'border-b border-transparent bg-ink/25',
      ].join(' ')}
    >
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="group flex items-center gap-4" href="#inicio">
          <span className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-500 group-hover:-translate-y-0.5 group-hover:border-gold-500/40 group-hover:bg-white/10">
            <img alt="Barber Flow" className="h-full w-full object-cover object-left transition duration-500 group-hover:scale-[1.04]" src={landingLogo} />
          </span>
          <div className="leading-tight">
            <span className="eyebrow block text-cream/55 transition duration-300 group-hover:text-gold-200">
              Barber Flow
            </span>
            <span className="font-display block text-lg font-semibold tracking-tight text-cream transition duration-300 group-hover:translate-x-0.5">
              Edicion editorial
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 md:flex">
          {navItems.map((item) => (
            <a
              className="rounded-full px-4 py-2 text-sm font-medium text-cream/70 transition duration-300 hover:-translate-y-px hover:bg-white/8 hover:text-cream"
              href={item.href}
              key={item.href}
            >
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
            <Button size="sm" variant="gold">Crear cuenta</Button>
          </Link>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cream transition hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-ink px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-[1200px] gap-2">
            {navItems.map((item) => (
              <a
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-cream/78 transition hover:bg-white/8 hover:text-cream"
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
                <Button className="w-full" size="md" variant="gold">
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
