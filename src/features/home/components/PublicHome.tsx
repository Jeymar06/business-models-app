import { ArrowRight, BellRing, CalendarCheck2, Crown, Scissors, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { barberHeroImage } from '@/features/home/heroImage';

const heroSignals = [
  {
    value: '24/7',
    label: 'Reservas disponibles desde cualquier momento',
  },
  {
    value: '3 roles',
    label: 'Cliente, admin y superadmin con experiencia conectada',
  },
  {
    value: '1 sistema',
    label: 'Agenda, operacion y crecimiento sin cambiar de plataforma',
  },
];

const pillars = [
  {
    icon: <CalendarCheck2 size={18} />,
    title: 'Reservas claras',
    description: 'El cliente encuentra disponibilidad real y agenda en pocos pasos desde mobile o desktop.',
  },
  {
    icon: <BellRing size={18} />,
    title: 'Operacion sin ruido',
    description: 'Estados, seguimiento y acciones rapidas para que el equipo trabaje con menos friccion.',
  },
  {
    icon: <Store size={18} />,
    title: 'Barberia lista para crecer',
    description: 'Servicios, horarios y gestion en una experiencia premium pensada para negocio real.',
  },
];

const operatingSignals = [
  'Disponibilidad, servicios y horarios visibles en un solo flujo.',
  'Dashboards por rol para cliente, barberia y supervision global.',
  'Identidad visual sobria para una marca que quiere verse premium.',
];

const atmosphereNotes = [
  'Pensado para barberias que quieren una presencia moderna desde el primer clic.',
  'Construido para que la experiencia del cliente y la operacion interna se sientan parte del mismo producto.',
];

export function PublicHome() {
  return (
    <div className="-mx-4 pb-6 sm:-mx-6 lg:-mx-8">
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[position:center_right]"
          style={{ backgroundImage: `url(${barberHeroImage})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.76)_34%,rgba(8,8,8,0.42)_58%,rgba(8,8,8,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_18%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1200px] flex-col justify-end py-8 sm:py-10 lg:py-12">
          <div className="max-w-2xl space-y-6 animate-fade-up">
            <p className="text-sm font-semibold tracking-[0.22em] text-gold">BARBERAPP</p>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/72 backdrop-blur-md">
              <Crown size={14} />
              Reserva y gestion premium para barberias modernas
            </div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              La experiencia de tu barberia empieza antes del primer corte.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              Clientes, agenda y operacion en una sola plataforma sobria, rapida y lista para una marca que quiere verse tan bien como trabaja.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button className="w-full sm:w-auto" size="lg">
                  Crear mi cuenta
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

          <div className="mt-10 grid gap-6 border-t border-white/10 pt-6 text-white sm:grid-cols-3">
            {heroSignals.map((signal) => (
              <div key={signal.label}>
                <p className="text-2xl font-semibold sm:text-3xl">{signal.value}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/56">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-steel">UNA SOLA DIRECCION</p>
            <h2 className="max-w-md text-3xl font-semibold text-ink sm:text-4xl">
              Imagen fuerte para fuera. Flujo claro para dentro.
            </h2>
            <p className="max-w-lg text-base leading-7 text-slate-600">
              BarberApp no separa la experiencia del cliente de la operacion diaria. Todo se siente parte del mismo sistema.
            </p>
          </div>

          <div className="space-y-0 border-y border-black/8">
            {pillars.map((pillar) => (
              <article className="grid gap-4 border-b border-black/8 py-6 last:border-b-0 sm:grid-cols-[auto_1fr]" key={pillar.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-gold">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ink">{pillar.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{pillar.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel-dark rounded-[32px] px-6 py-8 text-white sm:px-8">
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">OPERACION REAL</p>
            <h2 className="mt-3 max-w-lg text-3xl font-semibold sm:text-4xl">
              Todo lo que pasa en la barberia, en un lenguaje limpio.
            </h2>
            <div className="mt-8 space-y-5">
              {operatingSignals.map((signal, index) => (
                <div className="flex items-start gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0" key={signal}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white">
                    {index === 0 ? <CalendarCheck2 size={18} /> : index === 1 ? <Scissors size={18} /> : <ShieldCheck size={18} />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">0{index + 1}</p>
                    <p className="mt-2 text-base leading-7 text-white/72">{signal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[32px] border border-black/8 bg-white px-6 py-8 sm:px-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-steel">ATMOSFERA</p>
              <h2 className="mt-3 text-3xl font-semibold text-ink">Una landing que ya se siente como la barberia.</h2>
            </div>

            <div className="mt-8 space-y-5">
              {atmosphereNotes.map((note) => (
                <div className="flex items-start gap-3" key={note}>
                  <span className="mt-1 text-gold">
                    <Sparkles size={16} />
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-black/8 pt-6">
              <p className="max-w-md text-sm leading-7 text-slate-600">
                La referencia visual que enviaste ahora empuja la primera impresion del producto y ordena mejor el tono del resto de la app.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="surface-panel-dark mx-auto overflow-hidden rounded-[32px] px-6 py-8 text-white sm:px-8 lg:max-w-[1200px] lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.18em] text-gold">LISTO PARA EMPEZAR</p>
              <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">
                Crea tu barberia y convierte la agenda diaria en una experiencia mejor conectada.
              </h2>
              <p className="max-w-xl text-base leading-7 text-white/68">
                Configura servicios, horarios y equipo en una plataforma que ya nacio con enfoque premium y responsive.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Link to="/register">
                <Button size="lg">Empezar ahora</Button>
              </Link>
              <p className="max-w-sm text-sm leading-6 text-white/52 lg:text-right">
                Desde el primer registro hasta el panel por rol, la experiencia mantiene el mismo lenguaje visual y operativo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
