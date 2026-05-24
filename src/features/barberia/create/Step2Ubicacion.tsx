import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui';
import { LocationPreview } from '@/components/location/LocationPreview';

import type { CreateBarberiaFormValues } from './schema';

export function Step2Ubicacion({
  ciudad,
  direccion,
  errors,
  pais,
  register,
}: {
  ciudad: string;
  direccion: string;
  errors: FieldErrors<CreateBarberiaFormValues>;
  pais: string;
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

      <LocationPreview
        ciudad={ciudad}
        description="Asi podran ver y abrir tu ubicacion los clientes dentro de Barber Flow."
        direccion={direccion}
        mapHeightClass="h-56"
        pais={pais}
        title="Previsualizacion del mapa"
      />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null;
}
