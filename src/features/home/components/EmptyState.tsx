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
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 shadow-panel">
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && actionTo ? (
        <div className="mt-4">
          <Link to={actionTo}>
            <Button size="sm">{actionLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
