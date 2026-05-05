import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import type { BarberoInput } from '@/features/admin/adminService';
import type { Barbero } from '@/types/supabase.types';

const barberoSchema = z.object({
  nombre: z.string().min(2, 'Escribe el nombre del barbero'),
  fotoUrl: z.string().optional(),
});

export function BarberoForm({
  barbero,
  isSaving,
  onCancel,
  onSubmit,
}: {
  barbero?: Barbero | null;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (values: BarberoInput) => void;
}) {
  const form = useForm<BarberoInput>({
    resolver: zodResolver(barberoSchema),
    defaultValues: { nombre: '', fotoUrl: '' },
  });

  useEffect(() => {
    form.reset({ nombre: barbero?.nombre ?? '', fotoUrl: barbero?.foto_url ?? '' });
  }, [barbero, form]);

  return (
    <form className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto_auto]" onSubmit={form.handleSubmit(onSubmit)}>
      <Input label="Nombre" {...form.register('nombre')} />
      <Input label="Foto URL" placeholder="https://..." {...form.register('fotoUrl')} />
      <Button className="self-end" disabled={isSaving} type="submit">
        {isSaving ? 'Guardando...' : barbero ? 'Guardar' : 'Crear'}
      </Button>
      {onCancel ? (
        <Button className="self-end" onClick={onCancel} type="button" variant="secondary">
          Cancelar
        </Button>
      ) : null}
      {form.formState.errors.nombre ? <p className="text-sm text-red-600 md:col-span-4">{form.formState.errors.nombre.message}</p> : null}
    </form>
  );
}
