import { CalendarCheck2, CreditCard, Scissors, UserCheck } from 'lucide-react';

const clientBenefits = [
  {
    title: 'Reservar en minutos',
    description: 'La reserva deja de depender de conversaciones largas o respuestas tardias.',
    icon: CalendarCheck2,
  },
  {
    title: 'Elegir barbero',
    description: 'El cliente consulta disponibilidad y escoge mejor segun su preferencia.',
    icon: UserCheck,
  },
  {
    title: 'Ver servicios y precios',
    description: 'Todo se presenta con mas claridad antes de confirmar la cita.',
    icon: Scissors,
  },
  {
    title: 'Consultar o cancelar citas',
    description: 'La experiencia sigue viva despues de reservar y mantiene el control del lado del cliente.',
    icon: CreditCard,
  },
];

export function ClientsSection() {
  return (
    <section className="border-y border-white/8 bg-[#111111]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-20">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] text-gold">PARA CLIENTES</p>
          <h2 className="max-w-md text-3xl font-semibold text-white sm:text-4xl">
            Una mejor experiencia para tus clientes.
          </h2>
          <p className="max-w-lg text-base leading-7 text-[#C9C9C9]">
            Cuando reservar se siente claro y rapido, la barberia transmite mas orden, mas confianza y una imagen mas fuerte.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {clientBenefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article className="rounded-[28px] border border-white/10 bg-[#171717] p-5" key={benefit.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 text-gold">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#C9C9C9]">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}