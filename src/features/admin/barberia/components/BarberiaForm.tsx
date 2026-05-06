import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import type { BarberiaInput } from '@/features/admin/adminService';
import type { Barberia } from '@/types/supabase.types';

const barberiaSchema = z.object({
  nombre: z.string().min(2, 'Escribe el nombre de la barberia'),
  descripcion: z.string().min(20, 'Agrega una descripcion de al menos 20 caracteres'),
  direccion: z.string().min(3, 'La direccion es requerida'),
  telefono: z.string().min(7, 'El telefono es requerido'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  pais: z.string().min(2, 'El pais es requerido'),
});

export function BarberiaForm({
  barberia,
  isSaving,
  onSubmit,
}: {
  barberia?: Barberia | null;
  isSaving?: boolean;
  onSubmit: (values: BarberiaInput) => void;
}) {
  const form = useForm<BarberiaInput>({
    resolver: zodResolver(barberiaSchema),
    defaultValues: { nombre: '', descripcion: '', direccion: '', telefono: '', ciudad: '', pais: 'Colombia' },
  });

  useEffect(() => {
    form.reset({
      nombre: barberia?.nombre ?? '',
      descripcion: barberia?.descripcion ?? '',
      direccion: barberia?.direccion ?? '',
      telefono: barberia?.telefono ?? '',
      ciudad: barberia?.ciudad ?? '',
      pais: barberia?.pais ?? 'Colombia',
    });
  }, [barberia, form]);

  return (
    <form className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <Input label="Nombre" {...form.register('nombre')} />
      <Input label="Telefono" {...form.register('telefono')} />
      <label className="grid gap-1.5 text-sm font-medium text-slate-700 md:col-span-2">
        Descripcion
        <textarea
          className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
          {...form.register('descripcion')}
        />
      </label>
      <Input label="Direccion" {...form.register('direccion')} />
      <Input label="Ciudad" {...form.register('ciudad')} />
      <Input label="Pais" {...form.register('pais')} />
      <Button className="self-end md:col-span-2" disabled={isSaving} type="submit">
        {isSaving ? 'Guardando...' : barberia ? 'Guardar' : 'Crear barberia'}
      </Button>
      {Object.values(form.formState.errors).length ? <p className="text-sm text-red-600 md:col-span-2">Revisa los campos obligatorios de la barberia.</p> : null}
    </form>
  );
}
