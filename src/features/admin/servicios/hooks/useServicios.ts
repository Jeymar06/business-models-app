import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminService, type ServicioInput } from '@/features/admin/adminService';

export function useServicios(barberiaId?: string) {
  const queryClient = useQueryClient();

  const serviciosQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['admin', 'servicios', barberiaId],
    queryFn: () => adminService.getServices(barberiaId!),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const createServicio = useMutation({
    mutationFn: (input: ServicioInput) => adminService.createService(barberiaId!, input),
    onSuccess: invalidate,
  });

  const updateServicio = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ServicioInput }) => adminService.updateService(id, input),
    onSuccess: invalidate,
  });

  const setServicioActivo = useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => adminService.setServiceActive(id, activo),
    onSuccess: invalidate,
  });

  return {
    createServicio,
    error: serviciosQuery.error,
    isLoading: serviciosQuery.isLoading,
    servicios: serviciosQuery.data ?? [],
    setServicioActivo,
    updateServicio,
  };
}
