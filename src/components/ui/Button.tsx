import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ' +
  'disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap';

const variants: Record<Variant, string> = {
  // #22D3EE dengan teks #04222B → rasio kontras ~9:1
  primary: 'bg-cyan text-[#04222B] hover:bg-cyan-soft active:bg-cyan-soft shadow-glow',
  // #7C3AED dipilih agar teks putih tetap >= 4.5:1 (violet default hanya 4.2:1)
  secondary: 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:bg-violet-deep',
  outline: 'border border-white/20 bg-white/5 text-ink hover:bg-white/10 hover:text-white',
  ghost: 'text-ink-muted hover:bg-white/10 hover:text-white',
  danger: 'border border-rose-400/40 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

export interface ButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, fullWidth, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  );
});

export interface LinkButtonProps extends CommonProps {
  to: string;
  state?: unknown;
}

export function LinkButton({
  to,
  state,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  children,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      state={state}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
    >
      {children}
    </Link>
  );
}
