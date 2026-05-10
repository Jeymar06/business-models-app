import { format } from 'date-fns';
import { Filter } from 'lucide-react';
import { useState } from 'react';

import { Badge, Button, Pill, useToast } from '@/components/ui';
import { useBarberia } from '@/features/admin/barberia/hooks/useBarberia';
import { useBarberos } from '@/features/admin/barberos/hooks/useBarberos';
import { useAdminCitas } from '@/features/admin/hooks/useAdminCitas';
import type { AppointmentStatus, CitaConDetalles } from '@/types/supabase.types';

export function AdminCitasPage() {
  const toast = useToast();
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

  if (isBarberiaLoading)
    return <PanelState title="Cargando citas" text="Estamos leyendo la barbería asociada a tu usuario." />;
  if (!barberia)
    return <PanelState title="Sin barbería" text="Crea tu barbería antes de gestionar citas." />;

  async function handle(action: 'confirmar' | 'completar' | 'cancelar', id: string) {
    try {
      if (action === 'confirmar') {
        await confirmarCita(id);
        toast.success('Cita confirmada.');
      } else if (action === 'completar') {
        await completarCita(id);
        toast.success('Cita marcada como completada.');
      } else {
        await cancelarCita(id);
        toast.success('Cita cancelada.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible actualizar la cita.', 'Error');
    }
  }

  return (
    <section className="space-y-6 rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="eyebrow text-gold-700">Agenda</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Citas de {barberia.nombre}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Pill icon={<Filter size={11} />} tone="ink">
            Filtros
          </Pill>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <FilterField label="Fecha">
          <input
            className="h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 hover:border-ink/22 focus:border-gold-500/70 focus:ring-4 focus:ring-gold-200/50"
            onChange={(event) => setFecha(event.target.value)}
            type="date"
            value={fecha}
          />
        </FilterField>
        <FilterField label="Estado">
          <select
            className="h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 hover:border-ink/22 focus:border-gold-500/70 focus:ring-4 focus:ring-gold-200/50"
            onChange={(event) => setEstado(event.target.value as AppointmentStatus | 'todas')}
            value={estado}
          >
            <option value="todas">Todas</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </FilterField>
        <FilterField label="Barbero">
          <select
            className="h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 hover:border-ink/22 focus:border-gold-500/70 focus:ring-4 focus:ring-gold-200/50"
            onChange={(event) => setBarberoId(event.target.value)}
            value={barberoId}
          >
            <option value="">Todos los barberos</option>
            {barberos.map((barbero) => (
              <option key={barbero.id} value={barbero.id}>
                {barbero.nombre}
              </option>
            ))}
          </select>
        </FilterField>
      </div>

      {isLoading ? (
        <PanelState title="Cargando" text="Buscando citas…" />
      ) : (
        <CitasTable
          citas={citas}
          isUpdating={isUpdating}
          onCancelar={(id) => handle('cancelar', id)}
          onCompletar={(id) => handle('completar', id)}
          onConfirmar={(id) => handle('confirmar', id)}
        />
      )}
    </section>
  );
}

function FilterField({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-ink/45">{label}</span>
      {children}
    </label>
  );
}

function CitasTable({
  citas,
  isUpdating,
  onCancelar,
  onCompletar,
  onConfirmar,
}: {
  citas: CitaConDetalles[];
  isUpdating: boolean;
  onConfirmar: (id: string) => void;
  onCompletar: (id: string) => void;
  onCancelar: (id: string) => void;
}) {
  if (!citas.length) return <PanelState title="Sin citas" text="No hay citas con esos filtros." />;

  return (
    <div className="overflow-x-auto rounded-[22px] border border-ink/8">
      <table className="min-w-full divide-y divide-ink/8 text-sm">
        <thead className="bg-ink/3">
          <tr className="text-left">
            <th className="eyebrow px-5 py-4 text-ink/45">Cliente</th>
            <th className="eyebrow px-5 py-4 text-ink/45">Servicio</th>
            <th className="eyebrow px-5 py-4 text-ink/45">Barbero</th>
            <th className="eyebrow px-5 py-4 text-ink/45">Fecha</th>
            <th className="eyebrow px-5 py-4 text-ink/45">Estado</th>
            <th className="eyebrow px-5 py-4 text-ink/45">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/8">
          {citas.map((cita) => (
            <tr className="transition-colors duration-200 hover:bg-gold-500/4" key={cita.cita_id}>
              <td className="px-5 py-4 font-display text-base font-semibold tracking-tight text-ink">
                {cita.nombre_cliente || cita.email_cliente}
              </td>
              <td className="px-5 py-4 text-ink/68">{cita.nombre_servicio}</td>
              <td className="px-5 py-4 text-ink/68">{cita.nombre_barbero}</td>
              <td className="px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-ink/72">{format(new Date(`${cita.fecha}T00:00:00`), 'yyyy-MM-dd')}</span>
                  <span className="numeric text-xs text-gold-700">{cita.hora_inicio.slice(0, 5)}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <Badge variant={badgeVariantForStatus(cita.estado)}>{cita.estado}</Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {cita.estado === 'pendiente' ? (
                    <Button disabled={isUpdating} onClick={() => onConfirmar(cita.cita_id)} size="sm" variant="gold">
                      Confirmar
                    </Button>
                  ) : null}
                  {cita.estado === 'confirmada' ? (
                    <Button disabled={isUpdating} onClick={() => onCompletar(cita.cita_id)} size="sm" variant="primary">
                      Completar
                    </Button>
                  ) : null}
                  {cita.estado !== 'cancelada' && cita.estado !== 'completada' ? (
                    <Button disabled={isUpdating} onClick={() => onCancelar(cita.cita_id)} size="sm" variant="outline-ink">
                      Cancelar
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

function PanelState({ text, title }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/12 bg-ink/3 p-7 text-center">
      <p className="font-display text-xl font-semibold tracking-tight text-ink">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink/55">{text}</p>
    </div>
  );
}
