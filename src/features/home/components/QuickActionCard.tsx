import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function QuickActionCard({
  description,
  icon,
  title,
  to,
}: {
  description: string;
  icon: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <Link
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
      to={to}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-steel transition group-hover:bg-white">
        {icon}
      </div>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}
