import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui';
import { weekDays } from '@/features/admin/horarios/components/HorarioForm';
import type { Barbero, Disponibilidad } from '@/types/supabase.types';

export function HorarioSemanal({
  barberos,
  disponibilidad,
  onDelete,
  onEdit,
}: {
  barberos: Barbero[];
  disponibilidad: Disponibilidad[];
  onDelete: (block: Disponibilidad) => void;
  onEdit: (block: Disponibilidad) => void;
}) {
  if (!disponibilidad.length) {
    return <p className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">No hay horarios configurados.</p>;
  }

  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {weekDays.map((day, index) => {
        const dayBlocks = disponibilidad.filter((block) => block.dia_semana === index);
        return (
          <section className="rounded-md border border-slate-200 bg-white p-3" key={day}>
            <h3 className="mb-3 text-sm font-semibold text-ink">{day}</h3>
            <div className="space-y-2">
              {dayBlocks.length ? (
                dayBlocks.map((block) => {
                  const barber = barberos.find((item) => item.id === block.barbero_id);
                  return (
                    <article className="rounded-md bg-slate-50 p-2 text-xs" key={block.id}>
                      <p className="font-semibold text-ink">{barber?.nombre ?? 'Barbero'}</p>
                      <p className="text-slate-500">{block.hora_inicio.slice(0, 5)} - {block.hora_fin.slice(0, 5)}</p>
                      <div className="mt-2 flex gap-1">
                        <Button aria-label="Editar horario" onClick={() => onEdit(block)} size="sm" variant="secondary">
                          <Pencil size={14} />
                        </Button>
                        <Button aria-label="Eliminar horario" onClick={() => onDelete(block)} size="sm" variant="secondary">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">Sin horario</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
