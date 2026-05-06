import { CalendarClock, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import type { CitaConDetalles } from '@/types/supabase.types';

export function UpcomingAppointmentCard({ appointment }: { appointment: CitaConDetalles | null }) {
  if (!appointment) {
    return (
      <EmptyState
        actionLabel="Agendar ahora"
        actionTo="/client-dashboard"
        description="Explora barberias disponibles y reserva tu siguiente horario en minutos."
        title="No tienes citas proximas"
      />
    );
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-steel">Proxima cita</p>
            <h3 className="text-2xl font-semibold text-ink">{appointment.nombre_barberia}</h3>
          </div>

          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <InfoRow icon={<CalendarClock size={16} />} text={appointment.fecha} />
            <InfoRow icon={<Clock3 size={16} />} text={`${appointment.hora_inicio.slice(0, 5)} - ${appointment.hora_fin.slice(0, 5)}`} />
            <InfoRow icon={<MapPin size={16} />} text={`${appointment.nombre_servicio} con ${appointment.nombre_barbero}`} />
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {appointment.estado}
            </span>
          </div>
        </div>

        <Link to="/client-dashboard">
          <Button size="sm" variant="secondary">Ver mis citas</Button>
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-steel">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
