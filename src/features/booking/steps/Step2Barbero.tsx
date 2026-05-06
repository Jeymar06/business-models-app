import { BarberoCard } from '@/features/booking/components/BarberoCard';
import type { Barbero } from '@/types/supabase.types';

import { EmptyState } from '../components/EmptyState';

export function Step2Barbero({ anyBarbero, barbero, barberos, onSelectAny, onSelectBarbero }: { barberos: Barbero[]; barbero: Barbero | null; anyBarbero: boolean; onSelectBarbero: (barbero: Barbero) => void; onSelectAny: () => void }) {
  if (!barberos.length) {
    return <EmptyState title="Sin barberos" text="Esta barberia aun no tiene barberos activos." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <BarberoCard label="Cualquier barbero disponible" onSelect={onSelectAny} selected={anyBarbero} />
      {barberos.map((item) => (
        <BarberoCard
          barbero={item}
          key={item.id}
          onSelect={() => onSelectBarbero(item)}
          selected={barbero?.id === item.id}
        />
      ))}
    </div>
  );
}
