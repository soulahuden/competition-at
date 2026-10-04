import type { ReactNode } from 'react';
import { Telescope } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="glass flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-soft">
        {icon ?? <Telescope size={22} />}
      </div>
      <div>
        <p className="font-display text-base font-semibold text-white">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
