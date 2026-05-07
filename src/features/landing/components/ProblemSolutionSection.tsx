import { AlertCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  'Citas por WhatsApp dificiles de controlar.',
  'Horarios confundidos entre barberos y clientes.',
  'Clientes sin recordatorios claros.',
  'Barberos sin una agenda realmente visible.',
  'Poca visibilidad del negocio para tomar decisiones.',
];

const solutions = [
  'Agenda online centralizada.',
  'Disponibilidad por barbero.',
  'Servicios organizados con precio y duracion.',
  'Clientes y citas en un solo flujo.',
  'Metricas para decidir mejor.',
];

export function ProblemSolutionSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] text-gold">PROBLEMA Y SOLUCION</p>
          <h2 className="max-w-md text-3xl font-semibold text-white sm:text-4xl">
            Tu barberia no necesita mas desorden. Necesita flujo.
          </h2>
          <p className="max-w-lg text-base leading-7 text-[#C9C9C9]">
            Barber Flow ordena la operacion diaria para que la reserva, la atencion al cliente y el control del negocio vivan en el mismo sistema.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-[#111111] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Lo que hoy pesa</p>
            <div className="mt-5 space-y-4">
              {problems.map((problem) => (
                <div className="flex items-start gap-3" key={problem}>
                  <span className="mt-1 text-[#E8C766]">
                    <AlertCircle size={18} />
                  </span>
                  <p className="text-sm leading-7 text-[#C9C9C9]">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-gold/18 bg-[linear-gradient(180deg,rgba(23,23,23,1),rgba(17,17,17,1))] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Como responde Barber Flow</p>
            <div className="mt-5 space-y-4">
              {solutions.map((solution) => (
                <div className="flex items-start gap-3" key={solution}>
                  <span className="mt-1 text-gold">
                    <CheckCircle2 size={18} />
                  </span>
                  <p className="text-sm leading-7 text-[#FFFFFF]">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}