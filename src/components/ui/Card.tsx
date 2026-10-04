import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ interactive, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'glass',
        interactive && 'transition hover:border-cyan/40 hover:bg-white/[0.07]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-5 pb-0', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-3 border-t border-white/10 p-5', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

interface SectionTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}

export function SectionTitle({ title, description, action, id }: SectionTitleProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-xl font-semibold sm:text-2xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
