import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import type { Barberia } from '@/types/supabase.types';

export function BarberiaMiniCard({ barberia }: { barberia: Barberia }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-ink">{barberia.nombre}</h3>
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} />
          {barberia.ciudad} · {barberia.direccion}
        </p>
      </div>
      <div className="mt-4">
        <Link to={`/booking/${barberia.id}`}>
          <Button size="sm">Agendar</Button>
        </Link>
      </div>
    </article>
  );
}
