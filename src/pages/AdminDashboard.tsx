import { zodResolver } from '@hookform/resolvers/zod';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { CalendarDays, Clock, Pencil, Save, Scissors, Trash2, UserRound, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Doughnut } from 'react-chartjs-2';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { adminService } from '@/features/admin/adminService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Barbero, Barberia, Cita, Disponibilidad, Servicio } from '@/types/supabase.types';

ChartJS.register(ArcElement, Tooltip, Legend);

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const barberSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  fotoUrl: z.string().optional(),
});

const serviceSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  precio: z.coerce.number().positive('Precio requerido'),
  duracionMin: z.coerce.number().min(15).max(240),
});

const availabilitySchema = z
  .object({
    barberoId: z.string().min(1, 'Selecciona un barbero'),
    diaSemana: z.coerce.number().min(0).max(6),
    horaInicio: z.string().min(1),
    horaFin: z.string().min(1),
  })
  .refine((value) => value.horaInicio < value.horaFin, {
    message: 'La hora final debe ser mayor a la inicial',
    path: ['horaFin'],
  });

type BarberForm = z.infer<typeof barberSchema>;
type ServiceForm = z.infer<typeof serviceSchema>;
type AvailabilityForm = z.infer<typeof availabilitySchema>;

export function AdminDashboard() {
  const { user } = useAuth();
  const [barberia, setBarberia] = useState<Barberia | null>(null);
  const [barbers, setBarbers] = useState<Barbero[]>([]);
  const [services, setServices] = useState<Servicio[]>([]);
  const [availability, setAvailability] = useState<Disponibilidad[]>([]);
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingAvailabilityId, setEditingAvailabilityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const barberForm = useForm<BarberForm>({
    resolver: zodResolver(barberSchema),
    defaultValues: { nombre: '', fotoUrl: '' },
  });
  const barberEditForm = useForm<BarberForm>({ resolver: zodResolver(barberSchema) });
  const serviceForm = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { nombre: '', precio: 35000, duracionMin: 40 },
  });
  const serviceEditForm = useForm<ServiceForm>({ resolver: zodResolver(serviceSchema) });
  const availabilityForm = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { barberoId: '', diaSemana: 1, horaInicio: '09:00', horaFin: '18:00' },
  });
  const availabilityEditForm = useForm<AvailabilityForm>({ resolver: zodResolver(availabilitySchema) });

  async function refresh() {
    if (!user || !isSupabaseConfigured) return;
    setError(null);
    const currentBarberia = await adminService.getMyBarberia(user.id);
    setBarberia(currentBarberia);
    if (!currentBarberia) return;
    const [nextBarbers, nextServices, nextAvailability, nextAppointments] = await Promise.all([
      adminService.getBarbers(currentBarberia.id),
      adminService.getServices(currentBarberia.id),
      adminService.getAvailability(currentBarberia.id),
      adminService.getAppointments(currentBarberia.id),
    ]);
    setBarbers(nextBarbers);
    setServices(nextServices);
    setAvailability(nextAvailability);
    setAppointments(nextAppointments);
    if (!availabilityForm.getValues('barberoId') && nextBarbers[0]) {
      availabilityForm.setValue('barberoId', nextBarbers[0].id);
    }
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el panel'));
  }, [user]);

  const chartData = useMemo(
    () => ({
      labels: ['Pendientes', 'Confirmadas', 'Completadas', 'Canceladas'],
      datasets: [
        {
          data: ['pendiente', 'confirmada', 'completada', 'cancelada'].map(
            (status) => appointments.filter((appointment) => appointment.estado === status).length,
          ),
          backgroundColor: ['#f9735b', '#3e6f8e', '#2bbf8a', '#94a3b8'],
          borderWidth: 0,
        },
      ],
    }),
    [appointments],
  );

  async function runAction(action: () => Promise<void>, success: string) {
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(success);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la accion');
    }
  }

  async function addBarber(values: BarberForm) {
    if (!barberia) return;
    await runAction(async () => {
      await adminService.createBarber({ barberiaId: barberia.id, nombre: values.nombre, fotoUrl: values.fotoUrl });
      barberForm.reset({ nombre: '', fotoUrl: '' });
    }, 'Barbero creado.');
  }

  async function saveBarber(values: BarberForm) {
    if (!editingBarberId) return;
    await runAction(async () => {
      await adminService.updateBarber({ id: editingBarberId, nombre: values.nombre, fotoUrl: values.fotoUrl });
      setEditingBarberId(null);
    }, 'Barbero actualizado.');
  }

  async function addService(values: ServiceForm) {
    if (!barberia) return;
    await runAction(async () => {
      await adminService.createService({
        barberiaId: barberia.id,
        nombre: values.nombre,
        precio: values.precio,
        duracionMin: values.duracionMin,
      });
      serviceForm.reset({ nombre: '', precio: 35000, duracionMin: 40 });
    }, 'Servicio creado.');
  }

  async function saveService(values: ServiceForm) {
    if (!editingServiceId) return;
    await runAction(async () => {
      await adminService.updateService({
        id: editingServiceId,
        nombre: values.nombre,
        precio: values.precio,
        duracionMin: values.duracionMin,
      });
      setEditingServiceId(null);
    }, 'Servicio actualizado.');
  }

  async function addAvailability(values: AvailabilityForm) {
    await runAction(async () => {
      await adminService.createAvailability(values);
      availabilityForm.reset({ ...values, horaInicio: '09:00', horaFin: '18:00' });
    }, 'Horario creado.');
  }

  async function saveAvailability(values: AvailabilityForm) {
    if (!editingAvailabilityId) return;
    await runAction(async () => {
      await adminService.updateAvailability({
        id: editingAvailabilityId,
        diaSemana: values.diaSemana,
        horaInicio: values.horaInicio,
        horaFin: values.horaFin,
      });
      setEditingAvailabilityId(null);
    }, 'Horario actualizado.');
  }

  if (!isSupabaseConfigured) {
    return <EmptyState title="Supabase pendiente" text="Configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para usar el panel real." />;
  }

  if (!barberia && !error) {
    return <EmptyState title="Barberia no encontrada" text="Crea una barberia asociada a tu usuario admin desde Supabase o el panel superadmin." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-steel">{barberia?.nombre ?? 'Admin'}</p>
          <h1 className="text-3xl font-bold text-ink">Panel de administracion</h1>
        </div>
        <p className="text-sm text-slate-500">Fase 2: barberos, servicios y disponibilidad</p>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Metric icon={<UserRound size={18} />} label="Barberos" value={barbers.length} />
        <Metric icon={<Scissors size={18} />} label="Servicios" value={services.length} />
        <Metric icon={<Clock size={18} />} label="Bloques horario" value={availability.length} />
        <Metric icon={<CalendarDays size={18} />} label="Citas" value={appointments.length} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Barberos">
          <form className="mb-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={barberForm.handleSubmit(addBarber)}>
            <Input label="Nombre" {...barberForm.register('nombre')} />
            <Input label="Foto URL" placeholder="https://..." {...barberForm.register('fotoUrl')} />
            <Button className="self-end" type="submit">Agregar</Button>
          </form>

          <div className="space-y-3">
            {barbers.map((barber) =>
              editingBarberId === barber.id ? (
                <form className="grid gap-3 rounded-md border border-steel/30 bg-steel/5 p-3 md:grid-cols-[1fr_1fr_auto_auto]" key={barber.id} onSubmit={barberEditForm.handleSubmit(saveBarber)}>
                  <Input label="Nombre" {...barberEditForm.register('nombre')} />
                  <Input label="Foto URL" {...barberEditForm.register('fotoUrl')} />
                  <IconButton label="Guardar" type="submit"><Save size={16} /></IconButton>
                  <IconButton label="Cancelar" onClick={() => setEditingBarberId(null)} variant="secondary"><X size={16} /></IconButton>
                </form>
              ) : (
                <Row key={barber.id}>
                  <div>
                    <p className="font-semibold text-ink">{barber.nombre}</p>
                    <p className="text-xs text-slate-500">{barber.foto_url || 'Sin foto'}</p>
                  </div>
                  <Actions>
                    <IconButton label="Editar" onClick={() => {
                      setEditingBarberId(barber.id);
                      barberEditForm.reset({ nombre: barber.nombre, fotoUrl: barber.foto_url ?? '' });
                    }} variant="secondary"><Pencil size={16} /></IconButton>
                    <IconButton label="Eliminar" onClick={() => runAction(() => adminService.deleteBarber(barber.id), 'Barbero eliminado.')} variant="danger"><Trash2 size={16} /></IconButton>
                  </Actions>
                </Row>
              ),
            )}
            {!barbers.length ? <EmptyList text="No hay barberos creados." /> : null}
          </div>
        </Panel>

        <Panel title="Servicios">
          <form className="mb-5 grid gap-3 md:grid-cols-[1fr_120px_120px_auto]" onSubmit={serviceForm.handleSubmit(addService)}>
            <Input label="Nombre" {...serviceForm.register('nombre')} />
            <Input label="Precio" type="number" {...serviceForm.register('precio')} />
            <Input label="Minutos" type="number" {...serviceForm.register('duracionMin')} />
            <Button className="self-end" type="submit">Agregar</Button>
          </form>

          <div className="space-y-3">
            {services.map((service) =>
              editingServiceId === service.id ? (
                <form className="grid gap-3 rounded-md border border-steel/30 bg-steel/5 p-3 md:grid-cols-[1fr_120px_120px_auto_auto]" key={service.id} onSubmit={serviceEditForm.handleSubmit(saveService)}>
                  <Input label="Nombre" {...serviceEditForm.register('nombre')} />
                  <Input label="Precio" type="number" {...serviceEditForm.register('precio')} />
                  <Input label="Minutos" type="number" {...serviceEditForm.register('duracionMin')} />
                  <IconButton label="Guardar" type="submit"><Save size={16} /></IconButton>
                  <IconButton label="Cancelar" onClick={() => setEditingServiceId(null)} variant="secondary"><X size={16} /></IconButton>
                </form>
              ) : (
                <Row key={service.id}>
                  <div>
                    <p className="font-semibold text-ink">{service.nombre}</p>
                    <p className="text-xs text-slate-500">${service.precio.toLocaleString('es-CO')} · {service.duracion_min} min</p>
                  </div>
                  <Actions>
                    <IconButton label="Editar" onClick={() => {
                      setEditingServiceId(service.id);
                      serviceEditForm.reset({ nombre: service.nombre, precio: service.precio, duracionMin: service.duracion_min });
                    }} variant="secondary"><Pencil size={16} /></IconButton>
                    <IconButton label="Eliminar" onClick={() => runAction(() => adminService.deleteService(service.id), 'Servicio eliminado.')} variant="danger"><Trash2 size={16} /></IconButton>
                  </Actions>
                </Row>
              ),
            )}
            {!services.length ? <EmptyList text="No hay servicios creados." /> : null}
          </div>
        </Panel>
      </div>

      <Panel title="Disponibilidad semanal">
        <form className="mb-5 grid gap-3 lg:grid-cols-[1fr_160px_140px_140px_auto]" onSubmit={availabilityForm.handleSubmit(addAvailability)}>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Barbero
            <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" {...availabilityForm.register('barberoId')}>
              <option value="">Selecciona</option>
              {barbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.nombre}</option>)}
            </select>
          </label>
          <DaySelect label="Dia" register={availabilityForm.register('diaSemana')} />
          <Input label="Inicio" type="time" {...availabilityForm.register('horaInicio')} />
          <Input label="Fin" type="time" {...availabilityForm.register('horaFin')} />
          <Button className="self-end" disabled={!barbers.length} type="submit">Agregar</Button>
        </form>

        <div className="space-y-3">
          {availability.map((block) => {
            const barber = barbers.find((item) => item.id === block.barbero_id);
            return editingAvailabilityId === block.id ? (
              <form className="grid gap-3 rounded-md border border-steel/30 bg-steel/5 p-3 lg:grid-cols-[1fr_160px_140px_140px_auto_auto]" key={block.id} onSubmit={availabilityEditForm.handleSubmit(saveAvailability)}>
                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                  Barbero
                  <select className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm" disabled {...availabilityEditForm.register('barberoId')}>
                    {barbers.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                  </select>
                </label>
                <DaySelect label="Dia" register={availabilityEditForm.register('diaSemana')} />
                <Input label="Inicio" type="time" {...availabilityEditForm.register('horaInicio')} />
                <Input label="Fin" type="time" {...availabilityEditForm.register('horaFin')} />
                <IconButton label="Guardar" type="submit"><Save size={16} /></IconButton>
                <IconButton label="Cancelar" onClick={() => setEditingAvailabilityId(null)} variant="secondary"><X size={16} /></IconButton>
              </form>
            ) : (
              <Row key={block.id}>
                <div>
                  <p className="font-semibold text-ink">{barber?.nombre ?? 'Barbero'}</p>
                  <p className="text-xs text-slate-500">{days[block.dia_semana]} · {block.hora_inicio.slice(0, 5)} - {block.hora_fin.slice(0, 5)}</p>
                </div>
                <Actions>
                  <IconButton label="Editar" onClick={() => {
                    setEditingAvailabilityId(block.id);
                    availabilityEditForm.reset({
                      barberoId: block.barbero_id,
                      diaSemana: block.dia_semana,
                      horaInicio: block.hora_inicio.slice(0, 5),
                      horaFin: block.hora_fin.slice(0, 5),
                    });
                  }} variant="secondary"><Pencil size={16} /></IconButton>
                  <IconButton label="Eliminar" onClick={() => runAction(() => adminService.deleteAvailability(block.id), 'Horario eliminado.')} variant="danger"><Trash2 size={16} /></IconButton>
                </Actions>
              </Row>
            );
          })}
          {!availability.length ? <EmptyList text="No hay horarios configurados." /> : null}
        </div>
      </Panel>

      <Panel title="Metricas">
        <div className="mx-auto max-w-xs">
          <Doughnut data={chartData} />
        </div>
      </Panel>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">{icon}{label}</div>
      <div className="text-3xl font-bold text-ink">{value}</div>
    </div>
  );
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">{children}</div>;
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>;
}

function IconButton({ children, label, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; variant?: 'primary' | 'secondary' | 'danger' }) {
  const colors = {
    primary: 'bg-ink text-white hover:bg-slate-800',
    secondary: 'border border-slate-200 bg-white text-ink hover:border-steel hover:text-steel',
    danger: 'border border-red-100 bg-white text-red-600 hover:border-red-300 hover:bg-red-50',
  };

  return (
    <button
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-md text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${colors[variant]}`}
      title={label}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function DaySelect({ label, register }: { label: string; register: Record<string, unknown> }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label}
      <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" {...register}>
        {days.map((day, index) => <option key={day} value={index}>{day}</option>)}
      </select>
    </label>
  );
}

function Alert({ children, tone }: { children: ReactNode; tone: 'error' | 'success' }) {
  const className = tone === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-mint/20 bg-mint/10 text-ink';
  return <div className={`rounded-md border p-3 text-sm ${className}`}>{children}</div>;
}

function EmptyList({ text }: { text: string }) {
  return <p className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text}</p>;
}

function EmptyState({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-panel">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}
