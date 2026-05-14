import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsService } from './notificationsService';

export function useNotifications(userId?: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ['notifications', userId];

  const query = useQuery({
    enabled: Boolean(userId),
    queryKey,
    queryFn: () => notificationsService.getNotifications(userId!),
    refetchInterval: 20000,
    staleTime: 10000,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey });
  };

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId, userId ?? undefined),
    onSuccess: invalidate,
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(userId!),
    onSuccess: invalidate,
  });

  const notifications = query.data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.leido_at).length;

  return {
    error: query.error,
    isLoading: query.isLoading,
    isMarking: markAsRead.isPending || markAllAsRead.isPending,
    markAllAsRead: markAllAsRead.mutateAsync,
    markAsRead: markAsRead.mutateAsync,
    notifications,
    unreadCount,
  };
}
