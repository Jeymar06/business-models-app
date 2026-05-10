import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Badge, Button, Pill } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BookingStepper } from '@/features/booking/components/BookingStepper';
import { BookingSuccess } from '@/features/booking/components/BookingSuccess';
import { bookingService } from '@/features/booking/bookingService';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { useSlots } from '@/features/booking/hooks/useSlots';
import { Step1Servicio } from '@/features/booking/steps/Step1Servicio';
import { Step2Barbero } from '@/features/booking/steps/Step2Barbero';
import { Step3Fecha } from '@/features/booking/steps/Step3Fecha';
import { Step4Confirmar } from '@/features/booking/steps/Step4Confirmar';

export function BookingPage() {
  const { barberia_id: barberiaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const booking = useBooking();
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const barberiaQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['booking', 'barberia', barberiaId],
    queryFn: () => bookingService.getBarberiaById(barberiaId!),
  });

  const serviciosQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['booking', 'servicios', barberiaId],
    queryFn: () => bookingService.getServiciosByBarberia(barberiaId!),
  });

  const barberosQuery = useQuery({
    enabled: Boolean(barberiaId),
    queryKey: ['booking', 'barberos', barberiaId],
    queryFn: () => bookingService.getBarberosByBarberia(barberiaId!),
  });

  const disponibilidadQuery = useQuery({
    enabled: Boolean(barberiaId && booking.currentStep >= 3),
    queryKey: ['booking', 'available-days', barberiaId, booking.barbero?.id ?? 'any'],
    queryFn: async () => {
      if (booking.barbero) return bookingService.getDisponibilidadByBarbero(booking.barbero.id);
      const barberos = barberosQuery.data ?? [];
      return bookingService.getDisponibilidadByBarberos(barberos.map((barbero) => barbero.id));
    },
  });

  const slotsQuery = useSlots({
    anyBarbero: booking.anyBarbero,
    barberiaId: barberiaId ?? '',
    barbero: booking.barbero,
    fecha: booking.fecha,
    servicio: booking.servicio,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user || !barberiaId || !booking.servicio || !booking.slot || !booking.fecha || !booking.slot.barbero_id) {
        throw new Error('Completa todos los pasos antes de confirmar.');
      }

      return bookingService.createCita({
        cliente_id: user.id,
        barberia_id: barberiaId,
        barbero_id: booking.slot.barbero_id,
        servicio_id: booking.servicio.id,
        fecha: bookingService.formatDate(booking.fecha),
        hora_inicio: booking.slot.hora_inicio,
        hora_fin: booking.slot.hora_fin,
        notas: booking.notas.trim() || null,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'No fue posible crear la cita.');
    },
    onSuccess: async (cita) => {
      setError(null);
      setSuccessId(cita.id);
      await queryClient.invalidateQueries({ queryKey: ['client', 'citas', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['booking', 'slots'] });
    },
  });

  const availableDays = useMemo(
    () => [...new Set((disponibilidadQuery.data ?? []).map((block) => block.dia_semana))],
    [disponibilidadQuery.data],
  );

  const barberia = barberiaQuery.data;

  if (!barberiaId) {
    return <MissingBarberia />;
  }

  if (barberiaQuery.isLoading) {
    return <PageState title="Cargando barbería" text="Estamos preparando el flujo de reserva." />;
  }

  if (!barberia || !barberia.activo || !barberia.acepta_reservas) {
    return <PageState title="Barbería no disponible" text="Esta barbería no existe o no acepta reservas por ahora." />;
  }

  if (successId) {
    return <BookingSuccess citaId={successId} onAgain={() => { setSuccessId(null); booking.resetBooking(); }} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] animate-fade-up">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] text-cream shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
          {barberia.banner_url ? (
            <div className="relative h-60 overflow-hidden">
              <img alt={barberia.nombre} className="h-full w-full object-cover" src={barberia.banner_url} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(20,18,16,0.95)_100%)]" />
            </div>
          ) : null}
          <div className="space-y-5 px-7 py-8 sm:px-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="confirmed">Reservas activas</Badge>
              <Pill tone="gold">Agendamiento</Pill>
            </div>
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
                {barberia.nombre}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-cream/68">{barberia.descripcion}</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-cream/65">
              <span className="flex items-center gap-2">
                <MapPin className="text-gold-300" size={16} />
                {barberia.direccion}, {barberia.ciudad}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="text-gold-300" size={16} />
                <span className="numeric">{barberia.telefono}</span>
              </span>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-danger/24 bg-danger/8 p-4 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <div className="rounded-[28px] border border-ink/8 bg-paper p-6 shadow-soft sm:p-8">
          <BookingStepper
            canGoNext={booking.canGoNext}
            currentStep={booking.currentStep}
            isFinalLoading={createMutation.isPending}
            onBack={booking.prevStep}
            onConfirm={() => createMutation.mutate()}
            onNext={booking.nextStep}
          >
            {booking.currentStep === 1 ? (
              <Step1Servicio onSelect={booking.selectServicio} selectedServicio={booking.servicio} servicios={serviciosQuery.data ?? []} />
            ) : null}
            {booking.currentStep === 2 ? (
              <Step2Barbero
                anyBarbero={booking.anyBarbero}
                barbero={booking.barbero}
                barberos={barberosQuery.data ?? []}
                onSelectAny={booking.selectAnyBarbero}
                onSelectBarbero={booking.selectBarbero}
              />
            ) : null}
            {booking.currentStep === 3 ? (
              <Step3Fecha
                availableDays={availableDays}
                fecha={booking.fecha}
                isLoading={slotsQuery.isLoading}
                onSelectFecha={booking.selectFecha}
                onSelectSlot={booking.selectSlot}
                selectedSlot={booking.slot}
                slots={slotsQuery.data ?? []}
              />
            ) : null}
            {booking.currentStep === 4 ? (
              <Step4Confirmar
                barberia={barberia}
                barbero={booking.barbero}
                fecha={booking.fecha}
                notas={booking.notas}
                onNotasChange={booking.setNotas}
                servicio={booking.servicio}
                slot={booking.slot}
              />
            ) : null}
          </BookingStepper>
        </div>
      </div>

      <aside className="h-fit rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft sm:sticky sm:top-24">
        <p className="eyebrow text-gold-700">Tu reserva</p>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Resumen
        </h2>
        <div className="mt-6 space-y-3">
          <SummaryRow label="Servicio" value={booking.servicio?.nombre ?? 'Selecciona un servicio'} active={Boolean(booking.servicio)} />
          <SummaryRow
            label="Barbero"
            value={booking.barbero?.nombre ?? (booking.anyBarbero ? 'Cualquier barbero disponible' : 'Selecciona un barbero')}
            active={Boolean(booking.barbero) || booking.anyBarbero}
          />
          <SummaryRow
            label="Horario"
            value={booking.slot ? `${booking.slot.hora_inicio} – ${booking.slot.hora_fin}` : 'Selecciona fecha y hora'}
            active={Boolean(booking.slot)}
            monospace
          />
        </div>
        <Button className="mt-7 w-full" onClick={() => navigate('/client-dashboard')} variant="outline-ink">
          Mis citas
        </Button>
      </aside>
    </div>
  );
}

function SummaryRow({
  active,
  label,
  monospace,
  value,
}: {
  active?: boolean;
  label: string;
  monospace?: boolean;
  value: string;
}) {
  return (
    <div
      className={[
        'rounded-2xl border px-4 py-3 transition-colors duration-300',
        active ? 'border-gold-500/24 bg-gold-500/6' : 'border-ink/8 bg-ink/3',
      ].join(' ')}
    >
      <p className="eyebrow text-ink/45">{label}</p>
      <p
        className={[
          'mt-2 text-sm font-medium text-ink',
          monospace ? 'numeric' : '',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}

function MissingBarberia() {
  return (
    <PageState title="Elige una barbería" text="Entra desde una barbería del marketplace para agendar una cita.">
      <Link to="/client-dashboard">
        <Button variant="primary">Ver barberías</Button>
      </Link>
    </PageState>
  );
}

function PageState({ children, text, title }: { title: string; text: string; children?: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-ink/8 bg-paper p-10 shadow-soft">
      <p className="eyebrow text-gold-700">Booking</p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink/60">{text}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
