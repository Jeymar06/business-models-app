import { PublicHome } from '@/features/home/components/PublicHome';
import { ClientHome } from '@/features/home/components/ClientHome';
import { AdminHome } from '@/features/home/components/AdminHome';
import { SuperadminHome } from '@/features/home/components/SuperadminHome';
import { EmptyState } from '@/features/home/components/EmptyState';
import { useHomeData } from '@/features/home/hooks/useHomeData';

export function HomePage() {
  const { adminData, clientData, errorMessage, isLoading, profile, superadminData, variant } = useHomeData();

  if (variant === 'public') {
    return <PublicHome />;
  }

  if (isLoading) {
    return <HomeLoadingState />;
  }

  if (errorMessage) {
    const fallback = variant === 'admin' ? '/admin-dashboard' : variant === 'superadmin' ? '/superadmin-dashboard' : '/client-dashboard';
    return (
      <EmptyState
        actionLabel="Ir al panel"
        actionTo={fallback}
        description={errorMessage}
        title="No pudimos cargar tu inicio personalizado"
      />
    );
  }

  if (variant === 'client' && clientData) {
    return <ClientHome data={clientData} profile={profile} />;
  }

  if (variant === 'admin' && adminData) {
    return <AdminHome data={adminData} profile={profile} />;
  }

  if (variant === 'superadmin' && superadminData) {
    return <SuperadminHome data={superadminData} />;
  }

  return (
    <EmptyState
      actionLabel="Volver al inicio"
      actionTo="/"
      description="No encontramos suficiente informacion para mostrar tu panel inicial."
      title="Inicio no disponible"
    />
  );
}

function HomeLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-[28px] bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="h-36 animate-pulse rounded-2xl bg-slate-200" key={index} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
