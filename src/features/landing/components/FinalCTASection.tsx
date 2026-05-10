import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function FinalCTASection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="relative overflow-hidden rounded-[40px] border border-gold-500/22 bg-[linear-gradient(180deg,#211D19,#100E0C)] px-6 py-12 text-cream sm:px-10 lg:px-14 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(232,199,102,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.10),transparent_45%)]"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow text-gold-300">Última parada antes de empezar</p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
              Haz que tu barbería{' '}
              <span className="font-display-italic text-gold-200">fluya mejor</span> desde hoy.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-cream/72">
              Da el paso a una experiencia más clara para clientes, equipo y negocio desde una sola plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/register">
              <Button className="w-full sm:w-auto" size="xl" variant="gold">
                Crear cuenta
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#planes">
              <Button className="w-full sm:w-auto" size="xl" variant="outline">
                Ver planes
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
