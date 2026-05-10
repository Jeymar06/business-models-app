import type { ReactNode } from 'react';

/* Pill — editorial tag for labels, eyebrows, status hints */

const tones = {
  gold:
    'border-gold-500/30 bg-gold-500/10 text-gold-200',
  cream:
    'border-cream/15 bg-cream/8 text-cream/80',
  ink:
    'border-ink/10 bg-ink/5 text-ink/70',
  mint:
    'border-mint/24 bg-mint/10 text-mint',
  outline:
    'border-white/14 bg-white/4 text-cream/75',
} as const;

export type PillTone = keyof typeof tones;

export function Pill({
  children,
  icon,
  tone = 'outline',
  className = '',
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]',
        'backdrop-blur-sm transition-colors duration-300',
        tones[tone],
        className,
      ].join(' ')}
    >
      {icon ? <span className="flex h-3.5 w-3.5 items-center justify-center">{icon}</span> : null}
      {children}
    </span>
  );
}
