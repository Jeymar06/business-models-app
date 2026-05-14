import { ArrowUpRight, CalendarCheck2, Clock3, PanelsTopLeft, ShieldCheck, Sparkles, Users } from 'lucide-react';

import { landingMediaGroups } from '@/features/landing/data/landingMedia';

const marqueeItems = [
  'Reservas online',
  'Agenda por barbero',
  'Clientes claros',
  'Metricas vivas',
  'Servicios premium',
  'Equipo sincronizado',
  'Horarios sin cruces',
  'Operacion editorial',
];

const showcaseCards = [
  {
    type: 'image' as const,
    src: landingMediaGroups.productShots.intro,
    title: 'Reservas sin friccion',
    label: 'Reservas',
    copy: 'Tus clientes eligen servicio, horario y barbero en minutos, sin llamadas cruzadas ni mensajes perdidos.',
    rotate: -3,
  },
  {
    type: 'video' as const,
    src: landingMediaGroups.reels[0].video,
    poster: landingMediaGroups.reels[0].poster,
    title: 'Agenda que respira orden',
    label: 'En vivo',
    copy: 'Cada cita aparece clara para el equipo completo y el dia avanza con menos pausas, dudas y reprocesos.',
    rotate: 2,
  },
  {
    type: 'image' as const,
    src: landingMediaGroups.productShots.product,
    title: 'Equipo alineado',
    label: 'Admin',
    copy: 'Barberos, servicios y horarios quedan conectados para que tu operacion se sienta estable incluso en horas pico.',
    rotate: -1,
  },
  {
    type: 'video' as const,
    src: landingMediaGroups.reels[4].video,
    poster: landingMediaGroups.reels[4].poster,
    title: 'Metricas que si ayudan',
    label: 'Metricas',
    copy: 'Visualiza ingresos, citas y rendimiento por barberia para detectar donde crecer y que ajustar primero.',
    rotate: 3,
  },
  {
    type: 'image' as const,
    src: landingMediaGroups.productShots.detail,
    title: 'Marca lista para crecer',
    label: 'Detalle',
    copy: 'La experiencia cuida cada detalle para que tu negocio se vea mas profesional desde la primera reserva.',
    rotate: -2,
  },
];

const motionBenefits = [
  { icon: CalendarCheck2, label: 'Reserva', value: 'sin llamadas largas' },
  { icon: Clock3, label: 'Disponibilidad', value: 'visible por barbero' },
  { icon: Users, label: 'Clientes', value: 'historial en orden' },
  { icon: PanelsTopLeft, label: 'Paneles', value: 'admin, cliente y superadmin' },
  { icon: ShieldCheck, label: 'Control', value: 'roles y permisos claros' },
];

export function LandingMarqueeSection() {
  return (
    <section className="overflow-hidden border-y border-gold-500/20 bg-cream py-3 text-ink">
      <div className="landing-marquee-track flex w-max items-center gap-3">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <div className="flex items-center gap-3 px-2" key={`${item}-${index}`}>
            <span className="h-2 w-2 rounded-full bg-gold-600" />
            <span className="font-display text-3xl font-semibold sm:text-5xl">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AnimatedMessageSection() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-ink-soft px-4 py-24 text-cream sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(212,175,55,0.14),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_20%)]" />
      <div className="relative mx-auto flex min-h-[70svh] max-w-[1200px] flex-col items-center justify-center text-center">
        <p className="eyebrow text-gold-300" data-reveal>
          Movimiento con proposito
        </p>

        <h2
          className="mt-10 max-w-6xl font-display text-[3.2rem] font-semibold leading-[0.93] sm:text-[5.5rem] lg:text-[7.4rem]"
          data-word-reveal
        >
          {renderWords('Cada reserva deja de ser un mensaje perdido y se vuelve parte de un flujo visible para todos.')}
        </h2>

        <div
          className="mt-9 inline-flex -rotate-2 overflow-hidden border-[0.35rem] border-ink-soft bg-gold-500 px-5 py-3 text-ink"
          data-clip-reveal
        >
          <span className="font-display text-4xl font-semibold leading-none sm:text-6xl">Control total</span>
        </div>

        <p className="mt-9 max-w-2xl text-base leading-8 text-cream/68 sm:text-lg" data-reveal>
          Barber Flow mantiene cada cita, cliente y decision en una lectura clara para que el dia avance con menos friccion.
        </p>
      </div>
    </section>
  );
}

