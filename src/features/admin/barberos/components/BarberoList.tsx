import { BarberoCard } from '@/features/admin/barberos/components/BarberoCard';
import type { Barbero } from '@/types/supabase.types';

export function BarberoList({
  barberos,
  onEdit,
  onToggle,
}: {
  barberos: Barbero[];
  onEdit: (barbero: Barbero) => void;
  onToggle: (barbero: Barbero) => void;
}) {
  if (!barberos.length) {
    return <p className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">No hay barberos creados.</p>;
  }

  return (
    <div className="space-y-3">
      {barberos.map((barbero) => (
        <BarberoCard barbero={barbero} key={barbero.id} onEdit={onEdit} onToggle={onToggle} />
      ))}
    </div>
  );
}
