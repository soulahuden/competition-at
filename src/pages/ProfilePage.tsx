import { Link, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  Clock3,
  ExternalLink,
  FileText,
  Github,
  Palette,
  ShieldQuestion,
  UserCheck,
} from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, StatCard } from '@/components/ui';
import type { BadgeTone } from '@/components/ui';
import { ReliabilityScore } from '@/components/domain/ReliabilityScore';
import { tierTone } from '@/components/domain/competitionMeta';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { formatNumber } from '@/lib/format';
import { MIN_COMPETITIONS_FOR_SCORE, reliabilityView } from '@/lib/reliability';
import NotFoundPage from './NotFoundPage';
import type { HistoryRecord, PortfolioItem } from '@/types';

const verificationLabel = {
  penyelenggara: 'Verified by organizer',
  tim: 'Verified by team',
  menunggu: 'Pending verification',
} as const;

const verificationTone: Record<keyof typeof verificationLabel, BadgeTone> = {
  penyelenggara: 'success',
  tim: 'cyan',
  menunggu: 'amber',
};

const outcomeTone = (outcome: HistoryRecord['outcome']): BadgeTone => {
  if (outcome === '1st place') return 'amber';
  if (outcome === '2nd place' || outcome === '3rd place') return 'violet';
  if (outcome === 'Finalist') return 'cyan';
  if (outcome === 'Withdrew') return 'danger';
  return 'outline';
};

const portfolioIcon = (type: PortfolioItem['type']) => {
  if (type === 'repo') return <Github size={15} />;
  if (type === 'desain') return <Palette size={15} />;
  if (type === 'esai') return <FileText size={15} />;
  return <ExternalLink size={15} />;
};

export default function ProfilePage() {
  const { id } = useParams();
  const { students, teams, loading, toggleLookingForTeam, claimProfile } = useStore();
  const { currentUserId } = useAuth();

  const student = students.find((s) => s.id === id);

  if (loading) return <div className="glass h-96 animate-pulse" />;
  if (!student) return <NotFoundPage />;

  const isMe = student.id === currentUserId;
  const view = reliabilityView(student);
  const activeTeams = teams.filter(
    (t) => t.members.some((m) => m.studentId === student.id) && t.status !== 'selesai',
  );

  return (
    <div className="space-y-6">
      {!student.claimed && (
        <div className="glass flex flex-wrap items-center justify-between gap-4 border-amber/30 bg-amber/10 p-5">
          <div>
            <p className="font-display font-semibold text-amber-soft">Is this you? Claim this profile</p>
            <p className="mt-1 text-sm text-ink-muted">
              Built from campus achievement records. Nobody has claimed it yet.
            </p>
          </div>
          <Button variant="secondary" onClick={() => void claimProfile(student.id)}>
            <UserCheck size={16} /> Claim profile
          </Button>
        </div>
      )}

      <header className="glass p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-5">
          <Avatar name={student.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{student.name}</h1>
            <p className="mt-1 text-ink-muted">
              {student.major} · Class of {student.cohort}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{student.bio}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {isMe ? (
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2">
                  <span className="text-sm text-ink">Looking for a team</span>
                  <input
                    type="checkbox"
                    checked={student.lookingForTeam}
                    onChange={(e) => void toggleLookingForTeam(student.id, e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`relative h-5 w-9 rounded-full transition ${
                      student.lookingForTeam ? 'bg-cyan' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                        student.lookingForTeam ? 'left-[1.125rem]' : 'left-0.5'
                      }`}
                    />
                  </span>
                </label>
              ) : (
                <Badge tone={student.lookingForTeam ? 'success' : 'outline'}>
                  {student.lookingForTeam ? 'Looking for a team' : 'Not looking for a team'}
                </Badge>
              )}
              {activeTeams.length > 0 && (
                <Badge tone="violet">{activeTeams.length} active {activeTeams.length === 1 ? 'team' : 'teams'}</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total points"
          value={formatNumber(student.activityPoints + student.winPoints)}
          sub={`${formatNumber(student.activityPoints)} activity + ${formatNumber(student.winPoints)} wins`}
          tone="amber"
        />
        <StatCard label="Competitions" value={student.competitionsJoined} tone="cyan" />
        <StatCard
          label="Reliability score"
          value={
            view.hasEnoughData ? (
              <ReliabilityScore student={student} size="lg" showLabel={false} />
            ) : (
              <span className="text-base text-ink-faint">Not enough data</span>
            )
          }
          sub={
            view.hasEnoughData
              ? view.label
              : `Shows after ${MIN_COMPETITIONS_FOR_SCORE} competitions`
          }
          icon={!view.hasEnoughData ? <ShieldQuestion size={16} /> : undefined}
        />
        <StatCard label="Achievements" value={student.achievements.length} tone="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="glass p-5">
            <h2 className="font-display text-lg font-semibold">Competition history</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Losses and withdrawals included.
            </p>
            {student.history.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No competitions yet" />
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {student.history.map((h) => (
                  <li
                    key={h.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white">{h.competitionName}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {h.teamName} · {h.year}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={tierTone[h.tier]}>{h.tier}</Badge>
                      <Badge tone={outcomeTone(h.outcome)}>{h.outcome}</Badge>
                      <span className="font-display text-sm font-semibold text-amber">
                        +{formatNumber(h.points)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass p-5">
            <h2 className="font-display text-lg font-semibold">Achievements</h2>
            {student.achievements.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No achievements yet" />
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {student.achievements.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white">{a.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {a.competitionName} · {a.year}
                      </p>
                    </div>
                    <Badge
                      tone={verificationTone[a.verification]}
                      icon={
                        a.verification === 'menunggu' ? (
                          <Clock3 size={12} />
                        ) : (
                          <BadgeCheck size={12} />
                        )
                      }
                    >
                      {verificationLabel[a.verification]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass p-5">
            <h2 className="font-display text-lg font-semibold">Skill</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {student.skills.map((s) => (
                <Badge key={s} tone="cyan">
                  {s}
                </Badge>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-medium uppercase tracking-wide text-ink-faint">
              Interests
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.interests.map((i) => (
                <Badge key={i} tone="violet">
                  {i}
                </Badge>
              ))}
            </div>
          </section>

          <section className="glass p-5">
            <h2 className="font-display text-lg font-semibold">Portfolio</h2>
            {student.portfolio.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No portfolio links yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {student.portfolio.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-ink transition hover:border-cyan/40 hover:text-white"
                    >
                      <span className="text-cyan-soft">{portfolioIcon(p.type)}</span>
                      <span className="min-w-0 flex-1 truncate">{p.label}</span>
                      <ExternalLink size={14} className="shrink-0 text-ink-faint" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {activeTeams.length > 0 && (
            <section className="glass p-5">
              <h2 className="font-display text-lg font-semibold">Active teams</h2>
              <ul className="mt-3 space-y-2">
                {activeTeams.map((t) => (
                  <li key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <Link to="/tim" className="mt-1 inline-block text-xs text-cyan-soft">
                      View team
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
