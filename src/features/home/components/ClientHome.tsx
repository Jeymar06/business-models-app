import { CalendarDays, CircleHelp, Clock3, PlusSquare, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
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
    <div className="space-y-8 animate-fade-up">
      <section className="surface-panel-dark relative overflow-hidden rounded-[32px] px-6 py-7 text-white sm:px-8 sm:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_22%),radial-gradient(circle_at_left_center,rgba(212,175,55,0.16),transparent_20%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">INICIO CLIENTE</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Hola, {userName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
              Tu siguiente corte, tus citas y las barberias disponibles en una vista clara y lista para moverse contigo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroStat label="Proximas" value={data.appointmentStats.upcoming} />
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

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-steel">EXPLORAR</p>
            <h2 className="text-2xl font-semibold text-ink">Barberias disponibles</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-500">
            Descubre barberias activas y entra directo al flujo de reserva.
          </p>
        </div>

        {data.availableBarberias.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {data.availableBarberias.map((barberia) => (
              <BarberiaMiniCard barberia={barberia} key={barberia.id} />
            ))}
          </div>
        ) : (
          <EmptyState description="Todavia no hay barberias activas para reservar. Vuelve mas tarde o crea la tuya si eres dueno." title="Sin barberias por ahora" />
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-panel rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Resumen</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Tus citas de un vistazo</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Revisa rapidamente el estado de tu historial y entra al panel cuando quieras ver el detalle completo.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryPill label="Proximas" value={data.appointmentStats.upcoming} />
            <SummaryPill label="Completadas" value={data.appointmentStats.completed} />
            <SummaryPill label="Canceladas" value={data.appointmentStats.cancelled} />
          </div>
        </div>

        <div className="surface-panel-dark rounded-[28px] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Expandir negocio</p>
          <h2 className="mt-3 text-2xl font-semibold">Tambien gestionas una barberia?</h2>
          <p className="mt-3 text-sm leading-7 text-white/68">
            Crea tu barberia y administra reservas desde la misma cuenta con una experiencia consistente.
          </p>
          <div className="mt-6">
            <Link to="/crear-barberia">
              <Button className="w-full sm:w-auto" size="sm">
                Crear mi barberia
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">ACCIONES RAPIDAS</p>
          <h2 className="text-2xl font-semibold text-ink">Atajos utiles para hoy</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard description="Explora barberias y reserva tu siguiente cita." icon={<CalendarDays size={18} />} title="Agendar cita" to="/client-dashboard" />
          <QuickActionCard description="Consulta, cancela o revisa tu historial completo." icon={<Clock3 size={18} />} title="Mis citas" to="/client-dashboard" />
          <QuickActionCard description="Revisa tu informacion de cuenta y acceso." icon={<UserCircle2 size={18} />} title="Mi perfil" to="/profile" />
          <QuickActionCard description="Encuentra ayuda sobre tu cuenta o reservas." icon={<PlusSquare size={18} />} title="Ayuda" to="/support" />
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/48">{label}</p>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-black/4 px-4 py-4 text-center">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}
