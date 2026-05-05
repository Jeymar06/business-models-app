import { zodResolver } from '@hookform/resolvers/zod';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { CalendarDays, Scissors, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Doughnut } from 'react-chartjs-2';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { adminService } from '@/features/admin/adminService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Barbero, Barberia, Cita, Servicio } from '@/types/supabase.types';

ChartJS.register(ArcElement, Tooltip, Legend);

const barberSchema = z.object({ nombre: z.string().min(2, 'Nombre requerido'), fotoUrl: z.string().optional() });
const serviceSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  precio: z.coerce.number().positive('Precio requerido'),
  duracionMin: z.coerce.number().min(15).max(240),
});

type BarberForm = z.infer<typeof barberSchema>;
type ServiceForm = z.infer<typeof serviceSchema>;

export function AdminDashboard() {
  const { user } = useAuth();
  const [barberia, setBarberia] = useState<Barberia | null>(null);
  const [barbers, setBarbers] = useState<Barbero[]>([]);
  const [services, setServices] = useState<Servicio[]>([]);
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [error, setError] = useState<string | null>(null);

  const barberForm = useForm<BarberForm>({ resolver: zodResolver(barberSchema), defaultValues: { nombre: '', fotoUrl: '' } });
  const serviceForm = useForm<ServiceForm>({ resolver: zodResolver(serviceSchema), defaultValues: { nombre: '', precio: 35000, duracionMin: 40 } });

  async function refresh() {
    if (!user || !isSupabaseConfigured) return;
    const currentBarberia = await adminService.getMyBarberia(user.id);
    setBarberia(currentBarberia);
    if (!currentBarberia) return;
    const [nextBarbers, nextServices, nextAppointments] = await Promise.all([
      adminService.getBarbers(currentBarberia.id),
      adminService.getServices(currentBarberia.id),
      adminService.getAppointments(currentBarberia.id),
    ]);
    setBarbers(nextBarbers);
    setServices(nextServices);
    setAppointments(nextAppointments);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el panel'));
  }, [user]);

  const chartData = useMemo(() => ({
    labels: ['Pendientes', 'Confirmadas', 'Completadas', 'Canceladas'],
    datasets: [{
      data: ['pendiente', 'confirmada', 'completada', 'cancelada'].map((status) => appointments.filter((appointment) => appointment.estado === status).length),
      backgroundColor: ['#f9735b', '#3e6f8e', '#2bbf8a', '#94a3b8'],
      borderWidth: 0,
    }],
  }), [appointments]);

  async function addBarber(values: BarberForm) {
    if (!barberia) return;
    await adminService.createBarber({ barberiaId: barberia.id, nombre: values.nombre, fotoUrl: values.fotoUrl });
    barberForm.reset();
    await refresh();
  }

  async function addService(values: ServiceForm) {
    if (!barberia) return;
    await adminService.createService({ barberiaId: barberia.id, nombre: values.nombre, precio: values.precio, duracionMin: values.duracionMin });
    serviceForm.reset({ nombre: '', precio: 35000, duracionMin: 40 });
    await refresh();
  }

  if (!isSupabaseConfigured) {
    return <EmptyState title="Supabase pendiente" text="Configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para usar el panel real." />;
  }

  if (error) return <EmptyState title="No se pudo cargar" text={error} />;
  if (!barberia) return <EmptyState title="Barberia no encontrada" text="Crea una barberia asociada a tu usuario admin desde Supabase o el panel superadmin." />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">{barberia.nombre}</p>
        <h1 className="text-3xl font-bold text-ink">Panel de administracion</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={<UserRound size={18} />} label="Barberos" value={barbers.length} />
        <Metric icon={<Scissors size={18} />} label="Servicios" value={services.length} />
        <Metric icon={<CalendarDays size={18} />} label="Citas" value={appointments.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Barberos">
          <form className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={barberForm.handleSubmit(addBarber)}>
            <Input label="Nombre" {...barberForm.register('nombre')} />
            <Button className="self-end" type="submit">Agregar</Button>
          </form>
          <List items={barbers.map((barber) => barber.nombre)} />
        </Panel>

        <Panel title="Servicios">
          <form className="mb-4 grid gap-3 sm:grid-cols-3" onSubmit={serviceForm.handleSubmit(addService)}>
            <Input label="Nombre" {...serviceForm.register('nombre')} />
            <Input label="Precio" type="number" {...serviceForm.register('precio')} />
            <Input label="Minutos" type="number" {...serviceForm.register('duracionMin')} />
            <Button className="sm:col-span-3" type="submit">Crear servicio</Button>
          </form>
          <List items={services.map((service) => `${service.nombre} · $${service.precio.toLocaleString('es-CO')}`)} />
        </Panel>
      </div>

      <Panel title="Metricas">
        <div className="mx-auto max-w-xs">
          <Doughnut data={chartData} />
        </div>
      </Panel>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"><div className="mb-3 flex items-center gap-2 text-slate-500">{icon}{label}</div><div className="text-3xl font-bold text-ink">{value}</div></div>;
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"><h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>{children}</section>;
}

function List({ items }: { items: string[] }) {
  return <div className="divide-y divide-slate-100 text-sm">{items.length ? items.map((item) => <p className="py-3" key={item}>{item}</p>) : <p className="text-slate-500">Sin datos todavia.</p>}</div>;
}

function EmptyState({ text, title }: { text: string; title: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-panel"><h1 className="text-2xl font-bold text-ink">{title}</h1><p className="mt-2 text-slate-600">{text}</p></div>;
}
