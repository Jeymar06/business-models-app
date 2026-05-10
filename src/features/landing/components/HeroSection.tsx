import { ArrowRight, CalendarDays, Crown, Scissors, TrendingUp, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { barberHeroImage } from '@/features/home/heroImage';
import { landingMediaGroups } from '@/features/landing/data/landingMedia';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" id="inicio">
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-[position:center_right]"
        style={{ backgroundImage: `url(${barberHeroImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.96)_0%,rgba(11,11,11,0.82)_38%,rgba(11,11,11,0.56)_64%,rgba(11,11,11,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_18%)]" />

      <div className="relative grid min-h-[calc(100svh-4rem)] w-full gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10 lg:py-10 xl:px-12">
        <div className="max-w-2xl space-y-7 animate-fade-up lg:pl-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
            <Crown size={14} />
            Sistema premium para barberias modernas
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.22em] text-gold">BARBER FLOW</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.94] text-white sm:text-6xl lg:text-7xl">
              Reserva, opera y haz crecer tu barberia con una sola plataforma.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#C9C9C9]">
              Barber Flow une reservas online, gestion de barberos, servicios, horarios, clientes y metricas en una experiencia elegante para barberias modernas.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/register">
              <Button className="landing-cta-pop w-full px-7 text-lg sm:w-auto" size="lg">
                Empezar ahora
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#planes">
              <Button className="landing-cta-outline w-full px-7 text-lg sm:w-auto" size="lg" variant="outline">
                Ver planes
              </Button>
            </a>
          </div>

          <p className="text-sm leading-6 text-white/54">Sin hojas de calculo. Sin caos. Todo en Barber Flow.</p>
        </div>

        <div className="relative mx-auto w-full max-w-[980px] animate-fade-up">
            <div className="landing-dashboard-frame relative overflow-hidden rounded-[34px] border border-white/10 bg-[#111111]/92 p-4 shadow-[0_36px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_24%)]" />

              <div className="relative rounded-[26px] border border-white/8 bg-[#171717]/96 px-5 py-5 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Dashboard</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Operacion de hoy</h2>
                  </div>
                  <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Activo
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MockMetric icon={<CalendarDays size={16} />} label="Reservas hoy" value="28" />
                  <MockMetric icon={<Scissors size={16} />} label="Barberos activos" value="6" />
                  <MockMetric icon={<TrendingUp size={16} />} label="Ingreso estimado" value="$1.2M" />
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-[22px] border border-white/8 bg-[#111111]/78 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Agenda</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Hoy</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['09:00', 'Fade clasico', 'Carlos M.'],
                        ['10:30', 'Barba + corte', 'Andres R.'],
                        ['12:00', 'Corte premium', 'Julian S.'],
                      ].map(([time, service, client]) => (
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3" key={`${time}-${client}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-white">{service}</p>
                              <p className="mt-1 text-xs text-white/48">{client}</p>
                            </div>
                            <span className="text-sm font-semibold text-gold">{time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[22px] border border-white/8 bg-[#111111]/78 p-4">
                      <div className="flex items-center gap-2 text-gold">
                        <Users size={16} />
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Clientes</p>
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-white">+312</p>
                      <p className="mt-2 text-sm leading-6 text-white/56">
                        Historial, seguimiento y experiencia clara desde la reserva.
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-[22px] border border-gold/16 bg-[linear-gradient(180deg,rgba(23,23,23,0.98),rgba(17,17,17,0.98))]">
                      <HeroRailVideo poster={landingMediaGroups.features.poster} src={landingMediaGroups.features.video} />
                      <div className="px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Proyeccion</p>
                        <p className="mt-3 text-lg font-semibold text-white">
                          Menos friccion para operar. Mas claridad para crecer.
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

function HeroRailVideo({ poster, src }: { poster: string; src: string }) {
  return (
    <video autoPlay className="h-32 w-full object-cover object-center" loop muted playsInline poster={poster}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

function MockMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-[#171717] px-4 py-4">
      <div className="flex items-center gap-2 text-gold">{icon}</div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/42">{label}</p>
    </div>
  );
}
