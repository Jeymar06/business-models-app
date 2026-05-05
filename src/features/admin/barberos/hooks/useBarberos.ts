import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminService, type BarberoInput } from '@/features/admin/adminService';

export function useBarberos(barberiaId?: string) {
  const queryClient = useQueryClient();

  const barberosQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['admin', 'barberos', barberiaId],
    queryFn: () => adminService.getBarbers(barberiaId!),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const createBarbero = useMutation({
    mutationFn: (input: BarberoInput) => adminService.createBarber(barberiaId!, input),
    onSuccess: invalidate,
  });

  const updateBarbero = useMutation({
    mutationFn: ({ id, input }: { id: string; input: BarberoInput }) => adminService.updateBarber(id, input),
    onSuccess: invalidate,
  });

  const setBarberoActivo = useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => adminService.setBarberActive(id, activo),
    onSuccess: invalidate,
  });

  return {
    barberos: barberosQuery.data ?? [],
    createBarbero,
    error: barberosQuery.error,
    isLoading: barberosQuery.isLoading,
    setBarberoActivo,
    updateBarbero,
  };
}
