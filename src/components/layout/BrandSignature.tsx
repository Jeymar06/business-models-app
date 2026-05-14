import { Link } from 'react-router-dom';

import { landingLogo } from '@/features/landing/data/landingMedia';

type BrandSignatureProps = {
  subtitle?: string;
  textTone?: 'dark' | 'light';
  to?: string;
};

export function BrandSignature({
  subtitle = 'Edicion editorial',
  textTone = 'light',
  to = '/',
}: BrandSignatureProps) {
  const secondaryTone = textTone === 'light' ? 'text-cream/55' : 'text-ink/45';
  const titleTone = textTone === 'light' ? 'text-cream' : 'text-ink';
  const hoverTone = textTone === 'light' ? 'group-hover:text-gold-200' : 'group-hover:text-gold-700';
  const frameTone = textTone === 'light'
    ? 'border-white/10 bg-white/5 group-hover:border-gold-500/40 group-hover:bg-white/10'
    : 'border-ink/10 bg-ink/4 group-hover:border-gold-500/35 group-hover:bg-gold-500/8';

  return (
    <Link className="group flex min-w-0 items-center gap-4" to={to}>
      <span
        className={[
          'h-12 w-12 overflow-hidden rounded-2xl border transition duration-500 sm:h-14 sm:w-14',
          frameTone,
        ].join(' ')}
      >
        <img
          alt="Barber Flow Editorial Edition"
          className="h-full w-full object-cover object-left transition duration-500 group-hover:scale-[1.04]"
          src={landingLogo}
        />
      </span>
      <div className="min-w-0 leading-tight">
        <span className={['eyebrow block transition duration-300', secondaryTone, hoverTone].join(' ')}>
          Barber Flow
        </span>
        <span
          className={[
            'font-display block truncate text-lg font-semibold tracking-tight transition duration-300 group-hover:translate-x-0.5 sm:text-[1.75rem]',
            titleTone,
          ].join(' ')}
        >
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
