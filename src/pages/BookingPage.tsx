import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { CalendarCheck, Check, Clock, Scissors, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui';
import { bookingService, type BookingSlot } from '@/features/booking/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Barbero, Barberia, Servicio } from '@/types/supabase.types';

const dateSchema = z.object({
  date: z.string().min(1, 'Selecciona una fecha'),
});

type DateForm = z.infer<typeof dateSchema>;

export function BookingPage() {
  const { user } = useAuth();
  const [barberias, setBarberias] = useState<Barberia[]>([]);
  const [services, setServices] = useState<Servicio[]>([]);
  const [barbers, setBarbers] = useState<Barbero[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedBarberia, setSelectedBarberia] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barbero | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, watch } = useForm<DateForm>({
    resolver: zodResolver(dateSchema),
    defaultValues: { date: format(addDays(new Date(), 1), 'yyyy-MM-dd') },
  });

  const selectedDate = watch('date');
  const step = selectedSlot ? 4 : selectedBarber ? 3 : selectedService ? 2 : 1;

  useEffect(() => {
    void bookingService.getBarberias().then((items) => {
      setBarberias(items);
      setSelectedBarberia(items[0]?.id ?? '');
    });
  }, []);

  useEffect(() => {
    if (!selectedBarberia) return;
    void Promise.all([bookingService.getServices(selectedBarberia), bookingService.getBarbers(selectedBarberia)]).then(
      ([nextServices, nextBarbers]) => {
        setServices(nextServices);
        setBarbers(nextBarbers);
      },
    );
  }, [selectedBarberia]);

  useEffect(() => {
    if (!selectedBarber || !selectedService || !selectedDate) return;
    void bookingService.getSlots(selectedBarber.id, selectedService, new Date(`${selectedDate}T00:00:00`)).then(setSlots);
  }, [selectedBarber, selectedDate, selectedService]);

  const summary = useMemo(
    () => [
      selectedService?.nombre,
      selectedBarber?.nombre,
      selectedSlot ? `${selectedSlot.fecha} ${selectedSlot.label}` : null,
    ].filter(Boolean),
    [selectedBarber, selectedService, selectedSlot],
  );

  async function confirmBooking() {
    if (!user || !selectedBarber || !selectedService || !selectedSlot) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await bookingService.createAppointment({
        clienteId: user.id,
        barberoId: selectedBarber.id,
        servicioId: selectedService.id,
        fecha: selectedSlot.fecha,
        hora: selectedSlot.hora,
      });
      setMessage('Cita creada. Te enviaremos confirmacion por email cuando el backend de notificaciones este activo.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible crear la cita.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-steel">Paso {step} de 4</p>
          <h1 className="text-3xl font-bold text-ink">Agenda tu cita</h1>
        </div>

        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Barberia
            <select className="h-10 rounded-md border border-slate-200 px-3" value={selectedBarberia} onChange={(event) => setSelectedBarberia(event.target.value)}>
              {barberias.map((barberia) => (
                <option key={barberia.id} value={barberia.id}>{barberia.nombre}</option>
              ))}
            </select>
          </label>
        </div>

        <Step title="1. Servicio" icon={<Scissors size={18} />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <button key={service.id} className={optionClass(selectedService?.id === service.id)} onClick={() => { setSelectedService(service); setSelectedBarber(null); setSelectedSlot(null); }} type="button">
                <span className="font-semibold">{service.nombre}</span>
                <span className="text-sm text-slate-500">${service.precio.toLocaleString('es-CO')} · {service.duracion_min} min</span>
              </button>
            ))}
          </div>
        </Step>

        {selectedService ? (
          <Step title="2. Barbero" icon={<UserRound size={18} />}>
            <div className="grid gap-3 sm:grid-cols-2">
              {barbers.map((barber) => (
                <button key={barber.id} className={optionClass(selectedBarber?.id === barber.id)} onClick={() => { setSelectedBarber(barber); setSelectedSlot(null); }} type="button">
                  <span className="font-semibold">{barber.nombre}</span>
                  <span className="text-sm text-slate-500">Disponible esta semana</span>
                </button>
              ))}
            </div>
          </Step>
        ) : null}

        {selectedBarber ? (
          <Step title="3. Hora" icon={<Clock size={18} />}>
            <input className="mb-4 h-10 rounded-md border border-slate-200 px-3 text-sm" min={format(new Date(), 'yyyy-MM-dd')} type="date" {...register('date')} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {slots.map((slot) => (
                <button key={`${slot.fecha}-${slot.hora}`} className={optionClass(selectedSlot?.hora === slot.hora)} onClick={() => setSelectedSlot(slot)} type="button">
                  {slot.label}
                </button>
              ))}
            </div>
          </Step>
        ) : null}
      </section>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-4 flex items-center gap-2 font-semibold text-ink">
          <CalendarCheck size={18} />
          Resumen
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          {summary.length ? summary.map((item) => <p key={item}>{item}</p>) : <p>Selecciona servicio, barbero y horario.</p>}
        </div>
        <Button className="mt-6 w-full" disabled={!selectedSlot || isSaving || Boolean(message)} onClick={confirmBooking}>
          <Check size={18} />
          {isSaving ? 'Confirmando...' : 'Confirmar cita'}
        </Button>
        {message ? <p className="mt-4 rounded-md bg-mint/10 p-3 text-sm text-ink">{message}</p> : null}
      </aside>
    </div>
  );
}

function Step({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">{icon}{title}</h2>
      {children}
    </section>
  );
}

function optionClass(active: boolean) {
  return [
    'min-h-16 rounded-md border p-4 text-left transition',
    active ? 'border-mint bg-mint/10 text-ink' : 'border-slate-200 bg-white text-slate-700 hover:border-steel',
  ].join(' ');
}
