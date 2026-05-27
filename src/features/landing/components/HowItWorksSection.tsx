const steps = [
  {
    number: '01',
    title: 'Configura tu barberia',
    description: 'Crea servicios, define horarios, organiza barberos y prepara tu operacion desde una misma base.',
  },
  {
    number: '02',
    title: 'Activa reservas y soporte',
    description: 'Los clientes consultan opciones claras, reservan online y tu equipo recibe un acompanamiento de inicio mas ordenado.',
  },
  {
    number: '03',
    title: 'Mide, fideliza y crece',
    description: 'Supervisa citas, ingresos, comisiones, referidos y crecimiento hasta escalar a una operacion multisede.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-white/8 bg-ink-soft" id="como-funciona">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="eyebrow text-gold-300">Como funciona</p>
            <h2 className="font-display max-w-2xl text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
              De agenda dispersa a <span className="font-display-italic text-gold-200">plataforma profesional.</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-cream/68">
            Tres pasos simples. Cero curva de aprendizaje. Una barberia que opera, vende y se presenta con mas orden.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <article
              className="landing-hover-lift relative overflow-hidden rounded-[32px] border border-white/10 bg-[#141210] p-7"
              key={step.number}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-500/6 blur-3xl"
              />
              <div className="flex items-center justify-between">
                <span className="font-display numeric text-7xl font-semibold tracking-tight text-gold-300/40">
                  {step.number}
                </span>
                {idx < steps.length - 1 ? (
                  <div className="hidden h-px w-12 bg-gold-500/40 lg:block" aria-hidden />
                ) : null}
              </div>
              <h3 className="font-display mt-8 text-2xl font-semibold tracking-tight text-cream">{step.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-cream/68">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
