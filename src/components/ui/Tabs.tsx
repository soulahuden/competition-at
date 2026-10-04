import { cn } from '@/lib/cn';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
  ariaLabel = 'Tab',
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition',
              active
                ? 'bg-cyan text-[#04222B]'
                : 'text-ink-muted hover:bg-white/10 hover:text-white',
            )}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] leading-none',
                  active ? 'bg-black/20 text-[#04222B]' : 'bg-white/10 text-ink-muted',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
