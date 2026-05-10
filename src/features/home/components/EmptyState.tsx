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
    <div className="relative overflow-hidden rounded-[28px] border border-dashed border-ink/14 bg-paper p-7 shadow-soft sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-500/8 blur-3xl"
      />
      <p className="eyebrow relative text-gold-700">Sin contenido</p>
      <h3 className="font-display relative mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h3>
      <p className="relative mt-3 max-w-2xl text-sm leading-7 text-ink/60">{description}</p>
      {actionLabel && actionTo ? (
        <div className="relative mt-6">
          <Link to={actionTo}>
            <Button size="md" variant="primary">
              {actionLabel}
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
