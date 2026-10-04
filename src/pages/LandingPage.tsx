import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Logo } from '@/components/layout/Logo';
import { CometArc } from '@/components/space/CometArc';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

const EXIT_MS = 700;

const features = [
  {
    icon: Search,
    title: 'Cari tim per lomba',
    body:
      'Satu tempat untuk melihat siapa yang sedang membentuk tim di setiap lomba, lengkap dengan role dan skill yang masih dibutuhkan.',
    tone: 'text-cyan-soft',
  },
  {
    icon: BadgeCheck,
    title: 'Rekam jejak terverifikasi',
    body:
      'Prestasi divalidasi penyelenggara atau rekan satu tim, bukan klaim sepihak. Riwayat kalah dan mundur juga ditampilkan apa adanya.',
    tone: 'text-violet-soft',
  },
  {
    icon: ShieldCheck,
    title: 'Skor reliabilitas',
    body:
      'Dihitung dari peer review tiap lomba: kontribusi, responsivitas, dan ketahanan sampai akhir. Bukan sekadar jumlah lomba yang diikuti.',
    tone: 'text-amber-soft',
  },
];

const problems = [
  'Cari anggota lewat grup chat yang tenggelam dalam hitungan menit.',
  'Tim terbentuk, lalu satu orang hilang tepat sebelum deadline submit.',
  'Tidak ada cara memastikan calon rekan benar-benar bisa diandalkan.',
];

export default function LandingPage() {
  const { login } = useAuth();
  const { competitions, students, teams } = useStore();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);

  const openCount = competitions.filter((c) => c.status === 'mendatang').length;

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
      {/* ——— Layar intro: hanya headline dan satu tombol ——— */}
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
            <p
              className="intro-rise inline-flex items-center gap-2 text-sm text-ink-muted"
              style={{ animationDelay: '0.9s' }}
            >
              <span className="relative flex h-2 w-2">
                {!reducedMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {openCount > 0
                ? `${openCount} lomba sedang membuka pendaftaran`
                : 'Platform kampus untuk tim lomba'}
            </p>

            <h1
              className="intro-rise mt-5 text-balance font-display text-5xl font-bold leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(34,211,238,0.25)] sm:text-7xl lg:text-8xl"
              style={{ animationDelay: '1.05s' }}
            >
              Tim Hebat
              <br className="hidden sm:block" />{' '}
              <span className="bg-gradient-to-r from-cyan-soft via-white to-violet-soft bg-clip-text text-transparent">
                Bukan Kebetulan
              </span>
            </h1>

            <p
              className="intro-rise mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-muted sm:text-lg"
              style={{ animationDelay: '1.25s' }}
            >
              COM@T mempertemukan mahasiswa lintas jurusan lewat skill, rekam jejak, dan skor
              reliabilitas — bukan lewat grup chat yang tenggelam dalam hitungan menit.
            </p>

            <div className="intro-rise mt-10" style={{ animationDelay: '1.45s' }}>
              <button
                onClick={handleStart}
                className="group relative inline-flex h-14 items-center gap-3 rounded-full border border-white/25 bg-white/10 px-9 text-base font-medium text-white backdrop-blur-md transition hover:border-cyan/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
              >
                <span className="absolute inset-0 -z-10 rounded-full bg-cyan/20 opacity-0 blur-xl transition group-hover:opacity-100" />
                Let&rsquo;s Go
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <p className="mt-4 text-xs text-ink-faint">
                Login mock — langsung masuk tanpa form. Seluruh data adalah contoh.
              </p>
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
          Gulir untuk kenal COM@T
          <ChevronDown size={16} className={reducedMotion ? undefined : 'animate-floaty'} />
        </a>
      </section>

      {/* ——— Materi presentasi di bawah layar intro ——— */}
      <main id="tentang">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: Trophy, value: competitions.length, label: 'Lomba di katalog' },
              { icon: Users, value: students.length, label: 'Mahasiswa terdaftar' },
              { icon: ShieldCheck, value: teams.length, label: 'Tim terbentuk' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass p-5 text-center">
                  <Icon size={20} className="mx-auto text-cyan-soft" />
                  <p className="mt-2 font-display text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="glass mx-auto max-w-4xl p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Masalahnya bukan kurang lomba — tapi kurang tim yang solid
            </h2>
            <p className="mt-3 leading-relaxed text-ink-muted">
              Setiap semester ada puluhan lomba yang bisa diikuti. Yang sulit adalah menemukan tiga
              atau empat orang yang skill-nya saling melengkapi dan mau bertahan sampai hari
              penjurian.
            </p>
            <ul className="mt-6 space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-ink-muted">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="keunggulan" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Tiga keunggulan utama</h2>
            <p className="mt-3 text-ink-muted">
              Dibangun untuk menjawab satu pertanyaan: siapa yang layak jadi rekan timmu?
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title} className="glass p-6">
                  <span
                    className={`inline-flex rounded-xl border border-white/10 bg-white/5 p-3 ${f.tone}`}
                  >
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="glass mx-auto max-w-3xl p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Siap membentuk tim untuk lomba berikutnya?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Masuk untuk melihat dashboard, katalog lomba, dan mahasiswa yang sedang mencari tim.
            </p>
            <Button size="lg" className="mt-7" onClick={handleStart}>
              Masuk ke COM@T <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo size="sm" to="/" />
          <p className="text-xs text-ink-faint">
            COM@T — Competition At · Prototipe frontend, data contoh.
          </p>
        </div>
      </footer>
    </div>
  );
}
