import { useState } from 'react';
import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  label?: string;
}

/** Tooltip sederhana: tampil saat hover maupun fokus keyboard. */
export function Tooltip({ content, children, label = 'More info' }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        className="inline-flex items-center gap-1 rounded text-ink-muted transition hover:text-cyan-soft"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        {children ?? <Info size={15} />}
      </button>
      {open && (
        <span
          role="tooltip"
          className="glass-strong absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-xl p-3 text-xs leading-relaxed text-ink"
        >
          {content}
        </span>
      )}
    </span>
  );
}
