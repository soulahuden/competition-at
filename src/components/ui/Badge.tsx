import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone =
  | 'neutral'
  | 'cyan'
  | 'violet'
  | 'amber'
  | 'success'
  | 'danger'
  | 'outline';

const tones: Record<BadgeTone, string> = {
  // Semua kombinasi di bawah diuji pada latar gelap: rasio teks >= 4.5:1
  neutral: 'bg-white/10 text-ink border-white/15',
  cyan: 'bg-cyan/15 text-cyan-soft border-cyan/35',
  violet: 'bg-violet/20 text-violet-soft border-violet/40',
  amber: 'bg-amber/15 text-amber-soft border-amber/40',
  success: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/35',
  danger: 'bg-rose-500/15 text-rose-200 border-rose-400/35',
  outline: 'bg-transparent text-ink-muted border-white/20',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  title?: string;
}

export function Badge({ tone = 'neutral', children, icon, className, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
