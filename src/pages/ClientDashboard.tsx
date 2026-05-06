import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, Store, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { bookingService } from '@/features/booking/bookingService';
import { useCitas } from '@/features/booking/hooks/useCitas';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { CitaConDetalles } from '@/types/supabase.types';

export function ClientDashboard() {
  const { role, user } = useAuth();
  const { cancelarCita, historialCitas, isCancelling, isLoading, proximasCitas } = useCitas(user?.id);
  const barberiasQuery = useQuery({
    queryKey: ['marketplace', 'barberias'],
    queryFn: bookingService.getBarberias,
  });

  async function handleDeleteAccount() {
    if (!window.confirm('Estas seguro de que deseas eliminar tu cuenta? Esta accion no se puede deshacer.')) {
      return;
    }

    try {
      const { authService } = await import('@/features/auth/services/authService');
      await authService.deleteUserAccount();
      window.location.assign('/');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No fue posible eliminar la cuenta.');
    }
  }

  async function handleCancel(cita: CitaConDetalles) {
    if (!window.confirm('Quieres cancelar esta cita?')) return;
    await cancelarCita(cita.cita_id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-steel">Cliente</p>
          <h1 className="text-3xl font-bold text-ink">Mis citas</h1>
        </div>
        {role === 'client' ? (
          <Link to="/crear-barberia">
            <Button variant="secondary"><Store size={18} />Crear mi barberia</Button>
          </Link>
        ) : null}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink"><CalendarPlus size={18} />Barberias disponibles</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(barberiasQuery.data ?? []).map((barberia) => (
            <article className="rounded-md border border-slate-100 bg-slate-50 p-4" key={barberia.id}>
              <h3 className="font-semibold text-ink">{barberia.nombre}</h3>
              <p className="mt-1 text-sm text-slate-500">{barberia.direccion}, {barberia.ciudad}</p>
              <Link className="mt-3 inline-block" to={`/booking/${barberia.id}`}>
                <Button size="sm">Agendar</Button>
              </Link>
            </article>
          ))}
          {!barberiasQuery.isLoading && !(barberiasQuery.data ?? []).length ? <p className="text-sm text-slate-500">No hay barberias disponibles aun.</p> : null}
        </div>
      </section>

      <CitasSection citas={proximasCitas} isCancelling={isCancelling} isLoading={isLoading} onCancel={handleCancel} title="Proximas citas" />
      <CitasSection citas={historialCitas} isCancelling={isCancelling} isLoading={isLoading} onCancel={handleCancel} title="Historial" />

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="font-semibold text-red-900">Eliminar cuenta</h2>
        <p className="mt-2 text-sm text-red-800">Esto elimina tu usuario de Supabase Auth y tus datos asociados. Luego puedes registrarte otra vez.</p>
        <Button className="mt-4" onClick={() => void handleDeleteAccount()} variant="secondary">
          <Trash2 size={18} />
          Eliminar mi cuenta
        </Button>
      </section>
    </div>
  );
}

function CitasSection({ citas, isCancelling, isLoading, onCancel, title }: { title: string; citas: CitaConDetalles[]; isLoading: boolean; isCancelling: boolean; onCancel: (cita: CitaConDetalles) => Promise<void> }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
      {isLoading ? <p className="text-sm text-slate-500">Cargando citas...</p> : null}
      <div className="divide-y divide-slate-100">
        {citas.map((cita) => (
          <article className="grid gap-3 py-4 lg:grid-cols-[1.2fr_1fr_1fr_auto]" key={cita.cita_id}>
            <div>
              <strong className="text-ink">{cita.nombre_barberia}</strong>
              <p className="text-sm text-slate-500">{cita.nombre_servicio} con {cita.nombre_barbero}</p>
            </div>
            <span className="text-sm text-slate-600">{cita.fecha} · {cita.hora_inicio.slice(0, 5)} - {cita.hora_fin.slice(0, 5)}</span>
            <span className="capitalize text-sm text-slate-600">{cita.estado}</span>
            {cita.estado === 'pendiente' ? (
              <Button disabled={isCancelling} onClick={() => void onCancel(cita)} size="sm" variant="secondary">Cancelar</Button>
            ) : null}
          </article>
        ))}
        {!isLoading && !citas.length ? <p className="text-sm text-slate-500">No hay citas para mostrar.</p> : null}
      </div>
    </section>
  );
}
