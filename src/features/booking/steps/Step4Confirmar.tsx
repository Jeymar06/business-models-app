import { ResumenCita } from '@/features/booking/components/ResumenCita';
import type { BookingSlot } from '@/features/booking/bookingService';
import type { Barbero, Barberia, Servicio } from '@/types/supabase.types';

export function Step4Confirmar({ barberia, barbero, fecha, notas, onNotasChange, servicio, slot }: { barberia: Barberia; servicio: Servicio | null; barbero: Barbero | null; fecha: Date | null; slot: BookingSlot | null; notas: string; onNotasChange: (value: string) => void }) {
  return (
    <ResumenCita
      barberia={barberia}
      barbero={barbero}
      fecha={fecha}
      notas={notas}
      onNotasChange={onNotasChange}
      servicio={servicio}
      slot={slot}
    />
  );
}
