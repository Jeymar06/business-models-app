import { Pencil, Power } from 'lucide-react';

import { Button } from '@/components/ui';
import { formatDuration } from '@/features/admin/servicios/utils';
import type { Servicio } from '@/types/supabase.types';

export function ServicioCard({
  onEdit,
  onToggle,
  servicio,
}: {
  onEdit: (servicio: Servicio) => void;
  onToggle: (servicio: Servicio) => void;
  servicio: Servicio;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-ink">{servicio.nombre}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs ${servicio.activo ? 'bg-mint/10 text-mint' : 'bg-slate-100 text-slate-500'}`}>
            {servicio.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          ${servicio.precio.toLocaleString('es-CO')} · {formatDuration(servicio.duracion_min)}
        </p>
        {servicio.descripcion ? <p className="mt-1 text-xs text-slate-500">{servicio.descripcion}</p> : null}
      </div>

      <div className="flex gap-2">
        <Button aria-label="Editar servicio" onClick={() => onEdit(servicio)} size="sm" variant="secondary">
          <Pencil size={16} />
        </Button>
        <Button aria-label={servicio.activo ? 'Desactivar servicio' : 'Activar servicio'} onClick={() => onToggle(servicio)} size="sm" variant="secondary">
          <Power size={16} />
          {servicio.activo ? 'Desactivar' : 'Activar'}
        </Button>
      </div>
    </article>
  );
}
