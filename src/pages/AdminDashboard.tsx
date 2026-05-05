import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Clock, Scissors, Store, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui';
import { adminService, type BarberoInput, type BarberiaInput, type DisponibilidadInput, type ServicioInput } from '@/features/admin/adminService';
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
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Barbero, Disponibilidad, Servicio } from '@/types/supabase.types';

type AdminSection = 'resumen' | 'barberos' | 'servicios' | 'horarios' | 'barberia';

const sections: Array<{ id: AdminSection; label: string; icon: ReactNode }> = [
  { id: 'resumen', label: 'Resumen', icon: <CalendarDays size={16} /> },
  { id: 'barberos', label: 'Barberos', icon: <UserRound size={16} /> },
  { id: 'servicios', label: 'Servicios', icon: <Scissors size={16} /> },
  { id: 'horarios', label: 'Horarios', icon: <Clock size={16} /> },
  { id: 'barberia', label: 'Mi Barberia', icon: <Store size={16} /> },
];

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('resumen');
  const [editingBarbero, setEditingBarbero] = useState<Barbero | null>(null);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [editingHorario, setEditingHorario] = useState<Disponibilidad | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  function report(success: string) {
    setMessage(success);
    window.setTimeout(() => setMessage(null), 3000);
  }

  async function saveBarberia(values: BarberiaInput) {
    if (barberia) {
      await updateBarberia.mutateAsync({ id: barberia.id, input: values });
      report('Barberia actualizada.');
    } else {
      await createBarberia.mutateAsync(values);
      report('Barberia creada.');
    }
  }

  async function saveBarbero(values: BarberoInput) {
    if (editingBarbero) {
      await updateBarbero.mutateAsync({ id: editingBarbero.id, input: values });
      setEditingBarbero(null);
      report('Barbero actualizado.');
      return;
    }

    await createBarbero.mutateAsync(values);
    report('Barbero creado.');
  }

  async function saveServicio(values: ServicioInput) {
    if (editingServicio) {
      await updateServicio.mutateAsync({ id: editingServicio.id, input: values });
      setEditingServicio(null);
      report('Servicio actualizado.');
      return;
    }

    await createServicio.mutateAsync(values);
    report('Servicio creado.');
  }

  async function saveHorario(values: DisponibilidadInput) {
    if (editingHorario) {
      await updateDisponibilidad.mutateAsync({ id: editingHorario.id, input: values });
      setEditingHorario(null);
      report('Horario actualizado.');
      return;
    }

    await createDisponibilidad.mutateAsync(values);
    report('Horario creado.');
  }

  if (!isSupabaseConfigured) {
    return <EmptyState title="Supabase pendiente" text="Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para usar el panel." />;
  }

  if (isBarberiaLoading) {
    return <EmptyState title="Cargando panel" text="Estamos leyendo la barberia asociada a tu usuario admin." />;
  }

  const blocker = barberiaError instanceof Error ? barberiaError.message : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-panel">
        <div className="px-2 py-3">
          <p className="text-xs font-medium uppercase text-slate-500">Panel Admin</p>
          <h1 className="mt-1 text-xl font-bold text-ink">{barberia?.nombre ?? 'BarberApp'}</h1>
        </div>
        <nav className="mt-2 grid gap-1">
          {sections.map((item) => (
            <button
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                section === item.id ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
              }`}
              key={item.id}
              onClick={() => setSection(item.id)}
              type="button"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="space-y-6">
        {message ? <Alert tone="success">{message}</Alert> : null}
        {blocker ? <Alert tone="error">{blocker}</Alert> : null}

        {!barberia && section !== 'barberia' ? (
          <EmptyState title="Crea tu barberia" text="Antes de crear barberos, servicios y horarios, registra los datos de Mi Barberia." />
        ) : null}

        {section === 'resumen' ? (
          <Section title="Resumen">
            <div className="grid gap-4 md:grid-cols-3">
              <Metric icon={<CalendarDays size={18} />} label="Citas hoy" value={todayAppointments} />
              <Metric icon={<UserRound size={18} />} label="Barberos activos" value={activeBarbers} />
              <Metric icon={<Scissors size={18} />} label="Servicios activos" value={activeServices} />
            </div>
          </Section>
        ) : null}

        {section === 'barberos' && barberia ? (
          <Section title="Barberos">
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
                void setBarberoActivo.mutateAsync({ id: barbero.id, activo: !barbero.activo }).then(() => report(barbero.activo ? 'Barbero desactivado.' : 'Barbero activado.'));
              }}
            />
          </Section>
        ) : null}

        {section === 'servicios' && barberia ? (
          <Section title="Servicios">
            <ServicioForm
              isSaving={createServicio.isPending || updateServicio.isPending}
              onCancel={editingServicio ? () => setEditingServicio(null) : undefined}
              onSubmit={saveServicio}
              servicio={editingServicio}
            />
            <ServicioList
              onEdit={setEditingServicio}
              onToggle={(servicio) => {
                void setServicioActivo.mutateAsync({ id: servicio.id, activo: !servicio.activo }).then(() => report(servicio.activo ? 'Servicio desactivado.' : 'Servicio activado.'));
              }}
              servicios={servicios}
            />
          </Section>
        ) : null}

        {section === 'horarios' && barberia ? (
          <Section title="Horarios">
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
                void deleteDisponibilidad.mutateAsync(block.id).then(() => report('Horario eliminado.'));
              }}
              onEdit={setEditingHorario}
            />
          </Section>
        ) : null}

        {section === 'barberia' ? (
          <Section title="Mi Barberia">
            <BarberiaForm
              barberia={barberia}
              isSaving={createBarberia.isPending || updateBarberia.isPending}
              onSubmit={saveBarberia}
            />
          </Section>
        ) : null}
      </main>
    </div>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">{icon}{label}</div>
      <div className="text-3xl font-bold text-ink">{value}</div>
    </div>
  );
}

function Alert({ children, tone }: { children: ReactNode; tone: 'error' | 'success' }) {
  const className = tone === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-mint/20 bg-mint/10 text-ink';
  return <div className={`rounded-md border p-3 text-sm ${className}`}>{children}</div>;
}

function EmptyState({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-panel">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}