export function PinnedShowcaseSection() {
  return (
    <section className="landing-horizontal-section relative overflow-hidden bg-cream py-20 text-ink md:min-h-screen md:py-0" id="showcase">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,241,232,1),rgba(237,229,211,1))]" />

      <div className="relative flex min-h-screen flex-col justify-center">
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 sm:px-6 lg:px-8" data-reveal>
          <p className="eyebrow text-gold-700">Showcase interactivo</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-display max-w-3xl text-4xl font-semibold leading-[1.02] sm:text-6xl">
              Convierte cada visita en una reserva mas clara, rapida y confiable.
            </h2>
            <p className="max-w-md text-base leading-7 text-ink/62">
              Muestra como tu barberia organiza agenda, equipo, clientes y resultados en una sola experiencia que inspira confianza.
            </p>
          </div>
        </div>

        <div className="landing-horizontal-track flex flex-col gap-5 px-4 sm:px-6 md:w-max md:flex-row md:gap-7 md:px-[8vw]">
          {showcaseCards.map((card) => (
            <article
              className="landing-tilt-card group relative w-full overflow-hidden rounded-[34px] border border-ink/10 bg-paper shadow-[0_30px_80px_rgba(10,9,8,0.18)] md:w-[min(42vw,34rem)] md:flex-none"
              data-rotate={card.rotate}
              key={card.title}
            >
              <div className="relative h-[34rem] overflow-hidden bg-ink md:h-[36rem]">
                {card.type === 'image' ? (
                  <img alt={card.title} className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" src={card.src} />
                ) : (
                  <video
                    autoPlay
                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                    loop
                    muted
                    playsInline
                    poster={card.poster}
                  >
                    <source src={card.src} type="video/mp4" />
                  </video>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.08),rgba(10,9,8,0.62))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/16 bg-ink/55 px-4 py-2 text-cream backdrop-blur-xl">
                  <p className="eyebrow text-[0.62rem] text-gold-200">{card.label}</p>
                </div>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl font-semibold leading-none">{card.title}</h3>
                  <ArrowUpRight className="mt-1 flex-none text-gold-700 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={24} />
                </div>
                <p className="mt-4 text-sm leading-7 text-ink/64 sm:text-base">{card.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoRevealSection() {
  return (
    <section className="landing-video-reveal relative min-h-screen overflow-hidden bg-ink">
      <div className="landing-video-reveal-media absolute inset-0">
        <video
          autoPlay
          className="h-full w-full object-cover object-center"
          loop
          muted
          playsInline
          poster={landingMediaGroups.reels[5].poster}
        >
          <source src={landingMediaGroups.reels[5].video} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.88),rgba(10,9,8,0.42),rgba(10,9,8,0.84))]" />
      <div className="grain-overlay absolute inset-0" />

      <div className="landing-video-reveal-copy relative z-10 mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="eyebrow text-gold-300">Reveal cinematico</p>
        <h2 className="font-display mt-5 max-w-4xl text-5xl font-semibold leading-[0.96] text-cream sm:text-7xl lg:text-8xl">
          El producto aparece como una escena, no como una maqueta estatica.
        </h2>
        <div className="mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {motionBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl" key={benefit.label}>
                <Icon className="text-gold-300" size={20} />
                <p className="font-display mt-5 text-2xl font-semibold text-cream">{benefit.label}</p>
                <p className="mt-2 text-sm leading-6 text-cream/60">{benefit.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ReelStackSection() {
  return (
    <section className="relative overflow-hidden bg-ink-soft px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div>
            <p className="eyebrow text-gold-300">Reels de experiencia</p>
            <h2 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] text-cream sm:text-6xl">
              Videos cortos, ritmo rapido y presencia visual.
            </h2>
          </div>
          <p className="max-w-md text-base leading-8 text-cream/64">
            Cada pieza muestra el ritmo de una barberia que agenda mejor, atiende mejor y entiende mejor su operacion.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingMediaGroups.reels.slice(0, 6).map((reel, index) => (
            <article
              className="landing-tilt-card group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#141210] shadow-[0_24px_70px_rgba(0,0,0,0.36)]"
              data-rotate={index % 2 === 0 ? -1 : 1}
              key={reel.label}
            >
              <video
                autoPlay
                className="aspect-[9/13] w-full object-cover transition duration-700 group-hover:scale-105"
                loop
                muted
                playsInline
                poster={reel.poster}
              >
                <source src={reel.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(10,9,8,0.8))]" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <p className="font-display text-2xl font-semibold text-cream">{reel.label}</p>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/10 text-gold-200 backdrop-blur">
                  <Sparkles size={18} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderWords(text: string) {
  return text.split(' ').map((word, index) => (
    <span className="landing-word inline-block text-cream/12" key={`${word}-${index}`}>
      {word}
      {index < text.split(' ').length - 1 ? '\u00a0' : ''}
    </span>
  ));
}
