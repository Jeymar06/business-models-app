import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CitaFilters } from '@/features/superadmin/superadminService';
import { superadminService } from '@/features/superadmin/superadminService';
import type { AppointmentStatus } from '@/types/supabase.types';

export function useSuperadminCitas(filters: CitaFilters) {
  const query = useQuery({
    queryKey: ['superadmin', 'citas', filters],
    queryFn: () => superadminService.getAllCitas(filters),
  });

  return {
    ...query,
    isEmpty: !query.isLoading && !query.error && (query.data?.items.length ?? 0) === 0,
  };
}

export function useSuperadminCitaDetail(citaId: string | null) {
  return useQuery({
    enabled: Boolean(citaId),
    queryKey: ['superadmin', 'citas', 'detail', citaId],
    queryFn: () => superadminService.getCitaDetail(citaId as string),
  });
}

export function useUpdateCitaEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ citaId, estado }: { citaId: string; estado: AppointmentStatus }) => superadminService.updateCitaEstado(citaId, estado),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'citas'] }),
      ]);
    },
  });
}
