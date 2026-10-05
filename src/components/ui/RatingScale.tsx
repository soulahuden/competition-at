import { cn } from '@/lib/cn';

interface RatingScaleProps {
  name: string;
  question: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

/** Skala 1–5, tanpa kolom komentar bebas (sesuai kebijakan peer review COM@T). */
export function RatingScale({
  name,
  question,
  value,
  onChange,
  lowLabel = 'Very poor',
  highLabel = 'Excellent',
}: RatingScaleProps) {
  return (
    <fieldset>
      <legend className="text-sm text-ink">{question}</legend>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={cn(
              'flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition',
              value === n
                ? 'border-cyan bg-cyan text-[#04222B]'
                : 'border-white/15 bg-white/5 text-ink-muted hover:border-cyan/40 hover:text-white',
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            {n}
          </label>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-ink-faint">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </fieldset>
  );
}
