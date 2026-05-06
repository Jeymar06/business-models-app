import { ServicioCard } from '@/features/booking/components/ServicioCard';
import type { Servicio } from '@/types/supabase.types';

import { EmptyState } from '../components/EmptyState';

export function Step1Servicio({ onSelect, selectedServicio, servicios }: { servicios: Servicio[]; selectedServicio: Servicio | null; onSelect: (servicio: Servicio) => void }) {
  if (!servicios.length) {
    return <EmptyState title="Sin servicios" text="Esta barberia aun no tiene servicios activos." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {servicios.map((servicio) => (
        <ServicioCard
          key={servicio.id}
          onSelect={() => onSelect(servicio)}
          selected={selectedServicio?.id === servicio.id}
          servicio={servicio}
        />
      ))}
    </div>
  );
}
