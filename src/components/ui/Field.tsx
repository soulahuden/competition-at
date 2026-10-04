import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-xl border border-white/15 bg-space-900/70 px-3.5 py-2.5 text-sm text-ink ' +
  'placeholder:text-ink-faint transition focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30';

interface LabelWrapProps {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
  required?: boolean;
}

function LabelWrap({ label, hint, children, required }: LabelWrapProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-cyan-soft">*</span>}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  hint,
  required,
  className,
  ...rest
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <LabelWrap label={label} hint={hint} required={required}>
      {(id) => <input id={id} className={cn(control, className)} required={required} {...rest} />}
    </LabelWrap>
  );
}

export function TextAreaField({
  label,
  hint,
  required,
  className,
  ...rest
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <LabelWrap label={label} hint={hint} required={required}>
      {(id) => (
        <textarea id={id} className={cn(control, 'min-h-24', className)} required={required} {...rest} />
      )}
    </LabelWrap>
  );
}

export function SelectField({
  label,
  hint,
  required,
  className,
  children,
  ...rest
}: { label: string; hint?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <LabelWrap label={label} hint={hint} required={required}>
      {(id) => (
        <select id={id} className={cn(control, 'appearance-none pr-8', className)} {...rest}>
          {children}
        </select>
      )}
    </LabelWrap>
  );
}

/** Select ringkas untuk baris filter (label kecil di atas). */
export function FilterSelect({
  label,
  className,
  children,
  ...rest
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className="min-w-[9.5rem] flex-1">
      <label htmlFor={id} className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          'w-full appearance-none rounded-lg border border-white/15 bg-space-900/70 px-3 py-2 text-sm text-ink transition focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
