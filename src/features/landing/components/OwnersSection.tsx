import { BarChart3, CalendarRange, Clock3, Scissors, ShieldCheck, Users } from 'lucide-react';

const ownerBenefits = [
  {
    title: 'Controlar citas del dia',
    description: 'Revisa la agenda diaria sin depender de conversaciones sueltas.',
    icon: CalendarRange,
  },
  {
    title: 'Gestionar equipo',
    description: 'Organiza barberos y disponibilidad con menos friccion operativa.',
    icon: Users,
  },
  {
    title: 'Crear servicios',
    description: 'Define oferta, tiempos y precio desde una sola estructura.',
    icon: Scissors,
  },
  {
    title: 'Administrar disponibilidad',
    description: 'Evita cruces, bloquea horarios y da claridad a todo el equipo.',
    icon: Clock3,
  },
  {
    title: 'Ver metricas',
    description: 'Obtiene una lectura mas util del negocio y su movimiento.',
    icon: BarChart3,
  },
  {
    title: 'Reducir errores',
    description: 'Menos improvisacion y mas control sobre la experiencia que recibe el cliente.',
    icon: ShieldCheck,
  },
];

export function OwnersSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-gold">PARA DUENOS</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
            Control total para duenos que quieren crecer.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#C9C9C9]">
          Barber Flow ayuda a que la barberia se vea mejor por fuera y funcione mejor por dentro.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ownerBenefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article className="rounded-[28px] border border-white/10 bg-[#111111] p-5" key={benefit.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-gold">
                <Icon size={18} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#C9C9C9]">{benefit.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}