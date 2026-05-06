import { CalendarPlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { bookingService } from '@/features/booking/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Cita } from '@/types/supabase.types';

export function ClientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void bookingService.getClientAppointments(user.id).then(setAppointments);
  }, [user]);

  async function handleDeleteAccount() {
    if (!window.confirm('Estas seguro de que deseas eliminar tu cuenta? Esta accion no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const { authService } = await import('@/features/auth/services/authService');
      await authService.deleteUserAccount();
      window.location.assign('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible eliminar la cuenta.');
      setIsDeleting(false);
    }
  }

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

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="font-semibold text-red-900">Eliminar cuenta</h2>
        <p className="mt-2 text-sm text-red-800">
          Esto elimina tu usuario de Supabase Auth y tus datos asociados. Luego puedes registrarte otra vez con el mismo Google u otra cuenta.
        </p>
        {message ? <p className="mt-3 text-sm text-red-700">{message}</p> : null}
        <Button className="mt-4" disabled={isDeleting} onClick={handleDeleteAccount} variant="secondary">
          <Trash2 size={18} />
          {isDeleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
        </Button>
      </section>
    </div>
  );
}
