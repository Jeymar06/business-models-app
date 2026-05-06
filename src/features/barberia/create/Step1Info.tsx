import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui';

import type { CreateBarberiaFormValues } from './schema';

export function Step1Info({
  errors,
  register,
}: {
  errors: FieldErrors<CreateBarberiaFormValues>;
  register: UseFormRegister<CreateBarberiaFormValues>;
}) {
  return (
    <div className="grid gap-4">
      <Input label="Nombre de la barberia" {...register('nombre')} />
      <FieldError message={errors.nombre?.message} />

      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Descripcion
        <textarea
          className="min-h-28 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
          {...register('descripcion')}
        />
      </label>
      <FieldError message={errors.descripcion?.message} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input label="Telefono" {...register('telefono')} />
          <FieldError message={errors.telefono?.message} />
        </div>
        <div>
          <Input label="Email de contacto" {...register('emailContacto')} />
          <FieldError message={errors.emailContacto?.message} />
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null;
}
