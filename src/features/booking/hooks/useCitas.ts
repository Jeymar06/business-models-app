import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isBefore, parseISO, startOfDay } from 'date-fns';

import { bookingService } from '@/features/booking/bookingService';
import type { CitaConDetalles } from '@/types/supabase.types';

export function useCitas(clienteId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    enabled: Boolean(clienteId),
    queryKey: ['client', 'citas', clienteId],
    queryFn: () => bookingService.getMisCitas(clienteId!),
  });

  const cancelar = useMutation({
    mutationFn: bookingService.cancelarCita,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['client', 'citas', clienteId] });
      await queryClient.invalidateQueries({ queryKey: ['notifications', clienteId] });
      await queryClient.invalidateQueries({ queryKey: ['booking', 'slots'] });
    },
  });

  const today = startOfDay(new Date());
  const citas = query.data ?? [];
  const proximasCitas = citas.filter((cita) => (
    ['pendiente', 'confirmada'].includes(cita.estado)
    && !isBefore(startOfDay(parseISO(cita.fecha)), today)
  ));
  const historialCitas = citas.filter((cita) => !proximasCitas.some((next) => next.cita_id === cita.cita_id));

  return {
    cancelarCita: cancelar.mutateAsync,
    error: query.error,
    historialCitas,
    isCancelling: cancelar.isPending,
    isLoading: query.isLoading,
    proximasCitas,
  };
}

export type ClientCita = CitaConDetalles;
