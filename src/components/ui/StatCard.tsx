import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  tone?: 'cyan' | 'violet' | 'amber' | 'neutral';
}

const tones = {
  cyan: 'text-cyan-soft',
  violet: 'text-violet-soft',
  amber: 'text-amber-soft',
  neutral: 'text-ink',
};

export function StatCard({ label, value, sub, icon, tone = 'neutral' }: StatCardProps) {
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
        {icon && <span className={cn('shrink-0', tones[tone])}>{icon}</span>}
      </div>
      <p className={cn('mt-2 font-display text-2xl font-semibold', tones[tone])}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}
