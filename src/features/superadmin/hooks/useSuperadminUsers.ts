import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { UserFilters } from '@/features/superadmin/superadminService';
import { superadminService } from '@/features/superadmin/superadminService';
import type { UserRole } from '@/types/supabase.types';

export function useSuperadminUsers(filters: UserFilters) {
  const query = useQuery({
    queryKey: ['superadmin', 'users', filters],
    queryFn: () => superadminService.getAllUsers(filters),
  });

  return {
    ...query,
    isEmpty: !query.isLoading && !query.error && (query.data?.items.length ?? 0) === 0,
  };
}

export function useSuperadminUserDetail(userId: string | null) {
  return useQuery({
    enabled: Boolean(userId),
    queryKey: ['superadmin', 'users', 'detail', userId],
    queryFn: () => superadminService.getUserDetail(userId as string),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ role, userId }: { userId: string; role: UserRole }) => superadminService.updateUserRole(userId, role),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] }),
      ]);
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => superadminService.suspendUser(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] }),
      ]);
    },
  });
}

export function useSoftDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => superadminService.softDeleteUser(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] }),
      ]);
    },
  });
}
