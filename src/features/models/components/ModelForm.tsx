import { type FormEvent, useState } from 'react';

import { Button, Input } from '@/components/ui';

import { createEmptyCanvas, type BusinessModelInput } from '../types';

type ModelFormProps = {
  isSubmitting?: boolean;
  onSubmit: (input: BusinessModelInput) => Promise<unknown> | unknown;
};

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ModelForm({ isSubmitting = false, onSubmit }: ModelFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modelType, setModelType] = useState('canvas');
  const [revenueStreams, setRevenueStreams] = useState('');
  const [costStructure, setCostStructure] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      name,
      description,
      modelType,
      revenueStreams: splitList(revenueStreams),
      costStructure: splitList(costStructure),
      canvas: createEmptyCanvas(),
    });

    setName('');
    setDescription('');
    setModelType('canvas');
    setRevenueStreams('');
    setCostStructure('');
  }

  return (
    <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-panel" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-lg font-semibold text-ink">Nuevo modelo</h2>
        <p className="text-sm text-slate-500">Define la base para analizarlo en el canvas.</p>
      </div>

      <Input
        label="Nombre"
        name="name"
        onChange={(event) => setName(event.target.value)}
        placeholder="SaaS de analitica"
        required
        value={name}
      />
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        Descripcion
        <textarea
          className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-steel focus:outline-none focus:ring-2 focus:ring-steel/20"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Problema, cliente y enfoque principal"
          value={description}
        />
      </label>
      <Input
        label="Tipo"
        name="modelType"
        onChange={(event) => setModelType(event.target.value)}
        placeholder="marketplace, SaaS, servicios"
        value={modelType}
      />
      <Input
        label="Fuentes de ingreso"
        name="revenueStreams"
        onChange={(event) => setRevenueStreams(event.target.value)}
        placeholder="Suscripcion, comision"
        value={revenueStreams}
      />
      <Input
        label="Estructura de costos"
        name="costStructure"
        onChange={(event) => setCostStructure(event.target.value)}
        placeholder="Cloud, soporte, ventas"
        value={costStructure}
      />
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Guardando...' : 'Crear modelo'}
      </Button>
    </form>
  );
}
