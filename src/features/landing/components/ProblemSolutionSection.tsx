import { AlertCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  'Citas y mensajes manuales dificiles de controlar.',
  'Horarios confundidos entre barberos y clientes.',
  'Poco seguimiento comercial despues de la primera reserva.',
  'Barberos sin una agenda realmente visible.',
  'Poca visibilidad del negocio para tomar decisiones.',
];

const solutions = [
  'Agenda online centralizada.',
  'Disponibilidad por barbero.',
  'Servicios organizados con precio y duracion.',
  'Notificaciones internas y soporte rapido.',
  'Metricas, ingresos y comisiones en una sola lectura.',
];

export function ProblemSolutionSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="space-y-5">
          <p className="eyebrow text-gold-300">Problema · Solucion</p>
          <h2 className="font-display max-w-md text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
            Tu barberia no necesita mas desorden. <span className="font-display-italic text-gold-200">Necesita flujo.</span>
          </h2>
          <p className="max-w-lg text-base leading-8 text-cream/68">
            Barber Flow ordena la operacion diaria para que la reserva, la atencion al cliente y el control del negocio vivan en el mismo sistema.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-white/8 bg-[#141210] p-7">
            <p className="eyebrow text-cream/42">Lo que hoy pesa</p>
            <div className="mt-6 space-y-4">
              {problems.map((problem) => (
                <div className="flex items-start gap-3" key={problem}>
                  <span className="mt-1 text-gold-200/80">
                    <AlertCircle size={18} />
                  </span>
                  <p className="text-[0.95rem] leading-7 text-cream/72">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-gold-500/22 bg-[linear-gradient(180deg,#211D19,#141210)] p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,199,102,0.12),transparent_45%)]"
            />
            <p className="eyebrow relative text-gold-300">Como responde Barber Flow</p>
            <div className="relative mt-6 space-y-4">
              {solutions.map((solution) => (
                <div className="flex items-start gap-3" key={solution}>
                  <span className="mt-1 text-gold-300">
                    <CheckCircle2 size={18} />
                  </span>
                  <p className="text-[0.95rem] leading-7 text-cream">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
