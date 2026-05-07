import { Badge } from '@/components/ui';
import type { UserRole } from '@/types/supabase.types';

const roleMap: Record<UserRole, { label: string; variant: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'info' | 'neutral' }> = {
  client: { label: 'Cliente', variant: 'neutral' },
  admin: { label: 'Admin', variant: 'confirmed' },
  superadmin: { label: 'Superadmin', variant: 'info' },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const config = roleMap[role];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
