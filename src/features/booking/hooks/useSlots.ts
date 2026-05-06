import { useQuery } from '@tanstack/react-query';

import { bookingService, generateSlots, type BookingSlot } from '@/features/booking/bookingService';
import type { Barbero, Servicio } from '@/types/supabase.types';

interface UseSlotsParams {
  barberiaId: string;
  servicio: Servicio | null;
  barbero: Barbero | null;
  anyBarbero: boolean;
  fecha: Date | null;
}

export function useSlots({ anyBarbero, barberiaId, barbero, fecha, servicio }: UseSlotsParams) {
  return useQuery({
    enabled: Boolean(barberiaId && servicio && fecha && (barbero || anyBarbero)),
    queryKey: ['booking', 'slots', barberiaId, servicio?.id, barbero?.id ?? 'any', fecha?.toISOString().slice(0, 10)],
    queryFn: async () => {
      if (!servicio || !fecha) return [];
      const fechaIso = bookingService.formatDate(fecha);

      if (barbero) {
        const [disponibilidad, citas] = await Promise.all([
          bookingService.getDisponibilidadByBarbero(barbero.id),
          bookingService.getCitasByBarberoFecha(barbero.id, fechaIso),
        ]);

        return generateSlots({ disponibilidad, fecha, duracionMin: servicio.duracion_min, citasExistentes: citas })
          .map((slot) => ({ ...slot, barbero_id: barbero.id, nombre_barbero: barbero.nombre }));
      }

      const barberos = await bookingService.getBarberosByBarberia(barberiaId);
      const [disponibilidad, citas] = await Promise.all([
        bookingService.getDisponibilidadByBarberos(barberos.map((item) => item.id)),
        bookingService.getCitasByBarberosFecha(barberos.map((item) => item.id), fechaIso),
      ]);

      const byTime = new Map<string, BookingSlot>();

      for (const item of barberos) {
        const slots = generateSlots({
          disponibilidad: disponibilidad.filter((block) => block.barbero_id === item.id),
          fecha,
          duracionMin: servicio.duracion_min,
          citasExistentes: citas.filter((cita) => cita.barbero_id === item.id),
        });

        for (const slot of slots) {
          if (!byTime.has(slot.hora_inicio)) {
            byTime.set(slot.hora_inicio, { ...slot, barbero_id: item.id, nombre_barbero: item.nombre });
          }
        }
      }

      return [...byTime.values()].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
    },
  });
}
