import type { BookingSlot } from '@/features/booking/bookingService';

import { EmptyState } from './EmptyState';

export function SlotPicker({ isLoading, onSelectSlot, selectedSlot, slots }: { slots: BookingSlot[]; selectedSlot: BookingSlot | null; onSelectSlot: (slot: BookingSlot) => void; isLoading: boolean }) {
  if (isLoading) {
    return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div className="h-11 animate-pulse rounded-md bg-slate-100" key={index} />)}</div>;
  }

  if (!slots.length) {
    return <EmptyState title="Sin horarios" text="No hay horarios disponibles para esa fecha." />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          className={[
            'rounded-md border px-3 py-3 text-sm font-medium transition',
            selectedSlot?.hora_inicio === slot.hora_inicio && selectedSlot?.barbero_id === slot.barbero_id
              ? 'border-mint bg-mint/10 text-ink ring-2 ring-mint/20'
              : 'border-slate-200 bg-white text-slate-700 hover:border-steel',
          ].join(' ')}
          key={`${slot.barbero_id}-${slot.hora_inicio}`}
          onClick={() => onSelectSlot(slot)}
          type="button"
        >
          {slot.hora_inicio}
          {slot.nombre_barbero ? <span className="mt-1 block truncate text-xs font-normal text-slate-500">{slot.nombre_barbero}</span> : null}
        </button>
      ))}
    </div>
  );
}
