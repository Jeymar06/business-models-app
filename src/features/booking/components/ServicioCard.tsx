import { Clock } from 'lucide-react';

import type { Servicio } from '@/types/supabase.types';

export function ServicioCard({ onSelect, selected, servicio }: { servicio: Servicio; selected: boolean; onSelect: () => void }) {
  return (
    <button
      className={[
        'min-h-32 rounded-lg border p-4 text-left transition',
        selected ? 'border-mint bg-mint/10 ring-2 ring-mint/20' : 'border-slate-200 bg-white hover:border-steel',
      ].join(' ')}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{servicio.nombre}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{servicio.descripcion || 'Servicio profesional de barberia.'}</p>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-ink">
          ${Number(servicio.precio).toLocaleString('es-CO')}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <Clock size={16} />
        {formatDuration(servicio.duracion_min)}
      </div>
    </button>
  );
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}
