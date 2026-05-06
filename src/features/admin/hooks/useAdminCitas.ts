import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingService } from '@/features/booking/bookingService';
import type { AppointmentStatus } from '@/types/supabase.types';

export interface AdminCitaFilters {
  fecha?: string;
  estado?: AppointmentStatus | 'todas';
  barberoId?: string;
}

export function useAdminCitas(barberiaId?: string, filters: AdminCitaFilters = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['admin', 'citas', barberiaId],
    queryFn: () => bookingService.getCitasByBarberia(barberiaId!),
  });

  const updateEstado = useMutation({
    mutationFn: ({ citaId, estado }: { citaId: string; estado: AppointmentStatus }) => bookingService.adminUpdateEstadoCita(citaId, estado),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'citas', barberiaId] });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'appointments', barberiaId] });
      await queryClient.invalidateQueries({ queryKey: ['booking', 'slots'] });
    },
  });

  const citas = (query.data ?? []).filter((cita) => {
    if (filters.fecha && cita.fecha !== filters.fecha) return false;
    if (filters.estado && filters.estado !== 'todas' && cita.estado !== filters.estado) return false;
    if (filters.barberoId && cita.barbero_id !== filters.barberoId) return false;
    return true;
  });

  return {
    cancelarCita: (citaId: string) => updateEstado.mutateAsync({ citaId, estado: 'cancelada' }),
    citas,
    completarCita: (citaId: string) => updateEstado.mutateAsync({ citaId, estado: 'completada' }),
    confirmarCita: (citaId: string) => updateEstado.mutateAsync({ citaId, estado: 'confirmada' }),
    error: query.error,
    isLoading: query.isLoading,
    isUpdating: updateEstado.isPending,
  };
}
