import { ArrowRight, BellRing, CalendarCheck2, Scissors, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

const steps = [
  'Elige una barberia',
  'Selecciona servicio y barbero',
  'Reserva tu horario',
];

const benefits = [
  { icon: <CalendarCheck2 size={18} />, title: 'Reservas online', description: 'Agenda sin llamadas ni mensajes perdidos desde cualquier dispositivo.' },
  { icon: <BellRing size={18} />, title: 'Recordatorios', description: 'Mantente al tanto de tus proximas citas y reduce ausencias.' },
  { icon: <Store size={18} />, title: 'Gestion facil para barberias', description: 'Controla servicios, agenda y operacion desde un mismo lugar.' },
];

export function PublicHome() {
  return (
    <div className="space-y-14">
      <section className="grid gap-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 text-white shadow-2xl sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-14">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
            <Scissors size={16} />
            BarberApp para clientes y barberias
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Agenda tu cita en barberias cerca de ti</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Encuentra barberias, elige servicio, selecciona barbero y reserva en minutos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg">Agendar cita<ArrowRight size={18} /></Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">Iniciar sesion</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:grid-cols-3 lg:grid-cols-1">
          {steps.map((step, index) => (
            <article className="rounded-2xl border border-white/10 bg-slate-950/30 p-4" key={step}>
              <p className="text-sm font-medium text-slate-300">Paso {index + 1}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{step}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {benefits.map((benefit) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel" key={benefit.title}>
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-steel">
              {benefit.icon}
            </div>
            <h2 className="text-lg font-semibold text-ink">{benefit.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{benefit.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-steel">Para duenos de barberia</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Tienes una barberia? Crea tu cuenta</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Centraliza reservas, servicios, barberos y horarios con una experiencia simple para tu equipo y para tus clientes.
            </p>
          </div>
          <div>
            <Link to="/register">
              <Button size="lg">Crear cuenta</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
