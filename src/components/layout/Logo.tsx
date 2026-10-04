import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface LogoProps {
  to?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl sm:text-4xl',
};

/** Ikon komet kecil + wordmark COM@T. */
export function CometMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
      fill="none"
    >
      <defs>
        <linearGradient id="comet-tail" x1="2" y1="22" x2="18" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="0.55" stopColor="#22D3EE" stopOpacity="0.75" />
          <stop offset="1" stopColor="#CFFAFE" />
        </linearGradient>
      </defs>
      <path
        d="M2.5 21.5 15 9"
        stroke="url(#comet-tail)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M7 20.5 13.5 14" stroke="url(#comet-tail)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <circle cx="17.2" cy="6.8" r="3.4" fill="#CFFAFE" />
      <circle cx="17.2" cy="6.8" r="5.6" fill="#22D3EE" fillOpacity="0.22" />
    </svg>
  );
}

export function Logo({ to = '/', className, size = 'md' }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn('group inline-flex items-center gap-2', className)}
      aria-label="COM@T — beranda"
    >
      <CometMark className={size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'} />
      <span className={cn('font-display font-bold tracking-tight text-white', sizes[size])}>
        COM<span className="text-cyan">@</span>T
      </span>
    </Link>
  );
}
