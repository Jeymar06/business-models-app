import { useMemo } from 'react';

import type { MetricCard } from '@/types/global.types';

export function useDashboardMetrics() {
  return useMemo(
    () => ({
      metrics: [
        { label: 'Modelos activos', value: '12', delta: '+3 este mes' },
        { label: 'Canvas completos', value: '8', delta: '67% del portafolio' },
        { label: 'Ingreso proyectado', value: '$18.2k', delta: '+24% mensual' },
      ] satisfies MetricCard[],
    }),
    [],
  );
}
