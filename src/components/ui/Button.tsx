import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary:
    'bg-ink text-white shadow-soft hover:-translate-y-px hover:bg-[#1f1f1f] hover:shadow-panel active:translate-y-0 active:bg-black focus-visible:ring-ink/30',
  secondary:
    'bg-white text-ink shadow-soft ring-1 ring-black/8 hover:bg-mist hover:ring-black/12 active:bg-[#f3f4f6] focus-visible:ring-black/15',
  outline:
    'border border-white/18 bg-white/6 text-white backdrop-blur hover:bg-white/12 active:bg-white/16 focus-visible:ring-white/20',
  ghost:
    'bg-transparent text-steel hover:bg-black/5 hover:text-ink active:bg-black/10 focus-visible:ring-black/10',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      type={type}
      {...props}
    />
  );
}
