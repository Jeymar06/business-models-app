import { CalendarDays, CircleHelp, Clock3, PlusSquare, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button, Pill } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import { BarberiaMiniCard } from '@/features/home/components/BarberiaMiniCard';
import { HomeMetricCard } from '@/features/home/components/HomeMetricCard';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import { UpcomingAppointmentCard } from '@/features/home/components/UpcomingAppointmentCard';
import type { ClientHomeData } from '@/features/home/homeService';
import type { Profile } from '@/types/supabase.types';

export function ClientHome({ data, profile }: { data: ClientHomeData; profile: Profile | null }) {
  const userName = profile?.full_name?.trim() || profile?.email || 'cliente';

  return (
    <div className="space-y-10 animate-fade-up">
      <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] px-7 py-9 text-cream shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_24%),radial-gradient(circle_at_left_center,rgba(232,199,102,0.08),transparent_22%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Pill tone="gold">Inicio cliente</Pill>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
              Hola, <span className="font-display-italic text-gold-200">{userName}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cream/70">
              Tu siguiente corte, tus citas y las barberías disponibles en una vista clara, lista para moverse contigo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroStat label="Próximas" value={data.appointmentStats.upcoming} />
            <HeroStat label="Completadas" value={data.appointmentStats.completed} />
            <HeroStat label="Canceladas" value={data.appointmentStats.cancelled} />
          </div>
        </div>
      </section>

      <UpcomingAppointmentCard appointment={data.nextAppointment} />

      <section className="grid gap-4 md:grid-cols-3">
        <HomeMetricCard hint="Pendientes o confirmadas" icon={<CalendarDays size={18} />} label="Mis citas" value={data.appointmentStats.upcoming} />
        <HomeMetricCard hint="Servicios ya finalizados" icon={<Clock3 size={18} />} label="Completadas" value={data.appointmentStats.completed} />
        <HomeMetricCard hint="Citas anuladas por ahora" icon={<CircleHelp size={18} />} label="Canceladas" value={data.appointmentStats.cancelled} />
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="eyebrow text-gold-300">Explorar</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              Barberías <span className="font-display-italic text-gold-200">disponibles.</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-cream/55">
            Descubre barberías activas y entra directo al flujo de reserva.
          </p>
        </div>

        {data.availableBarberias.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {data.availableBarberias.map((barberia) => (
              <BarberiaMiniCard barberia={barberia} key={barberia.id} />
            ))}
          </div>
        ) : (
          <EmptyState description="Todavía no hay barberías activas para reservar. Vuelve más tarde o crea la tuya si eres dueño." title="Sin barberías por ahora" />
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft">
          <p className="eyebrow text-gold-700">Resumen</p>
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Tus citas de un vistazo
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/55">
            Revisa rápidamente el estado de tu historial y entra al panel cuando quieras ver el detalle completo.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryPill label="Próximas" value={data.appointmentStats.upcoming} />
            <SummaryPill label="Completadas" value={data.appointmentStats.completed} />
            <SummaryPill label="Canceladas" value={data.appointmentStats.cancelled} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-gold-500/22 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] p-7 text-cream">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_36%)]" />
          <p className="eyebrow relative text-gold-300">Expandir negocio</p>
          <h2 className="font-display relative mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            ¿También gestionas <span className="font-display-italic text-gold-200">una barbería?</span>
          </h2>
          <p className="relative mt-3 text-sm leading-7 text-cream/68">
            Crea tu barbería y administra reservas desde la misma cuenta con una experiencia consistente.
          </p>
          <div className="relative mt-6">
            <Link to="/crear-barberia">
              <Button className="w-full sm:w-auto" size="md" variant="gold">
                Crear mi barbería
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="eyebrow text-gold-300">Acciones rápidas</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            Atajos útiles <span className="font-display-italic text-gold-200">para hoy.</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard description="Explora barberías y reserva tu siguiente cita." icon={<CalendarDays size={18} />} title="Agendar cita" to="/client-dashboard" />
          <QuickActionCard description="Consulta, cancela o revisa tu historial completo." icon={<Clock3 size={18} />} title="Mis citas" to="/client-dashboard" />
          <QuickActionCard description="Revisa tu información de cuenta y acceso." icon={<UserCircle2 size={18} />} title="Mi perfil" to="/profile" />
          <QuickActionCard description="Encuentra ayuda sobre tu cuenta o reservas." icon={<PlusSquare size={18} />} title="Ayuda" to="/support" />
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 backdrop-blur-sm">
      <p className="font-display numeric text-3xl font-semibold tracking-tight text-cream">{value}</p>
      <p className="eyebrow mt-1 text-cream/48">{label}</p>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-ink/4 px-4 py-5 text-center">
      <p className="font-display numeric text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}
