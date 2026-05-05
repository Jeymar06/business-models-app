import { ServicioCard } from '@/features/admin/servicios/components/ServicioCard';
import type { Servicio } from '@/types/supabase.types';

export function ServicioList({
  onEdit,
  onToggle,
  servicios,
}: {
  onEdit: (servicio: Servicio) => void;
  onToggle: (servicio: Servicio) => void;
  servicios: Servicio[];
}) {
  if (!servicios.length) {
    return <p className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">No hay servicios creados.</p>;
  }

  return (
    <div className="space-y-3">
      {servicios.map((servicio) => (
        <ServicioCard key={servicio.id} onEdit={onEdit} onToggle={onToggle} servicio={servicio} />
      ))}
    </div>
  );
}
