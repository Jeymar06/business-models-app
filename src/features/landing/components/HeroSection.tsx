import { ArrowRight, CalendarDays, Crown, Scissors, Sparkles, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button, Pill } from '@/components/ui';
import { landingMediaGroups } from '@/features/landing/data/landingMedia';

const heroTitle = 'Barber Flow';

export function HeroSection() {
  return (
    <section className="landing-hero relative min-h-[94svh] overflow-hidden border-b border-white/8 bg-ink" id="inicio">
      <div className="landing-hero-media absolute inset-0">
        <img
          alt="Barber Flow en una barberia premium"
          className="h-full w-full object-cover object-center"
          src={landingMediaGroups.hero.cleanImage}
        />
      </div>
      <div className="landing-hero-shade absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.96)_0%,rgba(10,9,8,0.76)_42%,rgba(10,9,8,0.46)_70%,rgba(10,9,8,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(212,175,55,0.18),transparent_24%),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.06),transparent_19%)]" />
      <div className="grain-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto grid min-h-[94svh] w-full max-w-[1440px] gap-10 px-4 pb-14 pt-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10 xl:px-14">
        <div className="landing-hero-content max-w-4xl">
          <div className="landing-hero-reveal">
            <Pill icon={<Crown size={12} />} tone="gold">
              Sistema premium para barberias modernas
            </Pill>
          </div>

          <h1
            aria-label={heroTitle}
            className="landing-hero-title mt-6 overflow-hidden whitespace-nowrap font-display text-[3.35rem] font-semibold leading-[0.82] text-cream sm:text-[6rem] lg:text-[7.4rem] xl:text-[8.6rem]"
          >
            <span className="sr-only">{heroTitle}</span>
            {heroTitle.split('').map((char, index) => (
              <span aria-hidden className="landing-hero-title-char inline-block will-change-transform" key={`${char}-${index}`}>
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>

          <div
            className="landing-hero-clip mt-4 inline-flex origin-left -rotate-2 overflow-hidden border-[0.35rem] border-ink bg-gold-500 px-4 py-2 text-ink shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-6 sm:py-3"
            style={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
          >
            <span className="font-display text-3xl font-semibold leading-none sm:text-5xl lg:text-6xl">
              Agenda viva. Operacion clara.
            </span>
          </div>

          <p className="landing-hero-reveal mt-8 max-w-2xl text-base leading-8 text-cream/76 sm:text-lg lg:text-xl">
            Reservas online, equipo, disponibilidad, clientes y metricas en una experiencia visual que se siente tan cuidada como tu barberia.
          </p>

          <div className="landing-hero-reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="landing-cta-pop w-full px-7 sm:w-auto" size="xl" variant="gold">
                Empezar ahora
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#showcase">
              <Button className="landing-cta-outline w-full px-7 sm:w-auto" size="xl" variant="outline">
                Ver experiencia
                <Sparkles size={18} />
              </Button>
            </a>
          </div>

          <div className="landing-hero-reveal mt-9 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            <HeroMetric icon={<CalendarDays size={17} />} label="Citas" value="12K+" />
            <HeroMetric icon={<Scissors size={17} />} label="Setup" value="<10m" />
            <HeroMetric icon={<TrendingUp size={17} />} label="Roles" value="3" />
          </div>
        </div>

        <div className="relative hidden min-h-[36rem] lg:block">
          <div className="landing-hero-orbit absolute right-[8%] top-0 w-[36%] overflow-hidden rounded-[30px] border border-white/12 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
            <img alt="Gestion de citas Barber Flow" className="h-full w-full object-cover" src={landingMediaGroups.productShots.intro} />
          </div>

          <div className="landing-hero-orbit absolute bottom-[4%] right-[28%] w-[34%] overflow-hidden rounded-[30px] border border-gold-500/20 bg-ink-soft shadow-[0_34px_100px_rgba(0,0,0,0.58)]">
            <video
              autoPlay
              className="aspect-[9/14] w-full object-cover"
              loop
              muted
              playsInline
              poster={landingMediaGroups.reels[1].poster}
            >
              <source src={landingMediaGroups.reels[1].video} type="video/mp4" />
            </video>
          </div>

          <div className="landing-hero-orbit absolute left-[3%] top-[16%] w-[48%] overflow-hidden rounded-[34px] border border-white/10 bg-[#141210]/88 p-4 shadow-[0_34px_110px_rgba(0,0,0,0.52)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[26px] border border-white/8">
              <img alt="Dashboard Barber Flow" className="h-72 w-full object-cover object-center" src={landingMediaGroups.productShots.client} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                ['Hoy', '28'],
                ['Ingreso', '$1.2M'],
                ['Equipo', '6'],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3" key={label}>
                  <p className="numeric text-lg font-semibold text-cream">{value}</p>
                  <p className="eyebrow mt-1 text-[0.58rem] text-cream/42">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-orbit absolute bottom-[12%] right-[2%] rounded-full border border-white/10 bg-cream px-5 py-3 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
            <p className="eyebrow text-[0.65rem] text-ink/60">Reserva confirmada</p>
            <p className="numeric mt-1 text-lg font-semibold">10:30 AM</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-cream/42 md:flex">
        <span className="h-px w-10 bg-gold-500/50" />
        <span className="eyebrow text-[0.62rem]">Scroll</span>
        <span className="h-px w-10 bg-gold-500/50" />
      </div>
    </section>
  );
}

function HeroMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.055] px-4 py-4 backdrop-blur-xl">
      <div className="text-gold-300">{icon}</div>
      <p className="numeric mt-4 text-2xl font-semibold text-cream sm:text-3xl">{value}</p>
      <p className="eyebrow mt-1 text-[0.62rem] text-cream/45">{label}</p>
    </div>
  );
}
