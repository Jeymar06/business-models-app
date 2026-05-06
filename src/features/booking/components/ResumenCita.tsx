import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import type { BookingSlot } from '@/features/booking/bookingService';
import type { Barbero, Barberia, Servicio } from '@/types/supabase.types';

export function ResumenCita({ barberia, barbero, fecha, notas, onNotasChange, servicio, slot }: { barberia: Barberia; servicio: Servicio | null; barbero: Barbero | null; fecha: Date | null; slot: BookingSlot | null; notas: string; onNotasChange: (value: string) => void }) {
  const rows = [
    ['Barberia', barberia.nombre],
    ['Servicio', servicio?.nombre],
    ['Barbero', barbero?.nombre ?? slot?.nombre_barbero],
    ['Fecha', fecha ? format(fecha, 'PPP', { locale: es }) : null],
    ['Hora', slot ? `${slot.hora_inicio} - ${slot.hora_fin}` : null],
    ['Precio', servicio ? `$${Number(servicio.precio).toLocaleString('es-CO')}` : null],
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 font-semibold text-ink">Resumen de la cita</h3>
        <div className="space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div className="flex justify-between gap-4" key={label}>
              <span className="text-slate-500">{label}</span>
              <strong className="text-right text-ink">{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Notas opcionales
        <textarea
          className="min-h-28 rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
          onChange={(event) => onNotasChange(event.target.value)}
          placeholder="Ej: prefiero corte bajo, llego 5 minutos antes..."
          value={notas}
        />
      </label>
    </div>
  );
}
