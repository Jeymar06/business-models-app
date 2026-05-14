import { Pencil, Power } from 'lucide-react';

import { Button } from '@/components/ui';
import type { Barbero } from '@/types/supabase.types';
import { isRenderableMediaUrl } from '@/utils/media';

export function BarberoCard({
  barbero,
  onEdit,
  onToggle,
}: {
  barbero: Barbero;
  onEdit: (barbero: Barbero) => void;
  onToggle: (barbero: Barbero) => void;
}) {
  const photoUrl = isRenderableMediaUrl(barbero.foto_url) ? barbero.foto_url!.trim() : null;

  return (
    <article className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-slate-100 text-sm font-semibold text-steel">
          {photoUrl ? <img alt={barbero.nombre} className="h-full w-full object-cover" src={photoUrl} /> : barbero.nombre.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-ink">{barbero.nombre}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs ${barbero.activo ? 'bg-mint/10 text-mint' : 'bg-slate-100 text-slate-500'}`}>
              {barbero.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{photoUrl || 'Sin foto'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button aria-label="Editar barbero" onClick={() => onEdit(barbero)} size="sm" variant="secondary">
          <Pencil size={16} />
        </Button>
        <Button aria-label={barbero.activo ? 'Desactivar barbero' : 'Activar barbero'} onClick={() => onToggle(barbero)} size="sm" variant="secondary">
          <Power size={16} />
          {barbero.activo ? 'Desactivar' : 'Activar'}
        </Button>
      </div>
    </article>
  );
}
