import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  LinkButton,
  SectionTitle,
  StatCard,
} from '@/components/ui';
import { CompetitionCard } from '@/components/domain/CompetitionCard';
import { teamStatusLabel, teamStatusTone } from '@/components/domain/teamMeta';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { getRecommendedCompetitions } from '@/services/competitionService';
import { getMyRank } from '@/services/leaderboardService';
import { formatDate, formatNumber, relativeTime } from '@/lib/format';
import { reliabilityView } from '@/lib/reliability';
import type { Competition, LeaderboardEntry } from '@/types';

export default function DashboardPage() {
  const { students, teams, recruitments, competitions, loading, version, confirmMember } = useStore();
  const { currentUserId } = useAuth();
  const { notifications } = useNotifications();

  const [recommended, setRecommended] = useState<Competition[]>([]);
  const [rank, setRank] = useState<LeaderboardEntry | undefined>();

  const me = students.find((s) => s.id === currentUserId);

  useEffect(() => {
    let active = true;
    void Promise.all([
      getRecommendedCompetitions(currentUserId),
      getMyRank(currentUserId),
    ]).then(([comps, myRank]) => {
      if (!active) return;
      setRecommended(comps);
      setRank(myRank);
    });
    return () => {
      active = false;
    };
  }, [currentUserId, version]);

  if (loading || !me) return <div className="glass h-96 animate-pulse" />;

  const myTeams = teams.filter((t) => t.members.some((m) => m.studentId === currentUserId));
  const activeTeams = myTeams.filter((t) => t.status !== 'selesai');
  const view = reliabilityView(me);
  const pendingReview = myTeams.filter((t) => t.status === 'selesai' && !t.peerReviewDone);

  // Lowongan yang skill-nya cocok dengan milik user, di luar tim sendiri.
  const matchingRecruitments = recruitments
    .filter((r) => r.captainId !== currentUserId)
    .map((r) => ({
      recruitment: r,
      matched: r.skills.filter((s) => me.skills.includes(s)),
    }))
    .filter((r) => r.matched.length > 0)
    .slice(0, 3);

  const needsMyConfirmation = myTeams.filter((t) =>
    t.members.some((m) => m.studentId === currentUserId && !m.confirmed),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Hi, {me.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {me.major} · Class of {me.cohort}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton to="/lomba" size="sm">
            Browse competitions
          </LinkButton>
          <LinkButton to="/cari-tim" variant="outline" size="sm">
            Find a team
          </LinkButton>
        </div>
      </header>

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Leaderboard rank"
          value={rank ? `#${rank.rank}` : 'Unranked'}
          sub={rank ? `from ${rank.competitions} competitions this semester` : 'Not ranked yet'}
          icon={<Trophy size={16} />}
          tone="amber"
        />
        <StatCard
          label="Points this semester"
          value={formatNumber(rank?.totalPoints ?? 0)}
          sub={
            rank
              ? `${formatNumber(rank.activityPoints)} activity + ${formatNumber(rank.winPoints)} wins`
              : 'Join a competition on COM@T to start earning points'
          }
          icon={<Sparkles size={16} />}
          tone="cyan"
        />
        <StatCard
          label="Reliability score"
          value={view.hasEnoughData ? view.score : 'Not enough data'}
          sub={view.hasEnoughData ? view.label : 'Needs at least 3 competitions'}
          icon={<ShieldCheck size={16} />}
          tone={view.hasEnoughData ? 'violet' : 'neutral'}
        />
        <StatCard
          label="Active teams"
          value={activeTeams.length}
          sub={`${myTeams.length} teams total`}
          icon={<Users size={16} />}
          tone="cyan"
        />
      </section>

      {(needsMyConfirmation.length > 0 || pendingReview.length > 0) && (
        <section className="space-y-3">
          {needsMyConfirmation.map((team) => (
            <div
              key={team.id}
              className="glass flex flex-wrap items-center justify-between gap-3 border-amber/30 bg-amber/10 p-4"
            >
              <p className="text-sm text-amber-soft">
                You were invited to <span className="font-semibold">{team.name}</span> and haven't
                confirmed yet.
              </p>
              <Button size="sm" onClick={() => void confirmMember(team.id, currentUserId)}>
                <UserCheck size={15} /> Confirm
              </Button>
            </div>
          ))}
          {pendingReview.map((team) => (
            <div
              key={team.id}
              className="glass flex flex-wrap items-center justify-between gap-3 border-violet/30 bg-violet/10 p-4"
            >
              <p className="text-sm text-violet-soft">
                <span className="font-semibold">{team.name}</span> has finished competing. Your peer
                review is waiting.
              </p>
              <LinkButton to="/tim" size="sm" variant="secondary">
                <Star size={15} /> Write peer review
              </LinkButton>
            </div>
          ))}
        </section>
      )}

      <section>
        <SectionTitle
          title="Competitions for you"
          description={`Based on your interests: ${me.interests.join(', ')}.`}
          action={
            <Link
              to="/lomba"
              className="inline-flex items-center gap-1.5 text-sm text-cyan-soft hover:text-white"
            >
              See all <ArrowRight size={15} />
            </Link>
          }
        />
        {recommended.length === 0 ? (
          <EmptyState
            title="No suggestions yet"
            description="Add your interests to your profile."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionTitle
            title="Teams looking for your skills"
            action={
              <Link
                to="/cari-tim"
                className="inline-flex items-center gap-1.5 text-sm text-cyan-soft hover:text-white"
              >
                All open spots <ArrowRight size={15} />
              </Link>
            }
          />
          {matchingRecruitments.length === 0 ? (
            <EmptyState
              icon={<Users size={20} />}
              title="No teams need your skills right now"
            />
          ) : (
            <ul className="space-y-3">
              {matchingRecruitments.map(({ recruitment: r, matched }) => (
                <li key={r.id} className="glass flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{r.title}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {r.teamName} · {r.commitment}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {r.skills.map((s) => (
                        <Badge key={s} tone={matched.includes(s) ? 'cyan' : 'outline'}>
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <LinkButton to="/cari-tim" size="sm" variant="outline">
                    View and apply
                  </LinkButton>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section>
            <SectionTitle title="My teams" />
            {activeTeams.length === 0 ? (
              <EmptyState
                icon={<Users size={20} />}
                title="No active teams"
                action={
                  <LinkButton to="/tim" size="sm">
                    Create a team
                  </LinkButton>
                }
              />
            ) : (
              <ul className="space-y-3">
                {activeTeams.map((team) => {
                  const competition = competitions.find((c) => c.id === team.competitionId);
                  const unconfirmed = team.members.filter((m) => !m.confirmed).length;
                  return (
                    <li key={team.id} className="glass p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-white">{team.name}</p>
                        <Badge tone={teamStatusTone[team.status]}>
                          {teamStatusLabel[team.status]}
                        </Badge>
                      </div>
                      {competition && (
                        <p className="mt-1 text-xs text-ink-muted">{competition.name}</p>
                      )}
                      <div className="mt-2.5 flex -space-x-2">
                        {team.members.map((m) => {
                          const s = students.find((x) => x.id === m.studentId);
                          return s ? (
                            <Avatar
                              key={m.studentId}
                              name={s.name}
                              size="xs"
                              className="ring-2 ring-space-900"
                            />
                          ) : null;
                        })}
                      </div>
                      <p className="mt-2.5 text-xs text-ink-faint">
                        {unconfirmed > 0
                          ? `${unconfirmed} not confirmed yet`
                          : 'Everyone confirmed'}{' '}
                        · Roster locks {formatDate(team.rosterLockDate)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle title="Recent notifications" />
            {notifications.length === 0 ? (
              <EmptyState icon={<Bell size={20} />} title="No notifications yet" />
            ) : (
              <ul className="glass divide-y divide-white/5 overflow-hidden">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id}>
                    <Link
                      to={n.href ?? '/dashboard'}
                      className="flex gap-3 p-4 transition hover:bg-white/5"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.read ? 'bg-white/20' : 'bg-cyan'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-white">{n.title}</span>
                        <span className="mt-0.5 block text-xs text-ink-muted">{n.body}</span>
                        <span className="mt-1 block text-[11px] text-ink-faint">
                          {relativeTime(n.createdAt)}
                        </span>
                      </span>
                    </Link>
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
