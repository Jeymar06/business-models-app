import { useQuery } from '@tanstack/react-query';

import { superadminService } from '@/features/superadmin/superadminService';

export function useSuperadminStats() {
  const query = useQuery({
    queryKey: ['superadmin', 'stats'],
    queryFn: () => superadminService.getSuperadminStats(),
  });

  return {
    ...query,
    isEmpty: !query.isLoading && !query.error && !query.data,
  };
}
