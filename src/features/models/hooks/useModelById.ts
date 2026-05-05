import { useQuery } from '@tanstack/react-query';

import { getModelById } from '../modelsService';

export function useModelById(id?: string) {
  return useQuery({
    queryKey: ['models', id],
    queryFn: () => getModelById(id ?? ''),
    enabled: Boolean(id),
  });
}
