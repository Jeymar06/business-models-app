import type { ButtonHTMLAttributes } from 'react';

/* =========================================================
   Button — UI/UX Pro Max v2
   Distinctive variants for editorial/barber aesthetic.
   - primary  : matte ink, subtle lift
   - gold     : signature CTA (gold gradient + soft glow)
   - secondary: cream paper, sharp edge on dark
   - outline  : glass on dark surfaces
   - ghost    : invisible until hovered
   Sizes pill or rounded-2xl by default.
   ========================================================= */

const variants = {
  primary:
    'bg-ink text-cream shadow-soft ring-1 ring-white/6 hover:-translate-y-px hover:bg-ink-soft hover:shadow-panel active:translate-y-0 active:bg-black focus-visible:ring-gold/40',
  gold:
    'bg-[linear-gradient(135deg,#E8C766_0%,#D4AF37_55%,#B89020_100%)] text-ink shadow-gold-soft ring-1 ring-gold-700/30 hover:-translate-y-px hover:shadow-[0_22px_50px_rgba(212,175,55,0.34)] hover:brightness-[1.04] active:translate-y-0 active:brightness-95 focus-visible:ring-gold-300/60',
  secondary:
    'bg-cream text-ink shadow-soft ring-1 ring-ink/8 hover:bg-mist hover:ring-ink/16 active:bg-[#ebe5d6] focus-visible:ring-ink/20',
  outline:
    'border border-white/14 bg-white/4 text-cream backdrop-blur hover:bg-white/10 hover:border-gold/30 active:bg-white/14 focus-visible:ring-white/24',
  'outline-ink':
    'border border-ink/12 bg-paper/0 text-ink hover:bg-ink/5 hover:border-ink/24 focus-visible:ring-ink/20',
  ghost:
    'bg-transparent text-cream/72 hover:bg-white/6 hover:text-cream active:bg-white/10 focus-visible:ring-white/20',
  'ghost-ink':
    'bg-transparent text-steel hover:bg-ink/5 hover:text-ink active:bg-ink/10 focus-visible:ring-ink/12',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-7 text-base',
};

const shapes = {
  rounded: 'rounded-2xl',
  pill: 'rounded-full',
  sharp: 'rounded-md',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  shape?: keyof typeof shapes;
};

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'group/btn relative inline-flex select-none items-center justify-center gap-2 font-semibold tracking-tight',
        'transition-[transform,background,box-shadow,color,border-color] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        shapes[shape],
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      type={type}
      {...props}
    />
  );
}
