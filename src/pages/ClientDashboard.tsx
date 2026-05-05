import { CalendarPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { bookingService } from '@/features/booking/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Cita } from '@/types/supabase.types';

export function ClientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Cita[]>([]);

  useEffect(() => {
    if (!user) return;
    void bookingService.getClientAppointments(user.id).then(setAppointments);
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-steel">Cliente</p>
          <h1 className="text-3xl font-bold text-ink">Mis citas</h1>
        </div>
        <Link to="/booking">
          <Button><CalendarPlus size={18} />Agendar cita</Button>
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="divide-y divide-slate-100">
          {appointments.length ? appointments.map((appointment) => (
            <article className="grid gap-1 py-4 sm:grid-cols-4" key={appointment.id}>
              <strong>{appointment.fecha}</strong>
              <span>{appointment.hora.slice(0, 5)}</span>
              <span className="capitalize">{appointment.estado}</span>
              <span className="text-slate-500">{appointment.id.slice(0, 8)}</span>
            </article>
          )) : <p className="text-slate-500">Aun no tienes citas registradas.</p>}
        </div>
      </section>
    </div>
  );
}
