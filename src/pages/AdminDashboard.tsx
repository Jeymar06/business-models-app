import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Scissors,
  Settings,
  Store,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { Button, ConfirmDialog, Pill, useToast } from '@/components/ui';
import {
  adminService,
  type BarberoInput,
  type BarberiaInput,
  type DisponibilidadInput,
  type ServicioInput,
} from '@/features/admin/adminService';
import { BarberiaForm } from '@/features/admin/barberia/components/BarberiaForm';
import { useBarberia } from '@/features/admin/barberia/hooks/useBarberia';
import { BarberoForm } from '@/features/admin/barberos/components/BarberoForm';
import { BarberoList } from '@/features/admin/barberos/components/BarberoList';
import { useBarberos } from '@/features/admin/barberos/hooks/useBarberos';
import { HorarioForm } from '@/features/admin/horarios/components/HorarioForm';
import { HorarioSemanal } from '@/features/admin/horarios/components/HorarioSemanal';
import { useDisponibilidad } from '@/features/admin/horarios/hooks/useDisponibilidad';
import { ServicioForm } from '@/features/admin/servicios/components/ServicioForm';
import { ServicioList } from '@/features/admin/servicios/components/ServicioList';
import { useServicios } from '@/features/admin/servicios/hooks/useServicios';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Barbero, Disponibilidad, Servicio } from '@/types/supabase.types';
import { AdminCitasPage } from './AdminCitasPage';

type AdminSection = 'resumen' | 'citas' | 'barberos' | 'servicios' | 'horarios' | 'barberia' | 'configuracion';

