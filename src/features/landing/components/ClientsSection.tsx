import { CalendarCheck2, CreditCard, Scissors, UserCheck } from 'lucide-react';

const clientBenefits = [
  { title: 'Reservar en minutos', description: 'La reserva deja de depender de conversaciones largas o respuestas tardias.', icon: CalendarCheck2 },
  { title: 'Elegir barbero', description: 'El cliente consulta disponibilidad y escoge mejor segun su preferencia.', icon: UserCheck },
  { title: 'Ver servicios y precios', description: 'Todo se presenta con mas claridad antes de confirmar la cita.', icon: Scissors },
  { title: 'Consultar o cancelar citas', description: 'La experiencia sigue viva despues de reservar y mantiene control del lado del cliente.', icon: CreditCard },
];

export function ClientsSection() {
  return (
    <section className="border-y border-white/8 bg-ink-soft">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-28">
        <div className="space-y-5">
          <p className="eyebrow text-gold-300">Para clientes</p>
          <h2 className="font-display max-w-md text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
            Una mejor experiencia <span className="font-display-italic text-gold-200">para tus clientes.</span>
          </h2>
          <p className="max-w-lg text-base leading-8 text-cream/68">
            Cuando reservar se siente claro y rapido, la barberia transmite mas orden, mas confianza y una imagen mas fuerte.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {clientBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                className="landing-hover-lift rounded-[28px] border border-white/8 bg-[#1a1714] p-6"
                key={benefit.title}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-gold-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight text-cream">{benefit.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-7 text-cream/68">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
