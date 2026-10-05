import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-space-950/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo size="sm" />
        <p className="text-xs text-ink-faint">
          Prototype. All data here is sample data.
        </p>
      </div>
    </footer>
  );
}
