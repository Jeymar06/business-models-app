import {
  BarChart3,
  BellRing,
  CalendarCheck2,
  ClipboardList,
  Clock3,
  Crown,
  ShieldCheck,
  Store,
  Users,
  UserSquare2,
  WalletCards,
  Workflow,
} from 'lucide-react';

import { landingFeatures } from '@/features/landing/data/features';

const iconMap = {
  'Reservas online': CalendarCheck2,
  'Agenda por barbero': Users,
  'Gestion de servicios': ClipboardList,
  'Horarios y disponibilidad': Clock3,
  'Panel cliente': UserSquare2,
  'Panel admin': Store,
  'Panel superadmin': Crown,
  'Metricas e ingresos': BarChart3,
  'Estados de citas': Workflow,
  Notificaciones: BellRing,
  'Perfil publico de barberia': WalletCards,
  'Roles y permisos': ShieldCheck,
} as const;

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20" id="funciones">
      <div className="space-y-4">
        <p className="text-sm font-semibold tracking-[0.18em] text-gold">FUNCIONES PRINCIPALES</p>
        <h2 className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
          Todo lo que Barber Flow necesita mostrar sobre el producto, sin ruido visual de mas.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-[#C9C9C9]">
          La plataforma concentra experiencia de cliente, operacion de barberia y supervision de negocio en un mismo entorno.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {landingFeatures.map((feature) => {
          const Icon = iconMap[feature.title as keyof typeof iconMap];

          return (
            <article
              className="landing-hover-lift rounded-[28px] border border-white/10 bg-[#111111] p-5 transition duration-300"
              key={feature.title}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/16 bg-gold/10 text-gold">
                <Icon size={18} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#C9C9C9]">{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}