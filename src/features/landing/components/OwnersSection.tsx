import { BarChart3, CalendarRange, Clock3, Scissors, ShieldCheck, Users } from 'lucide-react';

const ownerBenefits = [
  { title: 'Controlar citas del día', description: 'Revisa la agenda diaria sin depender de conversaciones sueltas.', icon: CalendarRange },
  { title: 'Gestionar equipo', description: 'Organiza barberos y disponibilidad con menos fricción operativa.', icon: Users },
  { title: 'Crear servicios', description: 'Define oferta, tiempos y precio desde una sola estructura.', icon: Scissors },
  { title: 'Administrar disponibilidad', description: 'Evita cruces, bloquea horarios y da claridad a todo el equipo.', icon: Clock3 },
  { title: 'Ver métricas', description: 'Obtén una lectura más útil del negocio y su movimiento.', icon: BarChart3 },
  { title: 'Reducir errores', description: 'Menos improvisación y más control sobre la experiencia que recibe el cliente.', icon: ShieldCheck },
];

export function OwnersSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p className="eyebrow text-gold-300">Para dueños</p>
          <h2 className="font-display max-w-2xl text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
            Control total para dueños{' '}
            <span className="font-display-italic text-gold-200">que quieren crecer.</span>
          </h2>
        </div>
        <p className="max-w-xl text-base leading-8 text-cream/68">
          Barber Flow ayuda a que la barbería se vea mejor por fuera y funcione mejor por dentro.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ownerBenefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article
              className="landing-hover-lift rounded-[28px] border border-white/8 bg-[#141210] p-6"
              key={benefit.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-gold-300">
                <Icon size={20} />
              </div>
              <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight text-cream">{benefit.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-cream/68">{benefit.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
