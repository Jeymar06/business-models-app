import { ArrowRight, CalendarDays, Crown, Scissors, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { barberHeroImage } from '@/features/home/heroImage';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" id="inicio">
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-[position:center_right]"
        style={{ backgroundImage: `url(${barberHeroImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.96)_0%,rgba(11,11,11,0.82)_38%,rgba(11,11,11,0.56)_64%,rgba(11,11,11,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_18%)]" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1200px] gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="max-w-2xl space-y-6 animate-fade-up">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
            <Crown size={14} />
            Sistema premium para barberias modernas
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.22em] text-gold">BARBER FLOW</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Reserva, opera y haz crecer tu barberia con una sola plataforma.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#C9C9C9] sm:text-lg">
              Barber Flow une reservas online, gestion de barberos, servicios, horarios, clientes y metricas en una experiencia elegante para barberias modernas.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="w-full sm:w-auto" size="lg">
                Empezar ahora
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#planes">
              <Button className="w-full sm:w-auto" size="lg" variant="outline">
                Ver planes
              </Button>
            </a>
          </div>

          <p className="text-sm leading-6 text-white/54">Sin hojas de calculo. Sin caos. Todo en Barber Flow.</p>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-fade-up lg:justify-self-end">
          <div className="landing-dashboard-frame rounded-[32px] border border-white/10 bg-[#111111]/90 p-4 shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between rounded-[24px] border border-white/8 bg-[#171717] px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Dashboard</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Operacion de hoy</h2>
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

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="landing-float-soft rounded-[28px] border border-white/8 bg-[#171717] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Agenda</p>
                <div className="mt-4 space-y-3">
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

              <div className="grid gap-3">
                <div className="landing-float-delayed rounded-[28px] border border-white/8 bg-[#171717] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Clientes</p>
                  <p className="mt-3 text-3xl font-semibold text-white">+312</p>
                  <p className="mt-2 text-sm leading-6 text-white/56">Historial, seguimiento y experiencia clara desde la reserva.</p>
                </div>
                <div className="rounded-[28px] border border-gold/16 bg-[linear-gradient(180deg,rgba(23,23,23,0.98),rgba(17,17,17,0.98))] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Proyeccion</p>
                  <p className="mt-3 text-lg font-semibold text-white">Menos friccion para operar. Mas claridad para crecer.</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="landing-gold-flow h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#D4AF37,#E8C766)]" />
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