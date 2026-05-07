import { Badge } from '@/components/ui';
import type { SuperadminEntityState } from '@/features/superadmin/superadminService';
import type { AppointmentStatus } from '@/types/supabase.types';

type SupportedStatus = SuperadminEntityState | AppointmentStatus;

const statusMap: Record<SupportedStatus, { label: string; variant: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'info' | 'neutral' }> = {
  active: { label: 'Activo', variant: 'confirmed' },
  pending: { label: 'Pendiente', variant: 'pending' },
  suspended: { label: 'Suspendido', variant: 'info' },
  deleted: { label: 'Oculto', variant: 'cancelled' },
  pendiente: { label: 'Pendiente', variant: 'pending' },
  confirmada: { label: 'Confirmada', variant: 'confirmed' },
  completada: { label: 'Completada', variant: 'completed' },
  cancelada: { label: 'Cancelada', variant: 'cancelled' },
};

export function StatusBadge({ status }: { status: SupportedStatus }) {
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
