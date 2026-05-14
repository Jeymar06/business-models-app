import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AppNotification } from '@/types/supabase.types';

let notificationsSchemaUnavailable = false;

function isMissingNotificationsSchema(error: { message?: string | null; details?: string | null; hint?: string | null }) {
  const haystack = [error.message, error.details, error.hint].filter(Boolean).join(' ').toLowerCase();
  return (
    haystack.includes('notificaciones') &&
    (
      haystack.includes('user_id')
      || haystack.includes('titulo')
      || haystack.includes('mensaje')
      || haystack.includes('leido_at')
      || haystack.includes('metadata')
      || haystack.includes('column')
    )
  );
}

export const notificationsService = {
  async getNotifications(userId: string) {
    if (!isSupabaseConfigured) return [];
    if (notificationsSchemaUnavailable) return [];

    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      if (isMissingNotificationsSchema(error)) {
        notificationsSchemaUnavailable = true;
        return [];
      }
      throw error;
    }
    return data as AppNotification[];
  },

  async markAsRead(notificationId: string) {
    if (notificationsSchemaUnavailable) return null;

    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leido_at: new Date().toISOString() } as never)
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      if (isMissingNotificationsSchema(error)) {
        notificationsSchemaUnavailable = true;
        return null;
      }
      throw error;
    }
    return data as AppNotification;
  },

  async markAllAsRead(userId: string) {
    if (notificationsSchemaUnavailable) return;

    const { error } = await supabase
      .from('notificaciones')
      .update({ leido_at: new Date().toISOString() } as never)
      .eq('user_id', userId)
      .is('leido_at', null);

    if (error) {
      if (isMissingNotificationsSchema(error)) {
        notificationsSchemaUnavailable = true;
        return;
      }
      throw error;
    }
  },
};
