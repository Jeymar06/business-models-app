import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import type { DisponibilidadInput } from '@/features/admin/adminService';
import type { Barbero, Disponibilidad } from '@/types/supabase.types';

export const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const horarioSchema = z
  .object({
    barberoId: z.string().min(1, 'Selecciona un barbero'),
    diaSemana: z.coerce.number().min(0).max(6),
    horaInicio: z.string().min(1),
    horaFin: z.string().min(1),
  })
  .refine((value) => value.horaInicio < value.horaFin, {
    message: 'La hora final debe ser mayor',
    path: ['horaFin'],
  });

export function HorarioForm({
  barberos,
  block,
  isSaving,
  onCancel,
  onSubmit,
}: {
  barberos: Barbero[];
  block?: Disponibilidad | null;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (values: DisponibilidadInput) => void;
}) {
  const form = useForm<DisponibilidadInput>({
    resolver: zodResolver(horarioSchema),
    defaultValues: { barberoId: '', diaSemana: 1, horaInicio: '09:00', horaFin: '18:00' },
  });

  useEffect(() => {
    form.reset({
      barberoId: block?.barbero_id ?? barberos[0]?.id ?? '',
      diaSemana: block?.dia_semana ?? 1,
      horaInicio: block?.hora_inicio.slice(0, 5) ?? '09:00',
      horaFin: block?.hora_fin.slice(0, 5) ?? '18:00',
    });
  }, [barberos, block, form]);

  return (
    <form className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_160px_140px_140px_auto_auto]" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Barbero
        <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" disabled={Boolean(block)} {...form.register('barberoId')}>
          <option value="">Selecciona</option>
          {barberos.map((barbero) => (
            <option key={barbero.id} value={barbero.id}>
              {barbero.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Dia
        <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" {...form.register('diaSemana')}>
          {weekDays.map((day, index) => (
            <option key={day} value={index}>
              {day}
            </option>
          ))}
        </select>
      </label>

      <Input label="Inicio" type="time" {...form.register('horaInicio')} />
      <Input label="Fin" type="time" {...form.register('horaFin')} />
      <Button className="self-end" disabled={!barberos.length || isSaving} type="submit">
        {isSaving ? 'Guardando...' : block ? 'Guardar' : 'Agregar'}
      </Button>
      {onCancel ? (
        <Button className="self-end" onClick={onCancel} type="button" variant="secondary">
          Cancelar
        </Button>
      ) : null}
      {Object.values(form.formState.errors).length ? (
        <p className="text-sm text-red-600 lg:col-span-6">Revisa barbero, dia y rango horario.</p>
      ) : null}
    </form>
  );
}
