import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import { reliabilityView } from '@/lib/reliability';
import { cn } from '@/lib/cn';
import type { Student } from '@/types';

const toneClass = {
  positive: 'text-emerald-200',
  neutral: 'text-cyan-soft',
  warning: 'text-amber-soft',
  unknown: 'text-ink-faint',
};

interface ReliabilityScoreProps {
  student: Student;
  size?: 'sm' | 'lg';
  showLabel?: boolean;
}

export function ReliabilityScore({ student, size = 'sm', showLabel = true }: ReliabilityScoreProps) {
  const view = reliabilityView(student);

  return (
    <span className="inline-flex items-center gap-2">
      <span className={toneClass[view.tone]}>
        {view.hasEnoughData ? <ShieldCheck size={size === 'lg' ? 20 : 15} /> : <ShieldQuestion size={size === 'lg' ? 20 : 15} />}
      </span>
      <span>
        <span
          className={cn(
            'font-display font-semibold',
            size === 'lg' ? 'text-2xl' : 'text-sm',
            toneClass[view.tone],
          )}
        >
          {view.hasEnoughData ? `${view.score}` : 'Belum cukup data'}
        </span>
        {view.hasEnoughData && showLabel && (
          <span className="ml-1.5 text-xs text-ink-muted">{view.label}</span>
        )}
      </span>
    </span>
  );
}
