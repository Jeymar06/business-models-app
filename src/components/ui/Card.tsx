import type { HTMLAttributes, ReactNode } from 'react';

/* =========================================================
   Card — editorial container primitive (UI/UX Pro Max)
   - tone: light (cream/paper) for inner pages
   - tone: dark for hero/featured areas
   - tone: muted (transparent on dark bg)
   ========================================================= */

const tones = {
  light:
    'bg-paper text-ink border-ink/8 shadow-soft hover:shadow-panel',
  cream:
    'bg-[linear-gradient(180deg,#FAF7F1_0%,#EFE9DC_100%)] text-ink border-ink/8 shadow-soft hover:shadow-panel',
  dark:
    'bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] text-cream border-white/8 shadow-[0_30px_80px_rgba(0,0,0,0.42)]',
  muted:
    'bg-[#141210] text-cream border-white/8',
  glass:
    'bg-white/4 text-cream border-white/10 backdrop-blur-xl',
} as const;

const radii = {
  md: 'rounded-[20px]',
  lg: 'rounded-[24px]',
  xl: 'rounded-[28px]',
  '2xl': 'rounded-[32px]',
  '3xl': 'rounded-[36px]',
} as const;

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 sm:p-7',
  xl: 'p-7 sm:p-8',
} as const;

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: keyof typeof tones;
  radius?: keyof typeof radii;
  padding?: keyof typeof paddings;
  interactive?: boolean;
  children?: ReactNode;
};

export function Card({
  className = '',
  tone = 'light',
  radius = 'xl',
  padding = 'lg',
  interactive = false,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'relative overflow-hidden border transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
        tones[tone],
        radii[radius],
        paddings[padding],
        interactive ? 'hover:-translate-y-0.5 hover:border-gold-500/30' : '',
        className,
      ].join(' ')}
      {...rest}
    />
  );
}

export function CardEyebrow({
  children,
  tone = 'auto',
  className = '',
}: {
  children: ReactNode;
  tone?: 'auto' | 'light' | 'dark' | 'gold';
  className?: string;
}) {
  const cls =
    tone === 'gold'
      ? 'text-gold-300'
      : tone === 'dark'
      ? 'text-cream/45'
      : tone === 'light'
      ? 'text-ink/50'
      : 'text-ink/50';
  return <p className={`eyebrow ${cls} ${className}`}>{children}</p>;
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`font-display text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </h2>
  );
}
