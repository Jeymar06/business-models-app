import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui';

import type { CreateBarberiaFormValues } from './schema';

const timezones = ['America/Bogota', 'America/Mexico_City', 'America/New_York', 'America/Lima', 'America/Santiago'];

export function Step4Config({
  errors,
  register,
}: {
  errors: FieldErrors<CreateBarberiaFormValues>;
  register: UseFormRegister<CreateBarberiaFormValues>;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p className="font-medium text-ink">Moneda fija</p>
          <p className="mt-1">Todas las barberias se publican en pesos colombianos (`COP`).</p>
          <input type="hidden" value="COP" {...register('moneda')} />
        </div>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Zona horaria
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" {...register('zonaHoraria')}>
            {timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Apertura" type="time" {...register('horarioApertura')} />
        <Input label="Cierre" type="time" {...register('horarioCierre')} />
        <Input label="Cancelacion permitida (min)" type="number" {...register('tiempoCancelacionMin')} />
      </div>

      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Politica de cancelacion
        <textarea
          className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
          {...register('politicaCancelacion')}
        />
      </label>
      <FieldError message={errors.politicaCancelacion?.message} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null;
}
