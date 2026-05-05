import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminService, type DisponibilidadInput } from '@/features/admin/adminService';

export function useDisponibilidad(barberiaId?: string) {
  const queryClient = useQueryClient();

  const disponibilidadQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['admin', 'disponibilidad', barberiaId],
    queryFn: () => adminService.getAvailability(barberiaId!),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const createDisponibilidad = useMutation({
    mutationFn: (input: DisponibilidadInput) => adminService.createAvailability(input),
    onSuccess: invalidate,
  });

  const updateDisponibilidad = useMutation({
    mutationFn: ({ id, input }: { id: string; input: DisponibilidadInput }) => adminService.updateAvailability(id, input),
    onSuccess: invalidate,
  });

  const deleteDisponibilidad = useMutation({
    mutationFn: (id: string) => adminService.deleteAvailability(id),
    onSuccess: invalidate,
  });

  return {
    createDisponibilidad,
    deleteDisponibilidad,
    disponibilidad: disponibilidadQuery.data ?? [],
    error: disponibilidadQuery.error,
    isLoading: disponibilidadQuery.isLoading,
    updateDisponibilidad,
  };
}
