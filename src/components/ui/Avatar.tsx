import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';

const palettes = [
  'from-cyan/70 to-violet/70',
  'from-violet/70 to-fuchsia-500/60',
  'from-amber/70 to-orange-500/60',
  'from-sky-400/70 to-cyan/60',
  'from-emerald-400/70 to-cyan/60',
];

function paletteFor(seed: string) {
  const sum = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palettes[sum % palettes.length];
}

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display font-semibold text-space-950 ring-1 ring-white/20',
        paletteFor(name),
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
