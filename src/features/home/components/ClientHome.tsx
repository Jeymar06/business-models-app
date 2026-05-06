import { CalendarDays, CircleHelp, Clock3, PlusSquare, UserCircle2 } from 'lucide-react';

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
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
        <p className="text-sm font-medium text-steel">Inicio</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Hola, {userName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Listo para tu proximo corte?</p>
      </section>

      <UpcomingAppointmentCard appointment={data.nextAppointment} />

      <section className="grid gap-4 md:grid-cols-3">
        <HomeMetricCard hint="Pendientes o confirmadas" icon={<CalendarDays size={18} />} label="Mis citas" value={data.appointmentStats.upcoming} />
        <HomeMetricCard hint="Servicios que ya finalizaste" icon={<Clock3 size={18} />} label="Completadas" value={data.appointmentStats.completed} />
        <HomeMetricCard hint="Citas anuladas por ahora" icon={<CircleHelp size={18} />} label="Canceladas" value={data.appointmentStats.cancelled} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-steel">Explorar</p>
            <h2 className="text-2xl font-semibold text-ink">Barberias disponibles</h2>
          </div>
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

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-steel">Resumen</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Mis citas</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Consulta rapidamente el estado general de tu historial y entra al panel para ver el detalle completo.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryPill label="Proximas" value={data.appointmentStats.upcoming} />
            <SummaryPill label="Completadas" value={data.appointmentStats.completed} />
            <SummaryPill label="Canceladas" value={data.appointmentStats.cancelled} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-steel">Expandir negocio</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Eres dueno de una barberia?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Crea tu barberia y empieza a gestionar reservas desde tu misma cuenta.</p>
          <div className="mt-5">
            <a className="inline-flex" href="/crear-barberia">
              <span className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-sm font-medium text-white transition hover:bg-slate-800">Crear mi barberia</span>
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium text-steel">Acciones rapidas</p>
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

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
