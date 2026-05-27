import {
  BarChart3,
  BellRing,
  Calculator,
  CalendarCheck2,
  ClipboardList,
  Mail,
  Store,
  Users,
  UserSquare2,
  WalletCards,
  Waypoints,
} from 'lucide-react';

import { landingFeatures } from '@/features/landing/data/features';

const iconMap = {
  'Reservas online': CalendarCheck2,
  'Agenda por barbero': Users,
  'Gestion de servicios': ClipboardList,
  'Recordatorios operativos': Mail,
  'Notificaciones internas': BellRing,
  'Calculo de comisiones': Calculator,
  'Metricas e ingresos': BarChart3,
  'Panel admin': Store,
  'Perfil publico de barberia': WalletCards,
} as const;

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28" id="funciones">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div className="space-y-5">
          <p className="eyebrow text-gold-300">Funciones principales</p>
          <h2 className="font-display max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
            Todo lo que tu barberia necesita. <span className="font-display-italic text-gold-200">Sin ruido.</span>
          </h2>
        </div>
        <p className="max-w-xl text-base leading-8 text-cream/68 lg:text-lg">
          La plataforma concentra experiencia de cliente, operacion de barberia, soporte comercial y lectura de negocio en un mismo flujo.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {landingFeatures.map((feature, idx) => {
          const Icon = iconMap[feature.title as keyof typeof iconMap];

          return (
            <article
              className="landing-hover-lift group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#141210] p-6"
              key={feature.title}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gold-flow opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/16 bg-gold-500/10 text-gold-300">
                  <Icon size={20} />
                </div>
                <span className="font-display numeric text-sm text-cream/30">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight text-cream">
                {feature.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-cream/68">{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
