import { ArrowRight, BellRing, CalendarCheck2, Crown, Scissors, ShieldCheck, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { barberHeroImage } from '@/features/home/heroImage';

const pillars = [
  {
    icon: <CalendarCheck2 size={18} />,
    title: 'Reserva sin friccion',
    description: 'Agenda en minutos con servicios claros, disponibilidad real y flujo limpio desde cualquier dispositivo.',
  },
  {
    icon: <BellRing size={18} />,
    title: 'Operacion al dia',
    description: 'Clientes y barberias se mantienen sincronizados con estados, recordatorios y seguimiento centralizado.',
  },
  {
    icon: <Store size={18} />,
    title: 'Control premium',
    description: 'Servicios, barberos, horarios e insights en una superficie moderna lista para crecer contigo.',
  },
];

const operatingSignals = [
  'Citas pendientes y confirmadas en tiempo real',
  'Perfil de barberia, horarios y servicios en un mismo flujo',
  'Experiencia premium para cliente, admin y superadmin',
];

export function PublicHome() {
  return (
    <div className="-mx-4 space-y-16 pb-6 sm:-mx-6 lg:-mx-8">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="surface-panel-dark relative isolate overflow-hidden rounded-none px-6 py-10 text-white sm:rounded-[36px] sm:px-8 lg:min-h-[calc(100svh-8rem)] lg:px-12 lg:py-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${barberHeroImage})` }}
          />
          <div className="hero-fade absolute inset-0" />
          <div className="hero-mesh absolute inset-0 opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_24%),radial-gradient(circle_at_left_center,rgba(16,185,129,0.08),transparent_18%)]" />
          <div className="absolute inset-y-0 left-[54%] hidden w-px bg-gradient-to-b from-transparent via-white/18 to-transparent lg:block" />

          <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div className="flex max-w-2xl flex-col justify-between gap-10">
              <div className="space-y-6 animate-fade-up">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                  <Crown size={14} />
                  Sistema premium para barberias modernas
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold tracking-[0.18em] text-gold">BARBERAPP</p>
                  <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    Reserva, opera y haz crecer tu barberia con una sola plataforma.
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                    Una experiencia elegante para clientes y equipos que quieren agenda clara, control operativo y una marca que se vea tan bien como trabaja.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/register">
                    <Button className="w-full sm:w-auto" size="lg">
                      Empezar ahora
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="w-full sm:w-auto" size="lg" variant="outline">
                      Iniciar sesion
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                <Signal value="24/7" label="Reservas desde cualquier momento" />
                <Signal value="3 roles" label="Cliente, admin y superadmin" />
                <Signal value="1 flujo" label="Agenda, gestion y crecimiento" />
              </div>
            </div>

            <div className="grid gap-4 lg:pl-8">
              <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-black/50 to-black/24 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">Ritual diario</p>
                    <h2 className="mt-2 text-2xl font-semibold">Todo lo que pasa en tu barberia, sin ruido.</h2>
                  </div>
                  <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Premium
                  </div>
                </div>

                <div className="grid gap-4 pt-5 sm:grid-cols-3 lg:grid-cols-1">
                  {pillars.map((pillar, index) => (
                    <article className="rounded-2xl border border-white/10 bg-black/24 p-4" key={pillar.title}>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-gold">
                          {pillar.icon}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">Paso {index + 1}</p>
                          <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-white/62">{pillar.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4 px-1">
            <p className="text-sm font-semibold tracking-[0.18em] text-steel">SISTEMA VISUAL</p>
            <h2 className="max-w-md text-3xl font-semibold text-ink sm:text-4xl">Sobrio por fuera, agil por dentro.</h2>
            <p className="max-w-lg text-base leading-7 text-slate-600">
              BarberApp combina una presencia elegante con herramientas listas para operar: reservas claras, acciones rapidas y un panel que prioriza decisiones reales.
            </p>
          </div>

          <div className="surface-panel grid gap-0 overflow-hidden rounded-[32px]">
            {operatingSignals.map((signal, index) => (
              <div className="flex items-start gap-4 border-b border-black/6 px-6 py-5 last:border-b-0" key={signal}>
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  {index === 0 ? <CalendarCheck2 size={18} /> : index === 1 ? <Scissors size={18} /> : <ShieldCheck size={18} />}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">0{index + 1}</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{signal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="surface-panel-dark overflow-hidden rounded-[32px] px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.18em] text-gold">PARA BARBERIAS</p>
              <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">Tu negocio merece una agenda que se vea tan bien como tu marca.</h2>
              <p className="max-w-xl text-base leading-7 text-white/68">
                Crea tu cuenta, configura servicios, barberos y horarios, y convierte el flujo diario en una experiencia simple para tu equipo y tus clientes.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Link to="/register">
                <Button size="lg">Crear mi barberia</Button>
              </Link>
              <p className="max-w-sm text-sm leading-6 text-white/52 lg:text-right">
                Listo para mobile, dashboards por rol y una identidad visual oscura, limpia y premium.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm leading-6 text-white/56">{label}</p>
    </div>
  );
}
