import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function EmptyState({
  actionLabel,
  actionTo,
  description,
  title,
}: {
  actionLabel?: string;
  actionTo?: string;
  description: string;
  title: string;
}) {
  return (
    <div className="surface-panel rounded-[28px] border-dashed p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Sin contenido</p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{description}</p>
      {actionLabel && actionTo ? (
        <div className="mt-5">
          <Link to={actionTo}>
            <Button size="sm">{actionLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
