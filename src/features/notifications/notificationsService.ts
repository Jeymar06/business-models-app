import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AppNotification } from '@/types/supabase.types';

export const notificationsService = {
  async getNotifications(userId: string) {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data as AppNotification[];
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leido_at: new Date().toISOString() } as never)
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data as AppNotification;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leido_at: new Date().toISOString() } as never)
      .eq('user_id', userId)
      .is('leido_at', null);

    if (error) throw error;
  },
};
