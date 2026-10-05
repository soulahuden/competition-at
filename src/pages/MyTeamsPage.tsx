import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Inbox,
  Lock,
  Plus,
  Star,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  Modal,
  SectionTitle,
} from '@/components/ui';
import { teamStatusLabel, teamStatusTone } from '@/components/domain/teamMeta';
import { CreateTeamWizard } from '@/features/create-team/CreateTeamWizard';
import { CheckoutPanel } from '@/features/checkout/CheckoutPanel';
import { PeerReviewModal } from '@/features/peer-review/PeerReviewModal';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatRupiah } from '@/lib/format';
import type { Team } from '@/types';

export default function MyTeamsPage() {
  const { teams, students, competitions, applications, loading, confirmMember, lockRoster, acceptApplication, rejectApplication, payRegistration } =
    useStore();
  const { currentUserId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [preselected, setPreselected] = useState<string | undefined>();
  const [payTeam, setPayTeam] = useState<Team | null>(null);
  const [reviewTeam, setReviewTeam] = useState<Team | null>(null);

  // Datang dari tombol "Daftarkan Tim" di halaman detail lomba.
  useEffect(() => {
    const state = location.state as { createForCompetition?: string } | null;
    if (state?.createForCompetition) {
      setPreselected(state.createForCompetition);
      setWizardOpen(true);
      navigate('/tim', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const myTeams = teams.filter((t) => t.members.some((m) => m.studentId === currentUserId));
  const captainTeamIds = teams.filter((t) => t.captainId === currentUserId).map((t) => t.id);
  const incoming = applications.filter(
    (a) => captainTeamIds.includes(a.teamId) && a.status === 'terkirim',
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="glass h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="My Teams"
        action={
          <Button
            onClick={() => {
              setPreselected(undefined);
              setWizardOpen(true);
            }}
          >
            <Plus size={16} /> Create team
          </Button>
        }
      />

      {incoming.length > 0 && (
        <section className="glass p-5" aria-labelledby="lamaran-masuk">
          <h2 id="lamaran-masuk" className="flex items-center gap-2 font-display text-lg font-semibold">
            <Inbox size={18} className="text-cyan" /> Applications
            <Badge tone="cyan">{incoming.length}</Badge>
          </h2>
          <ul className="mt-4 space-y-3">
            {incoming.map((app) => {
              const applicant = students.find((s) => s.id === app.applicantId);
              const team = teams.find((t) => t.id === app.teamId);
              const slot = team?.openSlots.find((s) => s.id === app.slotId);
              if (!applicant || !team) return null;

              const portfolio = applicant.portfolio.find((p) => p.id === app.portfolioId);

              return (
                <li key={app.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <Avatar name={applicant.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/profil/${applicant.id}`}
                          className="font-medium text-white hover:text-cyan-soft"
                        >
                          {applicant.name}
                        </Link>
                        <span className="text-xs text-ink-faint">
                          {applicant.major} · Class of {applicant.cohort}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-muted">
                        Applied for <span className="text-cyan-soft">{slot?.role ?? 'an open slot'}</span> on{' '}
                        {team.name}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">“{app.message}”</p>
                      {portfolio && (
                        <a
                          href={portfolio.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs text-cyan-soft underline underline-offset-4"
                        >
                          Portfolio: {portfolio.label}
                        </a>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => void acceptApplication(app.id)}>
                          <UserCheck size={15} /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void rejectApplication(app.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {myTeams.length === 0 ? (
        <EmptyState
          icon={<Users size={22} />}
          title="You're not on a team yet"
          description="Start your own, or apply for an open spot in Find a Team."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => setWizardOpen(true)}>Create team</Button>
              <Link
                to="/cari-tim"
                className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-ink transition hover:bg-white/10"
              >
                Find a team
              </Link>
            </div>
          }
        />
      ) : (
        <div className="space-y-4">
          {myTeams.map((team) => {
            const competition = competitions.find((c) => c.id === team.competitionId);
            const me = team.members.find((m) => m.studentId === currentUserId);
            const isCaptain = team.captainId === currentUserId;
            const openSlots = team.openSlots.filter((s) => !s.filled);
            const allConfirmed = team.members.every((m) => m.confirmed);

            return (
              <article key={team.id} className="glass overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl font-semibold text-white">{team.name}</h2>
                      <Badge tone={teamStatusTone[team.status]}>
                        {teamStatusLabel[team.status]}
                      </Badge>
                      {isCaptain && <Badge tone="cyan">Captain</Badge>}
                      {team.result && <Badge tone="amber">{team.result}</Badge>}
                    </div>
                    {competition && (
                      <Link
                        to={`/lomba/${competition.id}`}
                        className="mt-1 inline-block text-sm text-ink-muted hover:text-cyan-soft"
                      >
                        {competition.name} · {competition.tier}
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {me && !me.confirmed && (
                      <Button size="sm" onClick={() => void confirmMember(team.id, currentUserId)}>
                        <UserCheck size={15} /> Confirm my spot
                      </Button>
                    )}
                    {isCaptain && !team.paid && competition && competition.fee > 0 && (
                      <Button size="sm" variant="secondary" onClick={() => setPayTeam(team)}>
                        <Wallet size={15} /> Pay registration
                      </Button>
                    )}
                    {isCaptain && team.status === 'terkonfirmasi' && (
                      <Button size="sm" variant="outline" onClick={() => void lockRoster(team.id)}>
                        <Lock size={15} /> Lock roster
                      </Button>
                    )}
                    {team.status === 'selesai' && !team.peerReviewDone && (
                      <Button size="sm" onClick={() => setReviewTeam(team)}>
                        <Star size={15} /> Write peer review
                      </Button>
                    )}
                    {team.status === 'selesai' && team.peerReviewDone && (
                      <Badge tone="success" icon={<ClipboardCheck size={12} />}>
                        Peer review sent
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-ink-faint">
                      Members ({team.members.length})
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {team.members.map((member) => {
                        const student = students.find((s) => s.id === member.studentId);
                        if (!student) return null;
                        return (
                          <li
                            key={member.studentId}
                            className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                          >
                            <Avatar name={student.name} size="sm" />
                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/profil/${student.id}`}
                                className="text-sm font-medium text-white hover:text-cyan-soft"
                              >
                                {student.name}
                              </Link>
                              <p className="text-xs text-ink-muted">{member.role}</p>
                            </div>
                            {member.isCaptain && <Badge tone="cyan">Captain</Badge>}
                            <Badge tone={member.confirmed ? 'success' : 'amber'}>
                              {member.confirmed ? 'Confirmed' : 'Not confirmed'}
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>

                    {!allConfirmed && (
                      <p className="mt-3 rounded-xl border border-amber/25 bg-amber/10 p-3 text-xs text-amber-soft">
                        The team counts once every member confirms.
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wide text-ink-faint">
                        Open slots
                      </h3>
                      {openSlots.length === 0 ? (
                        <p className="mt-2 text-sm text-ink-muted">Roster is full.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {openSlots.map((slot) => (
                            <li
                              key={slot.id}
                              className="rounded-xl border border-dashed border-cyan/30 bg-cyan/5 p-3"
                            >
                              <p className="text-sm font-medium text-cyan-soft">{slot.role}</p>
                              {slot.skills.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                  {slot.skills.map((sk) => (
                                    <Badge key={sk} tone="outline">
                                      {sk}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <dl className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-faint">Roster locks</dt>
                        <dd className="text-ink">{formatDate(team.rosterLockDate)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-faint">Registration fee</dt>
                        <dd className="text-ink">{formatRupiah(competition?.fee ?? 0)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-faint">Payment</dt>
                        <dd>
                          <Badge tone={team.paid ? 'success' : 'amber'}>
                            {team.paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CreateTeamWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        preselectedCompetitionId={preselected}
      />

      {payTeam && (
        <Modal
          open={Boolean(payTeam)}
          onClose={() => setPayTeam(null)}
          title="Registration checkout"
          description={payTeam.name}
        >
          {(() => {
            const competition = competitions.find((c) => c.id === payTeam.competitionId);
            if (!competition) return null;
            return (
              <CheckoutPanel
                competition={competition}
                teamName={payTeam.name}
                memberCount={payTeam.members.length}
                onPaid={async (method) => {
                  await payRegistration(payTeam.id, method);
                }}
                onCancel={() => setPayTeam(null)}
              />
            );
          })()}
        </Modal>
      )}

      {reviewTeam && (
        <PeerReviewModal
          open={Boolean(reviewTeam)}
          onClose={() => setReviewTeam(null)}
          team={reviewTeam}
        />
      )}
    </div>
  );
}
