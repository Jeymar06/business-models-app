import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { formatDate } from '@/utils/formatters';

import type { BusinessModel } from '../types';

export function ModelCard({ model }: { model: BusinessModel }) {
  return (
    <article className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">{model.name}</h2>
            <p className="text-sm capitalize text-steel">{model.modelType}</p>
          </div>
          <span className="rounded-full bg-mint/10 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {formatDate(model.createdAt)}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{model.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {model.revenueStreams.slice(0, 3).map((stream) => (
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600" key={stream}>
            {stream}
          </span>
        ))}
      </div>

      <Link to={`/models/${model.id}`}>
        <Button className="w-full" variant="secondary">
          Ver detalle
          <ArrowRight aria-hidden size={16} />
        </Button>
      </Link>
    </article>
  );
}
