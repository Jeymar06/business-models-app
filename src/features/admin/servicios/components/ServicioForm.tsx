import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import type { ServicioInput } from '@/features/admin/adminService';
import type { Servicio } from '@/types/supabase.types';

const servicioSchema = z.object({
  nombre: z.string().min(2, 'Escribe el nombre del servicio'),
  descripcion: z.string().optional(),
  precio: z.coerce.number().positive('Precio requerido'),
  duracionMin: z.coerce.number().min(15, 'Minimo 15 minutos').max(240, 'Maximo 240 minutos'),
});

export function ServicioForm({
  isSaving,
  onCancel,
  onSubmit,
  servicio,
}: {
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (values: ServicioInput) => void;
  servicio?: Servicio | null;
}) {
  const form = useForm<ServicioInput>({
    resolver: zodResolver(servicioSchema),
    defaultValues: { nombre: '', descripcion: '', precio: 35000, duracionMin: 45 },
  });

  useEffect(() => {
    form.reset({
      nombre: servicio?.nombre ?? '',
      descripcion: servicio?.descripcion ?? '',
      precio: servicio?.precio ?? 35000,
      duracionMin: servicio?.duracion_min ?? 45,
    });
  }, [form, servicio]);

  return (
    <form className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_1fr_130px_130px_auto_auto]" onSubmit={form.handleSubmit(onSubmit)}>
      <Input label="Nombre" {...form.register('nombre')} />
      <Input label="Descripcion" {...form.register('descripcion')} />
      <Input label="Precio" type="number" {...form.register('precio')} />
      <Input label="Minutos" type="number" {...form.register('duracionMin')} />
      <Button className="self-end" disabled={isSaving} type="submit">
        {isSaving ? 'Guardando...' : servicio ? 'Guardar' : 'Crear'}
      </Button>
      {onCancel ? (
        <Button className="self-end" onClick={onCancel} type="button" variant="secondary">
          Cancelar
        </Button>
      ) : null}
      {Object.values(form.formState.errors).length ? (
        <p className="text-sm text-red-600 lg:col-span-6">Revisa nombre, precio y duracion.</p>
      ) : null}
    </form>
  );
}
