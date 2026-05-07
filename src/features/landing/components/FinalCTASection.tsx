import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function FinalCTASection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
      <div className="rounded-[36px] border border-gold/16 bg-[linear-gradient(180deg,#171717,#111111)] px-6 py-10 text-white sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">CTA FINAL</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
              Haz que tu barberia fluya mejor desde hoy.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#C9C9C9]">
              Da el paso a una experiencia mas clara para clientes, equipo y negocio desde una sola plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/register">
              <Button className="w-full sm:w-auto" size="lg">
                Crear cuenta
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#planes">
              <Button className="w-full sm:w-auto" size="lg" variant="outline">
                Ver planes
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}