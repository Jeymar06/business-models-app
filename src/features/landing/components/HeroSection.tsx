import { ArrowRight, CalendarDays, Crown, Scissors, TrendingUp, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button, Pill } from '@/components/ui';
import { barberHeroImage } from '@/features/home/heroImage';
import { landingMediaGroups } from '@/features/landing/data/landingMedia';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" id="inicio">
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-[position:center_right]"
        style={{ backgroundImage: `url(${barberHeroImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.97)_0%,rgba(10,9,8,0.86)_38%,rgba(10,9,8,0.58)_64%,rgba(10,9,8,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_18%)]" />

      <div className="relative grid min-h-[calc(100svh-5rem)] w-full gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-12 lg:py-12 xl:px-16">
        <div className="max-w-2xl space-y-8 animate-fade-up lg:pl-2">
          <Pill icon={<Crown size={12} />} tone="gold">
            Sistema editorial para barberías modernas
          </Pill>

          <div className="space-y-5">
            <p className="eyebrow text-gold-300">Barber Flow · Edición 2026</p>
            <h1 className="font-display max-w-3xl text-[2.6rem] font-semibold leading-[0.96] text-cream sm:text-6xl lg:text-[5.2rem]">
              Reserva, opera{' '}
              <span className="font-display-italic text-gold-200">y haz crecer</span>{' '}
              tu barbería desde un solo flujo.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-cream/72">
              Una plataforma <em className="not-italic text-gold-200">elegante, ordenada y editorial</em> para barberías modernas: reservas online, gestión de equipo, servicios, horarios, clientes y métricas en una sola experiencia.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="landing-cta-pop w-full px-7 sm:w-auto" size="xl" variant="gold">
                Empezar ahora
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#planes">
              <Button className="landing-cta-outline w-full px-7 sm:w-auto" size="xl" variant="outline">
                Ver planes
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
            <HeroStat label="Reservas operadas" value="12K+" />
            <span className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
            <HeroStat label="Tiempo configuración" value="<10 min" />
            <span className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
            <HeroStat label="Roles incluidos" value="3" />
          </div>

          <p className="text-sm leading-6 text-cream/48">Sin hojas de cálculo. Sin caos. Todo en Barber Flow.</p>
        </div>

        <div className="relative mx-auto w-full max-w-[980px] animate-fade-up">
          <div className="landing-dashboard-frame relative overflow-hidden rounded-[36px] border border-white/10 bg-ink-soft/92 p-4 shadow-[0_36px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_28%)]" />

            <div className="relative rounded-[28px] border border-white/8 bg-[#171411]/96 px-5 py-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="eyebrow text-cream/40">Dashboard</p>
                  <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-cream">Operación de hoy</h2>
                </div>
                <Pill tone="gold">Activo</Pill>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MockMetric icon={<CalendarDays size={16} />} label="Reservas hoy" value="28" />
                <MockMetric icon={<Scissors size={16} />} label="Barberos activos" value="6" />
                <MockMetric icon={<TrendingUp size={16} />} label="Ingreso estimado" value="$1.2M" />
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[24px] border border-white/8 bg-[#100E0C]/82 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="eyebrow text-cream/42">Agenda</p>
                    <span className="eyebrow text-cream/36">Hoy</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      ['09:00', 'Fade clásico', 'Carlos M.'],
                      ['10:30', 'Barba + corte', 'Andrés R.'],
                      ['12:00', 'Corte premium', 'Julián S.'],
                    ].map(([time, service, client]) => (
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3" key={`${time}-${client}`}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-cream">{service}</p>
                            <p className="mt-1 text-xs text-cream/48">{client}</p>
                          </div>
                          <span className="numeric text-sm font-semibold text-gold-200">{time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-white/8 bg-[#100E0C]/82 p-4">
                    <div className="flex items-center gap-2 text-gold-300">
                      <Users size={16} />
                      <p className="eyebrow text-cream/42">Clientes</p>
                    </div>
                    <p className="font-display numeric mt-4 text-4xl font-semibold tracking-tight text-cream">+312</p>
                    <p className="mt-2 text-sm leading-6 text-cream/56">
                      Historial, seguimiento y experiencia clara desde la reserva.
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-[24px] border border-gold-500/16 bg-[linear-gradient(180deg,rgba(33,29,25,1),rgba(20,18,16,1))]">
                    <HeroRailVideo poster={landingMediaGroups.features.poster} src={landingMediaGroups.features.video} />
                    <div className="px-4 py-4">
                      <p className="eyebrow text-gold-300">Proyección</p>
                      <p className="font-display mt-3 text-lg font-semibold tracking-tight text-cream">
                        Menos fricción para operar.<br/>Más claridad para crecer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display numeric text-2xl font-semibold tracking-tight text-cream sm:text-3xl">{value}</span>
      <span className="eyebrow mt-1 text-cream/45">{label}</span>
    </div>
  );
}

function HeroRailVideo({ poster, src }: { poster: string; src: string }) {
  return (
    <video autoPlay className="h-32 w-full object-cover object-center" loop muted playsInline poster={poster}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

function MockMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#171411] px-4 py-4">
      <div className="flex items-center gap-2 text-gold-300">{icon}</div>
      <p className="font-display numeric mt-4 text-2xl font-semibold tracking-tight text-cream">{value}</p>
      <p className="eyebrow mt-1 text-cream/42">{label}</p>
    </div>
  );
}
