import { CalendarClock, Clock3, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
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
    <article className="surface-panel-dark overflow-hidden rounded-[30px] p-5 text-white sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={badgeVariantForStatus(appointment.estado)}>{appointment.estado}</Badge>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Proxima cita</span>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white sm:text-3xl">{appointment.nombre_barberia}</h3>
            <p className="mt-2 text-sm leading-6 text-white/62">{appointment.nombre_servicio} con {appointment.nombre_barbero}</p>
          </div>

          <div className="grid gap-3 text-sm text-white/72 sm:grid-cols-2">
            <InfoRow icon={<CalendarClock size={16} />} text={appointment.fecha} />
            <InfoRow icon={<Clock3 size={16} />} text={`${appointment.hora_inicio.slice(0, 5)} - ${appointment.hora_fin.slice(0, 5)}`} />
            <InfoRow icon={<MapPin size={16} />} text={appointment.nombre_barbero} />
            <InfoRow icon={<MapPin size={16} />} text={appointment.nombre_servicio} />
          </div>
        </div>

        <Link className="w-full lg:w-auto" to="/client-dashboard">
          <Button className="w-full lg:w-auto" size="sm" variant="outline">
            Ver mis citas
          </Button>
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5">
      <span className="text-gold">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function badgeVariantForStatus(status: string) {
  if (status === 'pendiente') return 'pending';
  if (status === 'confirmada') return 'confirmed';
  if (status === 'cancelada') return 'cancelled';
  if (status === 'completada') return 'completed';
  return 'neutral';
}
