import { Building2, CalendarDays, DollarSign, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { BarberiaDetailModal } from '@/features/superadmin/components/BarberiaDetailModal';
import { BarberiasTable } from '@/features/superadmin/components/BarberiasTable';
import { CitaDetailModal } from '@/features/superadmin/components/CitaDetailModal';
import { CitasGlobalTable } from '@/features/superadmin/components/CitasGlobalTable';
import { ConfirmActionModal } from '@/features/superadmin/components/ConfirmActionModal';
import { SuperadminMetricCard } from '@/features/superadmin/components/SuperadminMetricCard';
import { SuperadminTabs } from '@/features/superadmin/components/SuperadminTabs';
import { UserDetailModal } from '@/features/superadmin/components/UserDetailModal';
import { UsersTable } from '@/features/superadmin/components/UsersTable';
import {
  useSoftDeleteBarberia,
  useSuperadminBarberiaDetail,
  useSuperadminBarberias,
  useToggleBarberiaStatus,
} from '@/features/superadmin/hooks/useSuperadminBarberias';
import { useSuperadminCitaDetail, useSuperadminCitas, useUpdateCitaEstado } from '@/features/superadmin/hooks/useSuperadminCitas';
import { useSuperadminStats } from '@/features/superadmin/hooks/useSuperadminStats';
import {
  useSoftDeleteUser,
  useSuperadminUserDetail,
  useSuperadminUsers,
  useSuspendUser,
  useUpdateUserRole,
} from '@/features/superadmin/hooks/useSuperadminUsers';
import type {
  BarberiaFilters,
  CitaFilters,
  SuperadminBarberiaRow,
  SuperadminCitaRow,
  SuperadminTab,
  SuperadminUserRow,
  UserFilters,
} from '@/features/superadmin/superadminService';
import type { AppointmentStatus, UserRole } from '@/types/supabase.types';

interface FeedbackState {
  tone: 'error' | 'success';
  text: string;
}

type PendingAction =
  | { row: SuperadminBarberiaRow; type: 'delete-barberia' }
  | { row: SuperadminUserRow; type: 'delete-user' }
  | { row: SuperadminUserRow; type: 'suspend-user' }
  | null;

const defaultBarberiaFilters: BarberiaFilters = { page: 1, pageSize: 8, search: '', state: 'all' };
const defaultUserFilters: UserFilters = { page: 1, pageSize: 8, role: 'all', search: '', state: 'all' };
const defaultCitaFilters: CitaFilters = { page: 1, pageSize: 10, estado: 'all', month: 'all', search: '', year: 'all' };

export function SuperadminDashboard() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperadminTab>('resumen');
  const [barberiaFilters, setBarberiaFilters] = useState<BarberiaFilters>(defaultBarberiaFilters);
  const [userFilters, setUserFilters] = useState<UserFilters>(defaultUserFilters);
  const [citaFilters, setCitaFilters] = useState<CitaFilters>(defaultCitaFilters);
  const [selectedBarberiaId, setSelectedBarberiaId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCitaId, setSelectedCitaId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const statsQuery = useSuperadminStats();
  const barberiasQuery = useSuperadminBarberias(barberiaFilters);
  const usersQuery = useSuperadminUsers(userFilters);
  const citasQuery = useSuperadminCitas(citaFilters);
  const barberiaDetailQuery = useSuperadminBarberiaDetail(selectedBarberiaId);
  const userDetailQuery = useSuperadminUserDetail(selectedUserId);
  const citaDetailQuery = useSuperadminCitaDetail(selectedCitaId);

  const toggleBarberiaStatus = useToggleBarberiaStatus();
  const softDeleteBarberia = useSoftDeleteBarberia();
  const updateUserRole = useUpdateUserRole();
  const suspendUser = useSuspendUser();
  const softDeleteUser = useSoftDeleteUser();
  const updateCitaEstado = useUpdateCitaEstado();

  const summaryBarberias = useMemo(() => barberiasQuery.data?.items.slice(0, 3) ?? [], [barberiasQuery.data]);
  const summaryUsers = useMemo(() => usersQuery.data?.items.slice(0, 3) ?? [], [usersQuery.data]);
  const summaryCitas = useMemo(() => citasQuery.data?.items.slice(0, 4) ?? [], [citasQuery.data]);

  function showError(error: unknown) {
    setFeedback({
      tone: 'error',
      text: error instanceof Error ? error.message : 'No fue posible completar la acción.',
    });
  }

  function showSuccess(text: string) {
    setFeedback({ tone: 'success', text });
  }

  function patchBarberiaFilters(patch: Partial<BarberiaFilters>) {
    setBarberiaFilters((current) => ({ ...current, ...patch }));
  }

  function patchUserFilters(patch: Partial<UserFilters>) {
    setUserFilters((current) => ({ ...current, ...patch }));
  }

  function patchCitaFilters(patch: Partial<CitaFilters>) {
    setCitaFilters((current) => ({ ...current, ...patch }));
  }

  async function handleToggleBarberia(row: SuperadminBarberiaRow) {
    try {
      await toggleBarberiaStatus.mutateAsync({ activo: row.state !== 'active', barberiaId: row.id });
      showSuccess(row.state === 'active' ? 'Barbería desactivada.' : 'Barbería activada.');
    } catch (error) {
      showError(error);
    }
  }

  async function handleUpdateRole(row: SuperadminUserRow, roleValue: UserRole) {
    try {
      await updateUserRole.mutateAsync({ role: roleValue, userId: row.id });
      showSuccess('Rol actualizado correctamente.');
    } catch (error) {
      showError(error);
    }
  }

  async function handleUpdateCitaEstado(row: SuperadminCitaRow, estado: AppointmentStatus) {
    try {
      await updateCitaEstado.mutateAsync({ citaId: row.id, estado });
      showSuccess('Estado de la cita actualizado.');
    } catch (error) {
      showError(error);
    }
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === 'delete-barberia') {
        await softDeleteBarberia.mutateAsync(pendingAction.row.id);
        showSuccess('La barbería quedó oculta y sus reservas se desactivaron.');
      }

      if (pendingAction.type === 'suspend-user') {
        await suspendUser.mutateAsync(pendingAction.row.id);
        showSuccess('Usuario suspendido correctamente.');
      }

      if (pendingAction.type === 'delete-user') {
        await softDeleteUser.mutateAsync(pendingAction.row.id);
        showSuccess('Usuario ocultado correctamente.');
      }

      setPendingAction(null);
    } catch (error) {
      showError(error);
    }
  }

  const isConfirmingAction = softDeleteBarberia.isPending || suspendUser.isPending || softDeleteUser.isPending;

  if (role !== 'superadmin') {
    return (
      <div className="surface-panel rounded-[28px] p-6 text-sm text-danger">
        Solo el superadmin puede acceder a este panel.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <section className="surface-panel-dark rounded-[32px] px-6 py-7 text-white sm:px-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-gold">SUPERADMIN</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Control global de Barber Flow</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
          Revisa métricas, barberías, usuarios y citas desde un workspace administrativo pensado para operación diaria.
        </p>
      </section>

      {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricSkeleton visible={statsQuery.isLoading} />
        {!statsQuery.isLoading ? (
          <>
            <SuperadminMetricCard helper="Barberías registradas en la plataforma." icon={<Building2 size={18} />} label="Barberías" value={statsQuery.data?.barberias ?? 0} />
            <SuperadminMetricCard helper="Usuarios visibles desde profiles." icon={<Users size={18} />} label="Usuarios" value={statsQuery.data?.usuarios ?? 0} />
            <SuperadminMetricCard helper="Citas registradas en el mes actual." icon={<CalendarDays size={18} />} label="Citas del mes" value={statsQuery.data?.citasMes ?? 0} />
            <SuperadminMetricCard helper="Ingresos estimados de citas confirmadas o completadas." icon={<DollarSign size={18} />} label="Ingresos" value={`$${(statsQuery.data?.ingresosMes ?? 0).toLocaleString('es-CO')}`} />
          </>
        ) : null}
      </section>

      <SuperadminTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'resumen' ? (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <SummaryPanel title="Barberías recientes">
              {summaryBarberias.length ? summaryBarberias.map((barberia) => (
                <SummaryRow key={barberia.id} subtitle={`${barberia.ownerEmail} · ${barberia.ciudad}`} title={barberia.nombre} />
              )) : <EmptyInline text="Todavía no hay barberías para resumir." />}
            </SummaryPanel>

            <SummaryPanel title="Usuarios recientes">
              {summaryUsers.length ? summaryUsers.map((user) => (
                <SummaryRow key={user.id} subtitle={`${user.email} · ${user.role}`} title={user.nombre} />
              )) : <EmptyInline text="Todavía no hay usuarios para resumir." />}
            </SummaryPanel>
          </div>

          <div className="space-y-6">
            <SummaryPanel title="Citas recientes">
              {summaryCitas.length ? summaryCitas.map((cita) => (
                <SummaryRow key={cita.id} subtitle={`${cita.fecha} · ${cita.hora}`} title={`${cita.cliente} en ${cita.barberia}`} />
              )) : <EmptyInline text="Todavía no hay citas para resumir." />}
            </SummaryPanel>

            <SummaryPanel title="Nota operativa">
              <p className="text-sm leading-7 text-slate-600">
                Las acciones de suspender u ocultar usuarios dependen de columnas de ciclo de vida en <code>profiles</code>. Si esas columnas no existen aún, el servicio devuelve un error claro para aplicar la migración antes de insistir.
              </p>
            </SummaryPanel>
          </div>
        </section>
      ) : null}

      {activeTab === 'barberias' ? (
        <BarberiasTable
          data={barberiasQuery.data}
          error={barberiasQuery.error instanceof Error ? barberiasQuery.error.message : null}
          filters={barberiaFilters}
          isLoading={barberiasQuery.isLoading}
          onFiltersChange={patchBarberiaFilters}
          onSoftDelete={(row) => setPendingAction({ row, type: 'delete-barberia' })}
          onToggleStatus={handleToggleBarberia}
          onViewDetail={(row) => setSelectedBarberiaId(row.id)}
        />
      ) : null}

      {activeTab === 'usuarios' ? (
        <UsersTable
          data={usersQuery.data}
          error={usersQuery.error instanceof Error ? usersQuery.error.message : null}
          filters={userFilters}
          isLoading={usersQuery.isLoading}
          onFiltersChange={patchUserFilters}
          onSoftDelete={(row) => setPendingAction({ row, type: 'delete-user' })}
          onSuspend={(row) => setPendingAction({ row, type: 'suspend-user' })}
          onUpdateRole={handleUpdateRole}
          onViewDetail={(row) => setSelectedUserId(row.id)}
        />
      ) : null}

      {activeTab === 'citas' ? (
        <CitasGlobalTable
          data={citasQuery.data}
          error={citasQuery.error instanceof Error ? citasQuery.error.message : null}
          filters={citaFilters}
          isLoading={citasQuery.isLoading}
          onFiltersChange={patchCitaFilters}
          onUpdateEstado={handleUpdateCitaEstado}
          onViewDetail={(row) => setSelectedCitaId(row.id)}
        />
      ) : null}

      <BarberiaDetailModal
        data={barberiaDetailQuery.data}
        error={barberiaDetailQuery.error instanceof Error ? barberiaDetailQuery.error.message : null}
        isLoading={barberiaDetailQuery.isLoading}
        onClose={() => setSelectedBarberiaId(null)}
        open={Boolean(selectedBarberiaId)}
      />

      <UserDetailModal
        data={userDetailQuery.data}
        error={userDetailQuery.error instanceof Error ? userDetailQuery.error.message : null}
        isLoading={userDetailQuery.isLoading}
        onClose={() => setSelectedUserId(null)}
        open={Boolean(selectedUserId)}
      />

      <CitaDetailModal
        data={citaDetailQuery.data}
        error={citaDetailQuery.error instanceof Error ? citaDetailQuery.error.message : null}
        isLoading={citaDetailQuery.isLoading}
        onClose={() => setSelectedCitaId(null)}
        open={Boolean(selectedCitaId)}
      />

      <ConfirmActionModal
        confirmLabel={pendingAction?.type === 'delete-barberia' ? 'Ocultar barbería' : pendingAction?.type === 'delete-user' ? 'Ocultar usuario' : 'Suspender usuario'}
        description={
          pendingAction?.type === 'delete-barberia'
            ? 'Esta acción ocultará la barbería y desactivará sus reservas.'
            : pendingAction?.type === 'delete-user'
              ? 'Esta acción ocultará el usuario sin borrar Supabase Auth.'
              : 'Esta acción suspenderá el acceso del usuario hasta que vuelva a activarse.'
        }
        isLoading={isConfirmingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={() => void handleConfirmAction()}
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === 'delete-barberia'
            ? `Ocultar ${pendingAction.row.nombre}`
            : pendingAction?.type === 'delete-user' || pendingAction?.type === 'suspend-user'
              ? `Modificar ${pendingAction.row.nombre}`
              : 'Confirmar acción'
        }
      />
    </div>
  );
}

function SummaryPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="surface-panel rounded-[28px] p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function SummaryRow({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <article className="rounded-2xl border border-black/8 bg-[#FFFCF7] p-4">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}

function EmptyInline({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

function Alert({ children, tone }: { children: ReactNode; tone: 'error' | 'success' }) {
  const className = tone === 'error' ? 'border-danger/20 bg-danger/10 text-danger' : 'border-mint/20 bg-mint/10 text-ink';
  return <div className={`rounded-2xl border p-4 text-sm ${className}`}>{children}</div>;
}

function MetricSkeleton({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="surface-panel h-32 animate-pulse rounded-[24px]" key={index} />
      ))}
    </>
  );
}
