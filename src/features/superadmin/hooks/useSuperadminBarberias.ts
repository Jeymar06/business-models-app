import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { BarberiaFilters } from '@/features/superadmin/superadminService';
import { superadminService } from '@/features/superadmin/superadminService';

export function useSuperadminBarberias(filters: BarberiaFilters) {
  const query = useQuery({
    queryKey: ['superadmin', 'barberias', filters],
    queryFn: () => superadminService.getAllBarberias(filters),
  });

  return {
    ...query,
    isEmpty: !query.isLoading && !query.error && (query.data?.items.length ?? 0) === 0,
  };
}

export function useSuperadminBarberiaDetail(barberiaId: string | null) {
  return useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['superadmin', 'barberias', 'detail', barberiaId],
    queryFn: () => superadminService.getBarberiaDetail(barberiaId as string),
  });
}

export function useToggleBarberiaStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activo, barberiaId }: { barberiaId: string; activo: boolean }) => superadminService.toggleBarberiaStatus(barberiaId, activo),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'barberias'] }),
      ]);
    },
  });
}

export function useSoftDeleteBarberia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (barberiaId: string) => superadminService.softDeleteBarberia(barberiaId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'barberias'] }),
      ]);
    },
  });
}
