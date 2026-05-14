import { bookingService } from '@/features/booking/bookingService';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AppNotification, CitaConDetalles, NotificationType, UserRole } from '@/types/supabase.types';

let notificationsSchemaUnavailable = false;

const readStorageKey = 'barber-flow-read-notifications';

function isMissingNotificationsSchema(error: { message?: string | null; details?: string | null; hint?: string | null }) {
  const haystack = [error.message, error.details, error.hint].filter(Boolean).join(' ').toLowerCase();
  return (
    haystack.includes('notificaciones')
    && (
      haystack.includes('user_id')
      || haystack.includes('titulo')
      || haystack.includes('mensaje')
      || haystack.includes('leido_at')
      || haystack.includes('metadata')
      || haystack.includes('column')
    )
  );
}

function getStoredReadIds(userId: string) {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const raw = window.localStorage.getItem(`${readStorageKey}:${userId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : []);
  } catch {
    return new Set<string>();
  }
}

function storeReadIds(userId: string, ids: Set<string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${readStorageKey}:${userId}`, JSON.stringify([...ids]));
}

function formatAppointmentDate(cita: CitaConDetalles) {
  return `${cita.fecha} a las ${cita.hora_inicio.slice(0, 5)}`;
}

function makeNotification(input: {
  userId: string;
  citaId: string;
  notificationId: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  createdAt: string;
  readIds: Set<string>;
  metadata?: Record<string, unknown>;
}) {
  return {
    id: input.notificationId,
    user_id: input.userId,
    cita_id: input.citaId,
    tipo: input.tipo,
    titulo: input.titulo,
    mensaje: input.mensaje,
    leido_at: input.readIds.has(input.notificationId) ? input.createdAt : null,
    enviado_at: input.createdAt,
    metadata: input.metadata ?? {},
    created_at: input.createdAt,
  } satisfies AppNotification;
}

function buildClientFallbackNotifications(userId: string, citas: CitaConDetalles[], readIds: Set<string>) {
  const notifications: AppNotification[] = [];

  for (const cita of citas) {
    notifications.push(makeNotification({
      userId,
      citaId: cita.cita_id,
      notificationId: `${cita.cita_id}:created`,
      tipo: 'cita_creada',
      titulo: 'Cita agendada',
      mensaje: `Tu cita en ${cita.nombre_barberia} para ${cita.nombre_servicio} fue agendada para ${formatAppointmentDate(cita)}.`,
      createdAt: cita.created_at,
      readIds,
      metadata: { estado: cita.estado },
    }));

    if (cita.estado !== 'pendiente' && cita.updated_at !== cita.created_at) {
      const config = {
        confirmada: {
          tipo: 'cita_confirmada' as const,
          titulo: 'Cita confirmada',
          mensaje: `Tu cita en ${cita.nombre_barberia} fue confirmada por la barberia.`,
        },
        cancelada: {
          tipo: 'cita_cancelada' as const,
          titulo: 'Cita cancelada',
          mensaje: `Tu cita en ${cita.nombre_barberia} fue cancelada.`,
        },
        completada: {
          tipo: 'cita_completada' as const,
          titulo: 'Cita completada',
          mensaje: `Tu cita en ${cita.nombre_barberia} fue marcada como completada.`,
        },
      }[cita.estado];

      if (config) {
        notifications.push(makeNotification({
          userId,
          citaId: cita.cita_id,
          notificationId: `${cita.cita_id}:${cita.estado}:${cita.updated_at}`,
          tipo: config.tipo,
          titulo: config.titulo,
          mensaje: config.mensaje,
          createdAt: cita.updated_at,
          readIds,
          metadata: { estado: cita.estado },
        }));
      }
    }
  }

  return notifications;
}

function buildAdminFallbackNotifications(userId: string, citas: CitaConDetalles[], readIds: Set<string>) {
  return citas
    .filter((cita) => cita.estado === 'pendiente')
    .map((cita) => makeNotification({
      userId,
      citaId: cita.cita_id,
      notificationId: `${cita.cita_id}:pending-admin`,
      tipo: 'cita_pendiente',
      titulo: 'Nueva cita por confirmar',
      mensaje: `${cita.nombre_cliente || cita.email_cliente} agendo ${cita.nombre_servicio} para ${formatAppointmentDate(cita)} con ${cita.nombre_barbero}.`,
      createdAt: cita.created_at,
      readIds,
      metadata: { estado: cita.estado, barberiaId: cita.barberia_id },
    }));
}

async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  const profile = data as { role?: UserRole | null } | null;
  return profile?.role ?? null;
}

async function getFallbackNotifications(userId: string) {
  const role = await getUserRole(userId);
  const readIds = getStoredReadIds(userId);

  if (role === 'client') {
    const citas = await bookingService.getMisCitas(userId);
    return buildClientFallbackNotifications(userId, citas, readIds)
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .slice(0, 30);
  }

  if (role === 'admin') {
    const { data, error } = await supabase
      .from('barberias')
      .select('id')
      .eq('admin_id', userId)
      .maybeSingle();

    if (error) throw error;
    const barberia = data as { id?: string | null } | null;
    if (!barberia?.id) return [];

    const citas = await bookingService.getCitasByBarberia(barberia.id);
    return buildAdminFallbackNotifications(userId, citas, readIds)
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .slice(0, 30);
  }

  return [];
}

export const notificationsService = {
  async getNotifications(userId: string) {
    if (!isSupabaseConfigured) return [];

    if (notificationsSchemaUnavailable) {
      return getFallbackNotifications(userId);
    }

    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      if (isMissingNotificationsSchema(error)) {
        notificationsSchemaUnavailable = true;
        return getFallbackNotifications(userId);
      }
      throw error;
    }
    return data as AppNotification[];
  },

  async markAsRead(notificationId: string, userId?: string) {
    if (notificationsSchemaUnavailable && userId) {
      const readIds = getStoredReadIds(userId);
      readIds.add(notificationId);
      storeReadIds(userId, readIds);
      return null;
    }

    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leido_at: new Date().toISOString() } as never)
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      if (isMissingNotificationsSchema(error)) {
        notificationsSchemaUnavailable = true;
        if (userId) {
          const readIds = getStoredReadIds(userId);
          readIds.add(notificationId);
          storeReadIds(userId, readIds);
        }
        return null;
      }
      throw error;
    }
    return data as AppNotification;
  },

  async markAllAsRead(userId: string) {
    if (notificationsSchemaUnavailable) {
      const notifications = await getFallbackNotifications(userId);
      const readIds = getStoredReadIds(userId);
      notifications.forEach((notification) => readIds.add(notification.id));
      storeReadIds(userId, readIds);
      return;
    }

    const { error } = await supabase
      .from('notificaciones')
      .update({ leido_at: new Date().toISOString() } as never)
      .eq('user_id', userId)
      .is('leido_at', null);

    if (error) {
      if (isMissingNotificationsSchema(error)) {
        notificationsSchemaUnavailable = true;
        const notifications = await getFallbackNotifications(userId);
        const readIds = getStoredReadIds(userId);
        notifications.forEach((notification) => readIds.add(notification.id));
        storeReadIds(userId, readIds);
        return;
      }
      throw error;
    }
  },
};
