import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { homeService, type AdminHomeData, type ClientHomeData, type SuperadminGlobalStats, type RecentActivityItem, type RecentBarberiaItem } from '@/features/home/homeService';

export interface SuperadminHomeData {
  globalStats: SuperadminGlobalStats;
  recentBarberias: RecentBarberiaItem[];
  recentActivity: RecentActivityItem[];
  globalAlerts: string[];
}

type HomeVariant = 'public' | 'client' | 'admin' | 'superadmin';

function getFriendlyErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : 'No pudimos cargar la pagina de inicio.';

  if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('forbidden')) {
    return 'No tienes permisos para consultar esta informacion con tu rol actual.';
  }

  return message;
}

export function useHomeData() {
  const { isAuthenticated, profile, role, user } = useAuth();
  const variant: HomeVariant = !isAuthenticated ? 'public' : role === 'admin' ? 'admin' : role === 'superadmin' ? 'superadmin' : 'client';

  const clientQuery = useQuery({
    enabled: variant === 'client' && Boolean(user?.id),
    queryKey: ['home', 'client', user?.id],
    queryFn: async () => {
      const [nextAppointment, appointmentStats, availableBarberias] = await Promise.all([
        homeService.getClientNextAppointment(user!.id),
        homeService.getClientAppointmentStats(user!.id),
        homeService.getAvailableBarberias(3),
      ]);

      return {
        nextAppointment,
        appointmentStats,
        availableBarberias,
      } satisfies ClientHomeData;
    },
  });

  const adminQuery = useQuery({
    enabled: variant === 'admin' && Boolean(user?.id),
    queryKey: ['home', 'admin', user?.id],
    queryFn: async () => {
      const barberia = await homeService.getAdminBarberia(user!.id);
      if (!barberia) {
        return {
          barberia: null,
          todayAppointments: [],
          monthlyStats: { appointmentCount: 0, estimatedRevenue: 0 },
          quickStats: {
            todayAppointments: 0,
            pendingAppointments: 0,
            estimatedRevenueMonth: 0,
            activeBarbers: 0,
            activeServices: 0,
          },
          pendingTasks: [],
        } satisfies AdminHomeData;
      }

      const [todayAppointments, monthlyStats, quickStats, pendingTasks] = await Promise.all([
        homeService.getAdminTodayAppointments(barberia.id),
        homeService.getAdminMonthlyStats(barberia.id),
        homeService.getAdminQuickStats(barberia.id),
        homeService.getAdminPendingTasks(barberia),
      ]);

      return {
        barberia,
        todayAppointments,
        monthlyStats,
        quickStats,
        pendingTasks,
      } satisfies AdminHomeData;
    },
  });

  const superadminQuery = useQuery({
    enabled: variant === 'superadmin',
    queryKey: ['home', 'superadmin'],
    queryFn: async () => {
      const [globalStats, recentBarberias, recentActivity, globalAlerts] = await Promise.all([
        homeService.getSuperadminGlobalStats(),
        homeService.getRecentBarberias(),
        homeService.getRecentActivity(),
        homeService.getGlobalAlerts(),
      ]);

      return {
        globalStats,
        recentBarberias,
        recentActivity,
        globalAlerts,
      } satisfies SuperadminHomeData;
    },
  });

  const activeQuery = variant === 'client' ? clientQuery : variant === 'admin' ? adminQuery : variant === 'superadmin' ? superadminQuery : null;

  return {
    variant,
    profile,
    isLoading: activeQuery?.isLoading ?? false,
    errorMessage: activeQuery?.error ? getFriendlyErrorMessage(activeQuery.error) : null,
    clientData: clientQuery.data ?? null,
    adminData: adminQuery.data ?? null,
    superadminData: superadminQuery.data ?? null,
  };
}
