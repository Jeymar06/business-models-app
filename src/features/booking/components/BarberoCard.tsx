import { UserRound } from 'lucide-react';

import type { Barbero } from '@/types/supabase.types';

export function BarberoCard({ barbero, label, onSelect, selected }: { barbero?: Barbero; label?: string; selected: boolean; onSelect: () => void }) {
  const name = label ?? barbero?.nombre ?? 'Barbero';

  return (
    <button
      className={[
        'flex min-h-24 items-center gap-4 rounded-lg border p-4 text-left transition',
        selected ? 'border-mint bg-mint/10 ring-2 ring-mint/20' : 'border-slate-200 bg-white hover:border-steel',
      ].join(' ')}
      onClick={onSelect}
      type="button"
    >
      {barbero?.foto_url ? (
        <img alt={barbero.nombre} className="h-12 w-12 rounded-full object-cover" src={barbero.foto_url} />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
          {barbero ? barbero.nombre.charAt(0).toUpperCase() : <UserRound size={22} />}
        </div>
      )}
      <div>
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-sm text-slate-500">{barbero ? 'Barbero activo' : 'Asignaremos el primer barbero libre'}</p>
      </div>
    </button>
  );
}
