import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-ink text-white hover:bg-slate-800 focus-visible:ring-ink',
  secondary:
    'border border-slate-200 bg-white text-ink hover:border-steel hover:text-steel focus-visible:ring-steel',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-ink focus-visible:ring-slate-400',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
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
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      type={type}
      {...props}
    />
  );
}
