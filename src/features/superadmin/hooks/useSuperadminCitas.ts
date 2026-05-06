import { useQuery } from '@tanstack/react-query';

import { bookingService } from '@/features/booking/bookingService';

export function useSuperadminCitas() {
  return useQuery({
    queryKey: ['superadmin', 'citas'],
    queryFn: bookingService.getTodasLasCitas,
  });
}
