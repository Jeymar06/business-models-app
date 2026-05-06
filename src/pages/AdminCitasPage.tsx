import { format } from 'date-fns';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { useBarberia } from '@/features/admin/barberia/hooks/useBarberia';
import { useBarberos } from '@/features/admin/barberos/hooks/useBarberos';
import { useAdminCitas } from '@/features/admin/hooks/useAdminCitas';
import type { AppointmentStatus, CitaConDetalles } from '@/types/supabase.types';

export function AdminCitasPage() {
  const { barberia, isLoading: isBarberiaLoading } = useBarberia();
  const { barberos } = useBarberos(barberia?.id);
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<AppointmentStatus | 'todas'>('todas');
  const [barberoId, setBarberoId] = useState('');
  const { cancelarCita, citas, completarCita, confirmarCita, isLoading, isUpdating } = useAdminCitas(barberia?.id, {
    fecha: fecha || undefined,
    estado,
    barberoId: barberoId || undefined,
  });

  if (isBarberiaLoading) return <PanelState title="Cargando citas" text="Estamos leyendo la barberia asociada a tu usuario." />;
  if (!barberia) return <PanelState title="Sin barberia" text="Crea tu barberia antes de gestionar citas." />;

  return (
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-steel">Agenda</p>
          <h1 className="text-2xl font-bold text-ink">Citas de {barberia.nombre}</h1>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="h-10 rounded-md border border-slate-200 px-3 text-sm" onChange={(event) => setFecha(event.target.value)} type="date" value={fecha} />
          <select className="h-10 rounded-md border border-slate-200 px-3 text-sm" onChange={(event) => setEstado(event.target.value as AppointmentStatus | 'todas')} value={estado}>
            <option value="todas">Todas</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <select className="h-10 rounded-md border border-slate-200 px-3 text-sm" onChange={(event) => setBarberoId(event.target.value)} value={barberoId}>
            <option value="">Todos los barberos</option>
            {barberos.map((barbero) => <option key={barbero.id} value={barbero.id}>{barbero.nombre}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? <PanelState title="Cargando" text="Buscando citas..." /> : <CitasTable citas={citas} isUpdating={isUpdating} onCancelar={cancelarCita} onCompletar={completarCita} onConfirmar={confirmarCita} />}
    </section>
  );
}

function CitasTable({ citas, isUpdating, onCancelar, onCompletar, onConfirmar }: { citas: CitaConDetalles[]; isUpdating: boolean; onConfirmar: (id: string) => Promise<unknown>; onCompletar: (id: string) => Promise<unknown>; onCancelar: (id: string) => Promise<unknown> }) {
  if (!citas.length) return <PanelState title="Sin citas" text="No hay citas con esos filtros." />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="text-left text-slate-500">
          <tr>
            <th className="py-3 pr-4">Cliente</th>
            <th className="py-3 pr-4">Servicio</th>
            <th className="py-3 pr-4">Barbero</th>
            <th className="py-3 pr-4">Fecha</th>
            <th className="py-3 pr-4">Estado</th>
            <th className="py-3 pr-4">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {citas.map((cita) => (
            <tr key={cita.cita_id}>
              <td className="py-3 pr-4 font-medium text-ink">{cita.nombre_cliente || cita.email_cliente}</td>
              <td className="py-3 pr-4">{cita.nombre_servicio}</td>
              <td className="py-3 pr-4">{cita.nombre_barbero}</td>
              <td className="py-3 pr-4">{format(new Date(`${cita.fecha}T00:00:00`), 'yyyy-MM-dd')} {cita.hora_inicio.slice(0, 5)}</td>
              <td className="py-3 pr-4"><EstadoBadge estado={cita.estado} /></td>
              <td className="flex flex-wrap gap-2 py-3 pr-4">
                {cita.estado === 'pendiente' ? <Button disabled={isUpdating} onClick={() => void onConfirmar(cita.cita_id)} size="sm">Confirmar</Button> : null}
                {cita.estado === 'confirmada' ? <Button disabled={isUpdating} onClick={() => void onCompletar(cita.cita_id)} size="sm">Completar</Button> : null}
                {cita.estado !== 'cancelada' && cita.estado !== 'completada' ? <Button disabled={isUpdating} onClick={() => void onCancelar(cita.cita_id)} size="sm" variant="secondary">Cancelar</Button> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: AppointmentStatus }) {
  const colors: Record<AppointmentStatus, string> = {
    cancelada: 'bg-red-50 text-red-700',
    completada: 'bg-slate-100 text-slate-600',
    confirmada: 'bg-mint/10 text-ink',
    pendiente: 'bg-yellow-50 text-yellow-700',
  };
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[estado]}`}>{estado}</span>;
}

function PanelState({ text, title }: { title: string; text: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-5">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}
