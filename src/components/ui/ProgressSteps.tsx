import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ProgressStepsProps {
  steps: string[];
  current: number; // index 0-based
}

export function ProgressSteps({ steps, current }: ProgressStepsProps) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
                done && 'border-cyan bg-cyan text-[#04222B]',
                active && 'border-cyan bg-cyan/15 text-cyan-soft',
                !done && !active && 'border-white/20 bg-white/5 text-ink-faint',
              )}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span
              className={cn(
                'text-sm',
                active ? 'font-medium text-white' : 'text-ink-muted',
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-1 hidden h-px w-8 bg-white/15 sm:block" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
