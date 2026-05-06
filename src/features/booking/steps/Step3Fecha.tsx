import { CalendarioMes } from '@/features/booking/components/CalendarioMes';
import { SlotPicker } from '@/features/booking/components/SlotPicker';
import type { BookingSlot } from '@/features/booking/bookingService';

export function Step3Fecha({ availableDays, fecha, isLoading, onSelectFecha, onSelectSlot, selectedSlot, slots }: { fecha: Date | null; availableDays: number[]; slots: BookingSlot[]; selectedSlot: BookingSlot | null; isLoading: boolean; onSelectFecha: (date: Date) => void; onSelectSlot: (slot: BookingSlot) => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <CalendarioMes availableDays={availableDays} onSelectDate={onSelectFecha} selectedDate={fecha} />
      <div>
        <h3 className="mb-3 font-semibold text-ink">Horarios disponibles</h3>
        {fecha ? (
          <SlotPicker isLoading={isLoading} onSelectSlot={onSelectSlot} selectedSlot={selectedSlot} slots={slots} />
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Selecciona una fecha para ver horarios.</div>
        )}
      </div>
    </div>
  );
}
