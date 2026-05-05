import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminService, type BarberiaInput } from '@/features/admin/adminService';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useBarberia() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const barberiaQuery = useQuery({
    enabled: Boolean(user?.id),
    queryKey: ['admin', 'barberia', user?.id],
    queryFn: () => adminService.getMyBarberia(user!.id),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const createBarberia = useMutation({
    mutationFn: (input: BarberiaInput) => adminService.createMyBarberia(user!.id, input),
    onSuccess: invalidate,
  });

  const updateBarberia = useMutation({
    mutationFn: ({ id, input }: { id: string; input: BarberiaInput }) => adminService.updateBarberia(id, input),
    onSuccess: invalidate,
  });

  return {
    barberia: barberiaQuery.data ?? null,
    createBarberia,
    error: barberiaQuery.error,
    isLoading: barberiaQuery.isLoading,
    updateBarberia,
  };
}
