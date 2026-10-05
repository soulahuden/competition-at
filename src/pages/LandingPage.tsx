import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { CometArc } from '@/components/space/CometArc';
import { useAuth } from '@/context/AuthContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

const EXIT_MS = 700;

const points = [
  {
    title: 'Open spots, per competition',
    body: 'See which teams still need people, for what role, and with which skills.',
  },
  {
    title: 'Track records that are checked',
    body: 'Wins are confirmed by organizers or teammates. Losses and dropouts show up too.',
  },
  {
    title: 'Reliability score',
    body: 'From peer reviews after each competition: effort, responsiveness, and seeing it through.',
  },
];

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);

  const handleStart = () => {
    if (leaving) return;
    login();
    if (reducedMotion) {
      navigate('/dashboard');
      return;
    }
    setLeaving(true);
    window.setTimeout(() => navigate('/dashboard'), EXIT_MS);
  };

  return (
    <div className="min-h-dvh">
      {/* Intro screen: headline and one button */}
      <section className="relative flex min-h-dvh flex-col overflow-hidden">
        <CometArc leaving={leaving} />

        {/* Bingkai tipis seperti jendela observasi */}
        <div
          aria-hidden="true"
          className="intro-frame pointer-events-none absolute inset-3 rounded-2xl border border-white/10 sm:inset-6"
        />

        {/* Kilat cahaya saat berpindah ke dashboard */}
        {leaving && (
          <div
            aria-hidden="true"
            className="intro-flash pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(207,250,254,0.9),rgba(34,211,238,0.35)_45%,transparent_70%)]"
          />
        )}

        <header className="relative z-10 px-6 py-6 sm:px-10">
          <Logo size="md" to="/" />
        </header>

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-4 sm:px-10">
          <div className={cn('w-full max-w-4xl text-center', leaving && 'intro-leaving')}>
            <h1
              className="intro-rise text-balance font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl"
              style={{ animationDelay: '1.05s' }}
            >
              Every Comet
              <br className="hidden sm:block" />{' '}
              <span className="text-cyan-soft">Needs a Crew</span>
            </h1>

            <p
              className="intro-rise mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-muted sm:text-lg"
              style={{ animationDelay: '1.25s' }}
            >
              Find teammates by skill and track record, not by group chat.
            </p>

            <div className="intro-rise mt-10" style={{ animationDelay: '1.45s' }}>
              <button
                onClick={handleStart}
                className="group relative inline-flex h-14 items-center gap-3 rounded-full border border-white/25 bg-white/10 px-9 text-base font-medium text-white backdrop-blur-md transition hover:border-cyan/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
              >
                Let&rsquo;s Go
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>

        <a
          href="#tentang"
          className={cn(
            'intro-rise relative z-10 mx-auto mb-8 inline-flex flex-col items-center gap-1 text-xs text-ink-faint transition hover:text-white',
            leaving && 'intro-leaving',
          )}
          style={{ animationDelay: '1.8s' }}
        >
          Why COM@T?
          <ChevronDown size={16} className={reducedMotion ? undefined : 'animate-floaty'} />
        </a>
      </section>

      {/* Short explainer below the intro */}
      <main id="tentang" className="mx-auto max-w-5xl px-6 py-24 sm:px-10 sm:py-32">
        <p className="max-w-2xl font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
          Finding teammates through group chats is exhausting. Posts get buried, the people who join
          aren't always serious, and someone always disappears the day before submission.
        </p>

        <dl className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {points.map((p) => (
            <div key={p.title} className="border-t border-white/15 pt-5">
              <dt className="font-medium text-white">{p.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{p.body}</dd>
            </div>
          ))}
        </dl>

        <button
          onClick={handleStart}
          className="mt-16 inline-flex items-center gap-2 text-sm font-medium text-cyan-soft transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
        >
          Enter COM@T <ArrowRight size={16} />
        </button>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo size="sm" to="/" />
          <p className="text-xs text-ink-faint">
            Prototype. All data here is sample data.
          </p>
        </div>
      </footer>
    </div>
  );
}