const sections: Array<{ id: AdminSection; label: string; icon: ReactNode }> = [
  { id: 'resumen', label: 'Resumen', icon: <CalendarDays size={16} /> },
  { id: 'citas', label: 'Citas', icon: <CalendarCheck size={16} /> },
  { id: 'barberos', label: 'Barberos', icon: <UserRound size={16} /> },
  { id: 'servicios', label: 'Servicios', icon: <Scissors size={16} /> },
  { id: 'horarios', label: 'Horarios', icon: <Clock size={16} /> },
  { id: 'barberia', label: 'Mi Barbería', icon: <Store size={16} /> },
  { id: 'configuracion', label: 'Configuración', icon: <Settings size={16} /> },
];

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { profile: _profile } = useAuth();
  const [section, setSection] = useState<AdminSection>('resumen');
  const [editingBarbero, setEditingBarbero] = useState<Barbero | null>(null);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [editingHorario, setEditingHorario] = useState<Disponibilidad | null>(null);
  const [confirmDeleteBarberia, setConfirmDeleteBarberia] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { barberia, createBarberia, error: barberiaError, isLoading: isBarberiaLoading, updateBarberia } = useBarberia();
  const { barberos, createBarbero, setBarberoActivo, updateBarbero } = useBarberos(barberia?.id);
  const { createServicio, servicios, setServicioActivo, updateServicio } = useServicios(barberia?.id);
  const { createDisponibilidad, deleteDisponibilidad, disponibilidad, updateDisponibilidad } = useDisponibilidad(barberia?.id);

  const appointmentsQuery = useQuery({
    enabled: Boolean(barberia?.id),
    queryKey: ['admin', 'appointments', barberia?.id],
    queryFn: () => adminService.getAppointments(barberia!.id),
  });

  const todayAppointments = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (appointmentsQuery.data ?? []).filter((appointment) => appointment.fecha === today).length;
  }, [appointmentsQuery.data]);

  const activeBarbers = barberos.filter((barbero) => barbero.activo).length;
  const activeServices = servicios.filter((servicio) => servicio.activo).length;

  async function saveBarberia(values: BarberiaInput) {
    if (barberia) {
      await updateBarberia.mutateAsync({ id: barberia.id, input: values });
      toast.success('Cambios guardados.', 'Barbería actualizada');
    } else {
      await createBarberia.mutateAsync(values);
      toast.success('Tu barbería está lista para operar.', 'Barbería creada');
    }
  }

  async function saveBarbero(values: BarberoInput) {
    if (editingBarbero) {
      await updateBarbero.mutateAsync({ id: editingBarbero.id, input: values });
      setEditingBarbero(null);
      toast.success('Barbero actualizado.');
      return;
    }
    await createBarbero.mutateAsync(values);
    toast.success('Barbero creado.');
  }

  async function saveServicio(values: ServicioInput) {
    if (editingServicio) {
      await updateServicio.mutateAsync({ id: editingServicio.id, input: values });
      setEditingServicio(null);
      toast.success('Servicio actualizado.');
      return;
    }
    await createServicio.mutateAsync(values);
    toast.success('Servicio creado.');
  }

  async function saveHorario(values: DisponibilidadInput) {
    if (editingHorario) {
      await updateDisponibilidad.mutateAsync({ id: editingHorario.id, input: values });
      setEditingHorario(null);
      toast.success('Horario actualizado.');
      return;
    }
    await createDisponibilidad.mutateAsync(values);
    toast.success('Horario creado.');
  }

  async function performDeleteBarberia() {
    if (!barberia) return;
    setIsDeleting(true);
    try {
      await adminService.deleteBarberia(barberia.id);
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success('Serás redirigido…', 'Barbería eliminada');
      setTimeout(() => window.location.assign('/'), 1200);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible eliminar la barbería.', 'Error');
    } finally {
      setIsDeleting(false);
      setConfirmDeleteBarberia(false);
    }
  }

  async function performDeleteAccount() {
    setIsDeleting(true);
    try {
      const { authService } = await import('@/features/auth/services/authService');
      await authService.deleteUserAccount();
      window.location.assign('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible eliminar la cuenta.', 'Error');
    } finally {
      setIsDeleting(false);
      setConfirmDeleteAccount(false);
    }
  }

  if (!isSupabaseConfigured) {
    return <PanelEmpty title="Supabase pendiente" text="Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para usar el panel." />;
  }

  if (isBarberiaLoading) {
    return <PanelEmpty title="Cargando panel" text="Estamos leyendo la barbería asociada a tu usuario admin." />;
  }

  const blocker = barberiaError instanceof Error ? barberiaError.message : null;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-[28px] border border-ink/8 bg-paper p-4 shadow-soft">
          <div className="px-3 py-3">
            <Pill tone="gold">Panel admin</Pill>
            <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink">
              {barberia?.nombre ?? 'Barber Flow'}
            </h1>
          </div>
          <nav className="mt-3 grid gap-1">
            {sections.map((item) => (
              <button
                className={[
                  'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-300',
                  section === item.id
                    ? 'bg-ink text-cream shadow-soft'
                    : 'text-ink/65 hover:bg-ink/5 hover:text-ink',
                ].join(' ')}
                key={item.id}
                onClick={() => setSection(item.id)}
                type="button"
              >
                <span
                  className={
                    section === item.id
                      ? 'text-gold-300'
                      : 'text-ink/45 group-hover:text-ink'
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          {blocker ? (
            <div className="rounded-2xl border border-danger/22 bg-danger/8 p-4 text-sm leading-6 text-danger">
              {blocker}
            </div>
          ) : null}

          {!barberia && section !== 'barberia' ? (
            <PanelEmpty title="Crea tu barbería" text="Antes de crear barberos, servicios y horarios, registra los datos de Mi Barbería." />
          ) : null}

          {section === 'resumen' ? (
            <Section eyebrow="Vista general" title="Resumen de hoy">
              <div className="grid gap-4 md:grid-cols-3">
                <Metric icon={<CalendarDays size={18} />} label="Citas hoy" value={todayAppointments} />
                <Metric icon={<UserRound size={18} />} label="Barberos activos" value={activeBarbers} />
                <Metric icon={<Scissors size={18} />} label="Servicios activos" value={activeServices} />
              </div>
            </Section>
          ) : null}

          {section === 'citas' && barberia ? <AdminCitasPage /> : null}

          {section === 'barberos' && barberia ? (
            <Section eyebrow="Equipo" title="Barberos">
              <BarberoForm
                barbero={editingBarbero}
                isSaving={createBarbero.isPending || updateBarbero.isPending}
                onCancel={editingBarbero ? () => setEditingBarbero(null) : undefined}
                onSubmit={saveBarbero}
              />
              <BarberoList
                barberos={barberos}
                onEdit={setEditingBarbero}
                onToggle={(barbero) => {
                  void setBarberoActivo
                    .mutateAsync({ id: barbero.id, activo: !barbero.activo })
                    .then(() => toast.success(barbero.activo ? 'Barbero desactivado.' : 'Barbero activado.'));
                }}
              />
            </Section>
          ) : null}

          {section === 'servicios' && barberia ? (
            <Section eyebrow="Oferta" title="Servicios">
              <ServicioForm
                isSaving={createServicio.isPending || updateServicio.isPending}
                onCancel={editingServicio ? () => setEditingServicio(null) : undefined}
                onSubmit={saveServicio}
                servicio={editingServicio}
              />
              <ServicioList
                onEdit={setEditingServicio}
                onToggle={(servicio) => {
                  void setServicioActivo
                    .mutateAsync({ id: servicio.id, activo: !servicio.activo })
                    .then(() => toast.success(servicio.activo ? 'Servicio desactivado.' : 'Servicio activado.'));
                }}
                servicios={servicios}
              />
            </Section>
          ) : null}

          {section === 'horarios' && barberia ? (
            <Section eyebrow="Disponibilidad" title="Horarios">
              <HorarioForm
                barberos={barberos.filter((barbero) => barbero.activo)}
                block={editingHorario}
                isSaving={createDisponibilidad.isPending || updateDisponibilidad.isPending}
                onCancel={editingHorario ? () => setEditingHorario(null) : undefined}
                onSubmit={saveHorario}
              />
              <HorarioSemanal
                barberos={barberos}
                disponibilidad={disponibilidad}
                onDelete={(block) => {
                  void deleteDisponibilidad
                    .mutateAsync(block.id)
                    .then(() => toast.success('Horario eliminado.'));
                }}
                onEdit={setEditingHorario}
              />
            </Section>
          ) : null}

          {section === 'barberia' ? (
            <Section eyebrow="Identidad" title="Mi Barbería">
              <BarberiaForm
                barberia={barberia}
                isSaving={createBarberia.isPending || updateBarberia.isPending}
                onSubmit={saveBarberia}
              />
            </Section>
          ) : null}

          {section === 'configuracion' ? (
            <Section eyebrow="Zona crítica" title="Configuración">
              <div className="space-y-5">
                {barberia ? (
                  <DangerZone
                    description="Una vez eliminada, no podrás recuperar tu barbería ni los datos asociados."
                    label={isDeleting ? 'Eliminando…' : 'Eliminar barbería'}
                    onClick={() => setConfirmDeleteBarberia(true)}
                    title="Eliminar barbería"
                  />
                ) : null}
                <DangerZone
                  description="Elimina tu cuenta y todos tus datos de la plataforma. Esta acción es irreversible."
                  label={isDeleting ? 'Eliminando…' : 'Eliminar cuenta'}
                  onClick={() => setConfirmDeleteAccount(true)}
                  title="Eliminar cuenta"
                />
              </div>
            </Section>
          ) : null}
        </main>
      </div>

      <ConfirmDialog
        confirmLabel="Sí, eliminar barbería"
        description={`Vas a eliminar definitivamente ${barberia?.nombre ?? 'tu barbería'} y todos sus datos asociados (servicios, horarios, barberos).`}
        eyebrow="Zona crítica"
        onClose={() => setConfirmDeleteBarberia(false)}
        onConfirm={performDeleteBarberia}
        open={confirmDeleteBarberia}
        title="¿Eliminar tu barbería?"
        warning="Esta acción no se puede deshacer. Las citas existentes y la configuración se perderán."
      />

      <ConfirmDialog
        confirmLabel="Sí, eliminar mi cuenta"
        description="Vas a eliminar definitivamente tu usuario y los datos asociados a tu cuenta."
        eyebrow="Zona crítica"
        onClose={() => setConfirmDeleteAccount(false)}
        onConfirm={performDeleteAccount}
        open={confirmDeleteAccount}
        title="¿Eliminar tu cuenta?"
        warning="Perderás acceso permanente a Barber Flow. Esta acción es irreversible."
      />
    </>
  );
}

function Section({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="space-y-6 rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft sm:p-8">
      <div className="space-y-2">
        <p className="eyebrow text-gold-700">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-ink/8 bg-ink/3 p-5">
      <div className="mb-3 flex items-center gap-2 text-ink/55">
        {icon}
        <span className="eyebrow text-ink/45">{label}</span>
      </div>
      <p className="font-display numeric text-4xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  );
}

function DangerZone({
  description,
  label,
  onClick,
  title,
}: {
  description: string;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-danger/22 bg-danger/6 p-5">
      <h3 className="font-display text-xl font-semibold tracking-tight text-danger">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-danger/85">{description}</p>
      <div className="mt-5">
        <Button
          className="!bg-danger !text-paper !ring-danger/20 hover:!bg-[#c8383d]"
          onClick={onClick}
          size="md"
        >
          <Trash2 size={16} />
          {label}
        </Button>
      </div>
    </div>
  );
}

function PanelEmpty({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[28px] border border-ink/8 bg-paper p-10 shadow-soft">
      <p className="eyebrow text-gold-700">Admin</p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink/60">{text}</p>
    </div>
  );
}
