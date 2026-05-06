const variants = {
  pending: 'border-warning/20 bg-warning/12 text-warning',
  confirmed: 'border-mint/20 bg-mint/12 text-mint-dark',
  cancelled: 'border-danger/20 bg-danger/10 text-danger',
  completed: 'border-black/10 bg-black/6 text-steel',
  info: 'border-info/20 bg-info/10 text-info',
  neutral: 'border-black/10 bg-black/5 text-steel',
} as const;

export type BadgeVariant = keyof typeof variants;

export function Badge({
  children,
  className = '',
  variant = 'neutral',
}: {
  children: string;
  className?: string;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
        variants[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
