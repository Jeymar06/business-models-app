import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui';

import type { CreateBarberiaFormValues } from './schema';

export function Step2Ubicacion({
  errors,
  register,
}: {
  errors: FieldErrors<CreateBarberiaFormValues>;
  register: UseFormRegister<CreateBarberiaFormValues>;
}) {
  return (
    <div className="grid gap-4">
      <Input label="Direccion" {...register('direccion')} />
      <FieldError message={errors.direccion?.message} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input label="Ciudad" {...register('ciudad')} />
          <FieldError message={errors.ciudad?.message} />
        </div>
        <div>
          <Input label="Pais" {...register('pais')} />
          <FieldError message={errors.pais?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Estado / provincia" {...register('estadoProvincia')} />
        <Input label="Codigo postal" {...register('codigoPostal')} />
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null;
}
