const steps = [
  {
    number: '01',
    title: 'Configura tu barberia',
    description: 'Crea servicios, define horarios, organiza barberos y prepara tu operacion desde una misma base.',
  },
  {
    number: '02',
    title: 'Recibe reservas',
    description: 'Los clientes consultan opciones claras, eligen servicio y reservan sin friccion innecesaria.',
  },
  {
    number: '03',
    title: 'Gestiona y crece',
    description: 'Supervisa citas, equipo, disponibilidad y metricas para mejorar la marcha diaria del negocio.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-white/8 bg-[#111111]" id="como-funciona">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">COMO FUNCIONA</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
              Barber Flow acompana la operacion desde la configuracion hasta el crecimiento.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#C9C9C9]">
            Tres pasos simples para pasar de una agenda dispersa a una plataforma mas profesional y ordenada.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              className="landing-hover-lift rounded-[30px] border border-white/10 bg-[#171717] p-6 transition duration-300"
              key={step.number}
            >
              <p className="text-sm font-semibold tracking-[0.18em] text-gold">{step.number}</p>
              <h3 className="mt-6 text-2xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#C9C9C9]">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}