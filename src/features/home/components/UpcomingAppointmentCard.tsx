import { CalendarClock, Clock3, Scissors, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button, Pill } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import type { CitaConDetalles } from '@/types/supabase.types';

export function UpcomingAppointmentCard({ appointment }: { appointment: CitaConDetalles | null }) {
  if (!appointment) {
    return (
      <EmptyState
        actionLabel="Agendar ahora"
        actionTo="/client-dashboard"
        description="Explora barberías disponibles y reserva tu siguiente horario en minutos."
        title="No tienes citas próximas"
      />
    );
  }

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] p-6 text-cream shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_30%)]"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={badgeVariantForStatus(appointment.estado)}>{appointment.estado}</Badge>
            <Pill tone="gold">Próxima cita</Pill>
          </div>

          <div>
            <h3 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              {appointment.nombre_barberia}
            </h3>
            <p className="mt-2 text-sm leading-7 text-cream/68">
              {appointment.nombre_servicio} con <span className="text-cream">{appointment.nombre_barbero}</span>
            </p>
          </div>

          <div className="grid gap-3 text-sm text-cream/75 sm:grid-cols-2">
            <InfoRow icon={<CalendarClock size={16} />} text={appointment.fecha} />
            <InfoRow
              icon={<Clock3 size={16} />}
              text={`${appointment.hora_inicio.slice(0, 5)} – ${appointment.hora_fin.slice(0, 5)}`}
            />
            <InfoRow icon={<UserRound size={16} />} text={appointment.nombre_barbero} />
            <InfoRow icon={<Scissors size={16} />} text={appointment.nombre_servicio} />
          </div>
        </div>

        <Link className="w-full lg:w-auto" to="/client-dashboard">
          <Button className="w-full lg:w-auto" size="md" variant="outline">
            Ver mis citas
          </Button>
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-3 py-2.5">
      <span className="text-gold-300">{icon}</span>
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
