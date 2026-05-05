import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import type { BarberiaInput } from '@/features/admin/adminService';
import type { Barberia } from '@/types/supabase.types';

const barberiaSchema = z.object({
  nombre: z.string().min(2, 'Escribe el nombre de la barberia'),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
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
    defaultValues: { nombre: '', direccion: '', telefono: '' },
  });

  useEffect(() => {
    form.reset({
      nombre: barberia?.nombre ?? '',
      direccion: barberia?.direccion ?? '',
      telefono: barberia?.telefono ?? '',
    });
  }, [barberia, form]);

  return (
    <form className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_180px_auto]" onSubmit={form.handleSubmit(onSubmit)}>
      <Input label="Nombre" {...form.register('nombre')} />
      <Input label="Direccion" {...form.register('direccion')} />
      <Input label="Telefono" {...form.register('telefono')} />
      <Button className="self-end" disabled={isSaving} type="submit">
        {isSaving ? 'Guardando...' : barberia ? 'Guardar' : 'Crear barberia'}
      </Button>
      {form.formState.errors.nombre ? <p className="text-sm text-red-600 md:col-span-4">{form.formState.errors.nombre.message}</p> : null}
    </form>
  );
}
