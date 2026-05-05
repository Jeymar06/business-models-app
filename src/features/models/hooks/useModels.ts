import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createModel, getModels } from '../modelsService';

export function useModels() {
  const queryClient = useQueryClient();
  const modelsQuery = useQuery({
    queryKey: ['models'],
    queryFn: getModels,
  });

  const createModelMutation = useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
  });

  return {
    models: modelsQuery.data ?? [],
    error: modelsQuery.error,
    isCreating: createModelMutation.isPending,
    isLoading: modelsQuery.isLoading,
    createModel: createModelMutation.mutateAsync,
  };
}
