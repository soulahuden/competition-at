import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarClock,
  Coins,
  MapPin,
  Medal,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, LinkButton } from '@/components/ui';
import {
  posterGradient,
  statusLabel,
  statusTone,
  tierTone,
} from '@/components/domain/competitionMeta';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { deadlineLabel, formatDate, formatRupiah } from '@/lib/format';
import NotFoundPage from './NotFoundPage';

const rankLabel: Record<number, string> = {
  1: 'Juara 1',
  2: 'Juara 2',
  3: 'Juara 3',
  0: 'Finalis',
};

const rankTone = (rank: number) =>
  rank === 1 ? 'amber' : rank === 2 ? 'neutral' : rank === 3 ? 'violet' : 'outline';

export default function CompetitionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { competitions, teams, students, loading } = useStore();
  const { currentUserId } = useAuth();

  const competition = competitions.find((c) => c.id === id);

  if (loading) return <div className="glass h-96 animate-pulse" />;
  if (!competition) return <NotFoundPage />;

  const registeredTeams = teams.filter((t) => t.competitionId === competition.id);
  const teamsWithSlots = registeredTeams.filter((t) => t.openSlots.some((s) => !s.filled));
  const myTeam = registeredTeams.find((t) =>
    t.members.some((m) => m.studentId === currentUserId),
  );
  const registrationClosed = competition.status !== 'mendatang';

  return (
    <div className="space-y-6">
      <Link
        to="/lomba"
        className="inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-white"
      >
        <ArrowLeft size={16} /> Kembali ke daftar lomba
      </Link>

      <header className="glass overflow-hidden">
        <div
          className={`relative h-32 bg-gradient-to-br sm:h-40 ${
            posterGradient[competition.poster] ?? posterGradient.cyan
          }`}
        >
          <div className="absolute inset-0 bg-space-950/40" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            {competition.featured && (
              <Badge tone="amber" icon={<Sparkles size={12} />}>
                Featured
              </Badge>
            )}
            <Badge tone={statusTone[competition.status]}>{statusLabel[competition.status]}</Badge>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{competition.name}</h1>
              <p className="mt-1 text-ink-muted">{competition.organizer}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="outline">{competition.category}</Badge>
                <Badge tone={tierTone[competition.tier]}>{competition.tier}</Badge>
                {competition.benefits.map((b) => (
                  <Badge key={b} tone="success">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {myTeam ? (
                <LinkButton to="/tim" variant="outline">
                  <Users size={16} /> Tim kamu: {myTeam.name}
                </LinkButton>
              ) : (
                <Button
                  disabled={registrationClosed}
                  onClick={() =>
                    navigate('/tim', { state: { createForCompetition: competition.id } })
                  }
                >
                  <UserPlus size={16} />
                  {registrationClosed ? 'Pendaftaran ditutup' : 'Daftarkan Tim'}
                </Button>
              )}
              <p className="text-right text-xs text-ink-faint">
                {deadlineLabel(competition.registrationDeadline)}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-4">
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-faint">
                <CalendarClock size={13} /> Pelaksanaan
              </dt>
              <dd className="mt-1 text-sm text-ink">
                {formatDate(competition.startDate)} – {formatDate(competition.endDate)}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-faint">
                <Users size={13} /> Ukuran tim
              </dt>
              <dd className="mt-1 text-sm text-ink">
                {competition.teamSizeMin}–{competition.teamSizeMax} orang
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-faint">
                <Coins size={13} /> Biaya
              </dt>
              <dd className="mt-1 text-sm text-ink">{formatRupiah(competition.fee)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-faint">
                <MapPin size={13} /> Lokasi
              </dt>
              <dd className="mt-1 text-sm text-ink">{competition.location}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="glass p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold">Deskripsi</h2>
            <p className="mt-2 leading-relaxed text-ink-muted">{competition.description}</p>
          </section>

          {competition.status === 'selesai' && competition.winners && (
            <section className="glass p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Medal size={18} className="text-amber" /> Pemenang
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-ink-faint">
                      <th scope="col" className="pb-2 pr-4 font-medium">Peringkat</th>
                      <th scope="col" className="pb-2 pr-4 font-medium">Tim</th>
                      <th scope="col" className="pb-2 font-medium">Anggota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competition.winners.map((w) => (
                      <tr key={w.teamId} className="border-b border-white/5 last:border-b-0">
                        <td className="py-3 pr-4">
                          <Badge tone={rankTone(w.rank)}>{rankLabel[w.rank]}</Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-white">{w.teamName}</p>
                          {w.note && <p className="text-xs text-ink-faint">{w.note}</p>}
                        </td>
                        <td className="py-3">
                          {w.memberIds.length === 0 ? (
                            <span className="text-ink-faint">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {w.memberIds.map((mid) => {
                                const s = students.find((x) => x.id === mid);
                                if (!s) return null;
                                return (
                                  <Link
                                    key={mid}
                                    to={`/profil/${mid}`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-2.5 text-xs text-ink transition hover:border-cyan/40 hover:text-white"
                                  >
                                    <Avatar name={s.name} size="xs" />
                                    {s.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="glass p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold">
              Tim terdaftar
              <span className="ml-2 text-sm font-normal text-ink-faint">
                ({registeredTeams.length})
              </span>
            </h2>
            {registeredTeams.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                Belum ada tim yang mendaftar lewat COM@T untuk lomba ini.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {registeredTeams.map((team) => (
                  <li
                    key={team.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white">{team.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {team.members.length} anggota ·{' '}
                        {team.members.filter((m) => m.confirmed).length} terkonfirmasi
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {team.members.map((m) => {
                        const s = students.find((x) => x.id === m.studentId);
                        return s ? (
                          <Avatar key={m.studentId} name={s.name} size="xs" className="ring-2 ring-space-900" />
                        ) : null;
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass p-5">
            <h2 className="font-display text-lg font-semibold">Timeline</h2>
            <ol className="mt-4 space-y-4">
              {competition.timeline.map((item, i) => (
                <li key={`${item.label}-${i}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        item.done ? 'bg-cyan' : 'border border-white/30 bg-transparent'
                      }`}
                      aria-hidden="true"
                    />
                    {i < competition.timeline.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-white/10" aria-hidden="true" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className={item.done ? 'text-sm text-ink' : 'text-sm text-ink-muted'}>
                      {item.label}
                    </p>
                    <p className="text-xs text-ink-faint">{formatDate(item.date)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="glass p-5">
            <h2 className="font-display text-lg font-semibold">Tim yang masih butuh anggota</h2>
            {teamsWithSlots.length === 0 ? (
              <div className="mt-3">
                <EmptyState
                  icon={<Users size={20} />}
                  title="Tidak ada slot kosong"
                  description="Semua tim di lomba ini sudah lengkap."
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {teamsWithSlots.map((team) => (
                  <li key={team.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">{team.name}</p>
                    <ul className="mt-2 space-y-1.5">
                      {team.openSlots
                        .filter((s) => !s.filled)
                        .map((slot) => (
                          <li key={slot.id} className="text-sm text-ink-muted">
                            <span className="text-cyan-soft">Butuh:</span> {slot.role}
                          </li>
                        ))}
                    </ul>
                    <LinkButton to="/cari-tim" variant="outline" size="sm" className="mt-3">
                      Lihat & lamar
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
