import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, Store, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
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
    <div className="space-y-6 animate-fade-up">
      <section className="surface-panel-dark rounded-[32px] px-6 py-7 text-white sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">CLIENTE</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Marketplace y citas</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">Explora barberías, agenda rápido y administra tu historial desde una misma vista.</p>
          </div>
          {role === 'client' ? (
            <Link to="/crear-barberia">
              <Button variant="outline"><Store size={18} />Crear mi barberia</Button>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Marketplace</p>
            <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold text-ink"><CalendarPlus size={20} />Barberias disponibles</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(barberiasQuery.data ?? []).map((barberia) => (
            <article className="surface-panel overflow-hidden rounded-[24px] p-0" key={barberia.id}>
              <div className="surface-panel-dark px-5 py-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Barberia</p>
                    <h3 className="mt-2 text-xl font-semibold">{barberia.nombre}</h3>
                  </div>
                  <Badge variant="confirmed">Activa</Badge>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm leading-6 text-slate-500">{barberia.direccion}, {barberia.ciudad}</p>
                <Link to={`/booking/${barberia.id}`}>
                  <Button className="w-full" size="sm">Agendar</Button>
                </Link>
              </div>
            </article>
          ))}
          {!barberiasQuery.isLoading && !(barberiasQuery.data ?? []).length ? <p className="text-sm text-slate-500">No hay barberias disponibles aun.</p> : null}
        </div>
      </section>

      <CitasSection citas={proximasCitas} isCancelling={isCancelling} isLoading={isLoading} onCancel={handleCancel} title="Proximas citas" />
      <CitasSection citas={historialCitas} isCancelling={isCancelling} isLoading={isLoading} onCancel={handleCancel} title="Historial" />

      <section className="rounded-[28px] border border-danger/20 bg-danger/10 p-5">
        <h2 className="font-semibold text-danger">Eliminar cuenta</h2>
        <p className="mt-2 text-sm leading-7 text-red-800">Esto elimina tu usuario de Supabase Auth y tus datos asociados. Luego puedes registrarte otra vez.</p>
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
    <section className="surface-panel rounded-[28px] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Agenda</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
        </div>
      </div>
      {isLoading ? <p className="text-sm text-slate-500">Cargando citas...</p> : null}
      <div className="space-y-3">
        {citas.map((cita) => (
          <article className="rounded-[24px] border border-black/6 bg-black/3 p-4" key={cita.cita_id}>
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
              <div>
                <strong className="text-ink">{cita.nombre_barberia}</strong>
                <p className="mt-1 text-sm text-slate-500">{cita.nombre_servicio} con {cita.nombre_barbero}</p>
              </div>
              <span className="text-sm text-slate-600">{cita.fecha} · {cita.hora_inicio.slice(0, 5)} - {cita.hora_fin.slice(0, 5)}</span>
              <Badge variant={badgeVariantForStatus(cita.estado)}>{cita.estado}</Badge>
              {cita.estado === 'pendiente' ? (
                <Button disabled={isCancelling} onClick={() => void onCancel(cita)} size="sm" variant="secondary">Cancelar</Button>
              ) : null}
            </div>
          </article>
        ))}
        {!isLoading && !citas.length ? <p className="text-sm text-slate-500">No hay citas para mostrar.</p> : null}
      </div>
    </section>
  );
}

function badgeVariantForStatus(status: string) {
  if (status === 'pendiente') return 'pending';
  if (status === 'confirmada') return 'confirmed';
  if (status === 'cancelada') return 'cancelled';
  if (status === 'completada') return 'completed';
  return 'neutral';
}
