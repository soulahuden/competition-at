import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Medal, Trophy } from 'lucide-react';
import {
  Avatar,
  Badge,
  EmptyState,
  FilterSelect,
  SectionTitle,
  Tooltip,
} from '@/components/ui';
import { categories } from '@/components/domain/competitionMeta';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { getLeaderboard, cohortOptions } from '@/services/leaderboardService';
import { POINT_RULES_TOOLTIP } from '@/lib/points';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { CompetitionCategory, LeaderboardEntry, LeaderboardPeriod } from '@/types';

const podiumStyle = [
  { order: 'sm:order-2', height: 'sm:h-40', ring: 'ring-amber/50', tone: 'text-amber' },
  { order: 'sm:order-1', height: 'sm:h-32', ring: 'ring-white/30', tone: 'text-ink' },
  { order: 'sm:order-3', height: 'sm:h-28', ring: 'ring-violet/50', tone: 'text-violet-soft' },
];

export default function LeaderboardPage() {
  const { version } = useStore();
  const { currentUserId } = useAuth();

  const [period, setPeriod] = useState<LeaderboardPeriod>('semester');
  const [cohort, setCohort] = useState<number | 'semua'>('semua');
  const [category, setCategory] = useState<CompetitionCategory | 'semua'>('semua');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getLeaderboard({ period, cohort, category }).then((list) => {
      if (!active) return;
      setEntries(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [period, cohort, category, version]);

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Leaderboard"
        description="Peringkat mahasiswa berdasarkan poin keaktifan dan poin kemenangan."
        action={
          <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
            Cara poin dihitung
            <Tooltip content={POINT_RULES_TOOLTIP} label="Penjelasan perhitungan poin" />
          </span>
        }
      />

      <div className="glass flex flex-wrap items-end gap-3 p-4">
        <FilterSelect
          label="Periode"
          value={period}
          onChange={(e) => setPeriod(e.target.value as LeaderboardPeriod)}
        >
          <option value="semester">Semester ini</option>
          <option value="tahun">Tahun akademik ini</option>
        </FilterSelect>

        <FilterSelect
          label="Angkatan"
          value={String(cohort)}
          onChange={(e) => setCohort(e.target.value === 'semua' ? 'semua' : Number(e.target.value))}
        >
          <option value="semua">Semua angkatan</option>
          {cohortOptions.map((c) => (
            <option key={c} value={c}>
              Angkatan {c}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Kategori lomba"
          value={category}
          onChange={(e) => setCategory(e.target.value as CompetitionCategory | 'semua')}
        >
          <option value="semua">Semua kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </FilterSelect>
      </div>

      {loading ? (
        <div className="glass h-96 animate-pulse" />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Trophy size={22} />}
          title="Belum ada data peringkat"
          description="Coba ganti filter periode, angkatan, atau kategori lomba."
        />
      ) : (
        <>
          <section aria-label="Tiga besar" className="grid gap-4 sm:grid-cols-3 sm:items-end">
            {podium.map((entry, i) => {
              const style = podiumStyle[i];
              const isMe = entry.student.id === currentUserId;
              return (
                <div
                  key={entry.student.id}
                  className={cn(
                    'glass flex flex-col items-center gap-2 p-5 text-center',
                    style.order,
                    isMe && 'border-cyan/50 bg-cyan/10',
                  )}
                >
                  <span className={cn('flex items-center gap-1.5', style.tone)}>
                    {i === 0 ? <Crown size={20} /> : <Medal size={18} />}
                    <span className="font-display text-sm font-semibold">#{entry.rank}</span>
                  </span>
                  <Avatar name={entry.student.name} size="lg" className={cn('ring-2', style.ring)} />
                  <Link
                    to={`/profil/${entry.student.id}`}
                    className="font-display font-semibold text-white hover:text-cyan-soft"
                  >
                    {entry.student.name}
                  </Link>
                  <p className="text-xs text-ink-muted">
                    {entry.student.major} · {entry.student.cohort}
                  </p>
                  <p className="font-display text-2xl font-bold text-amber">
                    {formatNumber(entry.totalPoints)}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {formatNumber(entry.activityPoints)} keaktifan +{' '}
                    {formatNumber(entry.winPoints)} kemenangan
                  </p>
                  {isMe && <Badge tone="cyan">Kamu</Badge>}
                </div>
              );
            })}
          </section>

          <section className="glass overflow-hidden" aria-label="Tabel peringkat">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-ink-faint">
                    <th scope="col" className="px-5 py-3 font-medium">#</th>
                    <th scope="col" className="px-5 py-3 font-medium">Nama</th>
                    <th scope="col" className="px-5 py-3 font-medium">Angkatan</th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        Total poin
                        <Tooltip content={POINT_RULES_TOOLTIP} label="Penjelasan total poin" />
                      </span>
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">Keaktifan</th>
                    <th scope="col" className="px-5 py-3 font-medium">Kemenangan</th>
                    <th scope="col" className="px-5 py-3 font-medium">Lomba</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((entry) => {
                    const isMe = entry.student.id === currentUserId;
                    return (
                      <tr
                        key={entry.student.id}
                        className={cn(
                          'border-b border-white/5 last:border-b-0 transition',
                          isMe ? 'bg-cyan/10' : 'hover:bg-white/5',
                        )}
                      >
                        <td className="px-5 py-3 font-display font-semibold text-ink-muted">
                          {entry.rank}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={entry.student.name} size="xs" />
                            <div className="min-w-0">
                              <Link
                                to={`/profil/${entry.student.id}`}
                                className="font-medium text-white hover:text-cyan-soft"
                              >
                                {entry.student.name}
                              </Link>
                              <p className="text-xs text-ink-faint">{entry.student.major}</p>
                            </div>
                            {isMe && <Badge tone="cyan">Kamu</Badge>}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-muted">{entry.student.cohort}</td>
                        <td className="px-5 py-3 font-display font-semibold text-amber">
                          {formatNumber(entry.totalPoints)}
                        </td>
                        <td className="px-5 py-3 text-ink-muted">
                          {formatNumber(entry.activityPoints)}
                        </td>
                        <td className="px-5 py-3 text-ink-muted">
                          {formatNumber(entry.winPoints)}
                        </td>
                        <td className="px-5 py-3 text-ink-muted">{entry.competitions}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {rest.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-ink-muted">
                Hanya ada tiga peserta pada filter ini.
              </p>
            )}
          </section>

          <p className="text-xs text-ink-faint">
            Poin hanya didapat dari lomba yang didaftarkan lewat COM@T sebelum lomba dimulai. Bobot
            poin mengikuti tier lomba: Internal ×1, Regional ×2, Nasional ×3, Internasional ×4.
          </p>
        </>
      )}
    </div>
  );
}
